import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req, context) => {
    // Sadece POST isteklerini kabul et
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        // Request body'sini al
        const body = await req.json();
        const { image, name, mimeType } = body;

        if (!image || !name) {
            return new Response(JSON.stringify({ error: "Image and name are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // API Key kontrolü
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("API Key is missing in process.env");
            return new Response(JSON.stringify({ error: "Server configuration error: API Key missing" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Gemini API Kurulumu
        const genAI = new GoogleGenerativeAI(apiKey);

        // Base64 başlığını temizle (data:image/png;base64,...)
        const base64Data = image.split(",")[1];

        // MIME type — client'tan gelen değeri kullan, yoksa jpeg varsayılan
        const imageMimeType = mimeType || "image/jpeg";

        const prompt = `
      Analyze this image of a shift schedule.
      Find the shifts for the person named "${name}".

      Try to detect the SHIFT TYPE for each day:
      - "day" = daytime shift (gündüz, 08:00-16:00, or similar)
      - "night" = night shift (gece, 16:00-08:00, or similar)
      - "full" = 24-hour shift (24 saat, nöbet, or similar)

      Return ONLY a JSON array of objects with "day" (number) and "type" (string) fields.
      Example response: [{"day": 1, "type": "night"}, {"day": 5, "type": "day"}, {"day": 12, "type": "full"}]
      If you cannot determine the shift type, default to "night".
      If no shifts are found for this name, return [].
      Do not include any markdown formatting or explanation, just the raw JSON array.
    `;

        const inputParts = [
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: imageMimeType,
                },
            },
        ];

        let result;
        let usedModel = "gemini-2.0-flash";

        try {
            console.log(`Attempting with model: ${usedModel}, mimeType: ${imageMimeType}`);
            const model = genAI.getGenerativeModel({ model: usedModel });
            result = await model.generateContent(inputParts);
        } catch (error) {
            console.warn(`Failed with ${usedModel}:`, error.message);
            usedModel = "gemini-1.5-pro";
            console.log(`Fallback to model: ${usedModel}`);
            const model = genAI.getGenerativeModel({ model: usedModel });
            result = await model.generateContent(inputParts);
        }

        const responseText = result.response.text();

        // JSON temizleme (Markdown blocklarını kaldır)
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedText);

        // Backward compat: eski format [1,5,12] → yeni format [{day:1,type:"night"},...]
        let shifts;
        if (Array.isArray(parsed) && parsed.length > 0) {
            if (typeof parsed[0] === 'number') {
                // Eski format — sadece sayı dizisi
                shifts = parsed.map(day => ({ day, type: "night" }));
            } else {
                // Yeni format — obje dizisi, type'ı doğrula
                const validTypes = ["day", "night", "full"];
                shifts = parsed.map(s => ({
                    day: s.day,
                    type: validTypes.includes(s.type) ? s.type : "night"
                }));
            }
        } else {
            shifts = [];
        }

        return new Response(JSON.stringify({ shifts, usedModel }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Gemini API Error:", error);

        const errorMessage = error.message || error.toString() || "Unknown Error";
        const errorDetails = {
            message: errorMessage,
            name: error.name,
            stack: error.stack,
            fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
        };

        return new Response(JSON.stringify({
            error: errorMessage,
            details: JSON.stringify(errorDetails)
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
