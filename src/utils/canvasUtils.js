export const drawDecorativePattern = (ctx, width, height, theme) => {
    if (!theme.decorative) return;
    ctx.save();

    // ÖZEL ÇİZİM MANTIKLARI
    if (theme.customDraw === 'space') {
        // Yıldızlar
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = Math.random() * 2;
            ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#a78bfa';
            ctx.globalAlpha = Math.random() * 0.8 + 0.2;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fill();
        }
        // Nebula Efekti
        const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
        grad.addColorStop(0, 'rgba(76, 29, 149, 0.1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
    }
    else if (theme.customDraw === 'snow') {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = Math.random() * 4 + 1;
            ctx.globalAlpha = Math.random() * 0.4 + 0.1;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    else if (theme.customDraw === 'grid') {
        ctx.strokeStyle = theme.secondary;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        const gridSize = 60;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }
    }

    // EMOJİLER (Daha belirgin)
    if (theme.emoji) {
        const emojiCount = theme.id === 'galaxy' ? 15 : 30; // Galaxy'de az ama büyük gezegenler
        ctx.globalAlpha = theme.type === 'dark' ? 0.3 : 0.2;
        ctx.font = theme.id === 'galaxy' ? "60px serif" : "45px serif";

        for (let i = 0; i < emojiCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const rotation = Math.random() * Math.PI * 2;
            const scale = 0.8 + Math.random() * 0.5;

            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.scale(scale, scale);
            ctx.fillText(theme.emoji, 0, 0);

            // Ekstra emojiler
            if (theme.id === 'galaxy') {
                if (i % 4 === 0) ctx.fillText('🪐', 80, 80);
                if (i % 4 === 1) ctx.fillText('🌍', -50, 50);
                if (i % 4 === 2) ctx.fillText('☄️', 50, -50);
            }
            if (theme.id === 'coffee' && i % 3 === 0) ctx.fillText('🥐', 40, 40);
            if (theme.id === 'winter' && i % 3 === 0) ctx.fillText('⛄', 40, 40);
            if (theme.id === 'retro' && i % 3 === 0) ctx.fillText('📼', 40, 40);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    // Alt Dekoratif Dalga (Opsiyonel, bazı temalarda kapatılabilir)
    if (!['galaxy', 'cyberpunk', 'minimal'].includes(theme.id)) {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = theme.secondary;
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.quadraticCurveTo(width / 4, height - 150, width / 2, height - 50);
        ctx.quadraticCurveTo(3 * width / 4, height + 50, width, height - 100);
        ctx.lineTo(width, height);
        ctx.fill();
    }

    ctx.restore();
};
