class BackgroundEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = 'background-canvas';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.mouse = { x: 0, y: 0 };
        this.lastTime = 0;
        this.gradient = {
            angle: 0,
            colors: [
                { h: 230, s: 40, l: 12 },
                { h: 260, s: 45, l: 15 },
                { h: 290, s: 40, l: 12 }
            ]
        };
        
        this.particles = Array(50).fill().map(() => ({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.25
        }));
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.resize();
        window.addEventListener('resize', () => this.resize(), false);
        
        this.animate();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    createGradient() {
        const { width, height, ctx, gradient, mouse } = this;
        
        // Dynamic gradient center based on mouse position
        const centerX = mouse.x || width / 2;
        const centerY = mouse.y || height / 2;
        const radius = Math.max(width, height);
        
        gradient.colors.forEach(color => {
            color.h = (color.h + 0.02) % 360;
        });

        const grd = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );

        gradient.colors.forEach((color, i) => {
            grd.addColorStop(i / (gradient.colors.length - 1), 
                `hsla(${color.h}, ${color.s}%, ${color.l}%, 1)`);
        });

        return grd;
    }

    drawParticles() {
        const { ctx, width, height, mouse } = this;
        
        this.particles.forEach(p => {
            // Mouse interaction
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const angle = Math.atan2(dy, dx);
                p.x += Math.cos(angle) * 0.5;
                p.y += Math.sin(angle) * 0.5;
            }
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap around screen
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
        });
    }

    animate(timestamp = 0) {
        const { ctx, width, height } = this;
        
        // Clear canvas
        ctx.fillStyle = this.createGradient();
        ctx.fillRect(0, 0, width, height);
        
        // Draw particles
        this.drawParticles();
        
        // Add subtle overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        requestAnimationFrame((ts) => this.animate(ts));
    }
}

// Initialize background once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundEffect();
});
