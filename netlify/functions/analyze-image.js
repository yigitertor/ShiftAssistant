import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req, context) => {
    // Sadece POST isteklerini kabul et
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        // Request body'sini al
        const body = await req.json();
        const { image, name } = body;

        if (!image || !name) {
            return new Response(JSON.stringify({ error: "Image and name are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // API Key kontrolü
        // Netlify Functions (Node.js) için standart process.env kullanımı
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

        const prompt = `
      Analyze this image of a shift schedule.
      Find the shifts for the person named "${name}".
      Return ONLY a JSON array of numbers representing the days of the month where this person has a shift.
      Example response: [1, 5, 12, 20]
      If no shifts are found for this name, return [].
      Do not include any markdown formatting or explanation, just the raw JSON array.
    `;

        const inputParts = [
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ];

        let result;
        let usedModel = "gemini-1.5-flash";

        try {
            console.log(`Attempting with model: ${usedModel}`);
            const model = genAI.getGenerativeModel({ model: usedModel });
            result = await model.generateContent(inputParts);
        } catch (error) {
            console.warn(`Failed with ${usedModel}:`, error.message);
            // Fallback: gemini-pro-vision (Eski ama güvenilir model)
            usedModel = "gemini-pro-vision";
            console.log(`Fallback to model: ${usedModel}`);
            const model = genAI.getGenerativeModel({ model: usedModel });
            result = await model.generateContent(inputParts);
        }

        const responseText = result.response.text();

        // JSON temizleme (Markdown blocklarını kaldır)
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const shifts = JSON.parse(cleanedText);

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
