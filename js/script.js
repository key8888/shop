document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. マウス軌跡のパーティクルエフェクト
    // ==========================================
    const canvas = document.getElementById('magic-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];
        let mouse = { x: -1000, y: -1000 };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            // マウス移動時にパーティクルを生成
            for (let i = 0; i < 2; i++) {
                particles.push(new Particle(mouse.x, mouse.y));
            }
        });

        class Particle {
            constructor(x, y) {
                this.x = x + (Math.random() - 0.5) * 15;
                this.y = y + (Math.random() - 0.5) * 15;
                this.size = Math.random() * 2.5 + 0.5; 
                this.speedX = (Math.random() - 0.5) * 1.0; 
                this.speedY = (Math.random() - 0.5) * 1.0 - 0.5; 
                this.life = 1.0; 
                // ゴールドとシルバー系のカラー
                this.color = Math.random() > 0.4 ? '#CFB53B' : '#EBE5D9';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= 0.02; // 徐々にフェードアウト
                this.size *= 0.96; 
            }
            draw() {
                ctx.globalAlpha = Math.max(0, this.life);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].life <= 0 || particles[i].size <= 0.1) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==========================================
    // 2. モーダル（画像拡大）の制御
    // ==========================================
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.getElementById("modal-close-btn");

    window.openModal = function(card) {
        const img = card.querySelector(".screenshot-img");
        if (!img) return;
        
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    };

    window.closeModal = function() {
        if(modal) modal.classList.remove("open");
        document.body.style.overflow = "";
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    
    if (modal) {
        modal.addEventListener("click", function(e) {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    // ==========================================
    // 3. スムーススクロール
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });
});