// 点击烟花粒子爆炸特效
(function () {
    "use strict";

    // 创建全屏 Canvas
    var canvas = document.createElement("canvas");
    canvas.id = "click-firework-canvas";
    canvas.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;";
    document.addEventListener("DOMContentLoaded", function () {
        document.body.appendChild(canvas);
        resizeCanvas();
    });

    var ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);

    // 粒子数组
    var particles = [];

    // 颜色调色板
    var colors = [
        "#ff4757", "#ffa502", "#feca57", "#48dbfb",
        "#0abde3", "#5f27cd", "#ee5253", "#ff9ff3",
        "#54a0ff", "#5eead4", "#f368e0", "#ff6348"
    ];

    function randomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 粒子类
    function Particle(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;

        var angle = Math.random() * Math.PI * 2;
        var speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.size = Math.random() * 3 + 2;
        this.life = 1.0;
        this.decay = Math.random() * 0.015 + 0.015;
        this.gravity = 0.08;
    }

    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.life -= this.decay;
    };

    Particle.prototype.draw = function (ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fill();
        // 光晕
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    };

    // 创建爆炸效果
    function createExplosion(x, y) {
        var color = randomColor();
        var count = 20 + Math.floor(Math.random() * 10);
        for (var i = 0; i < count; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    // 动画循环
    function animate() {
        // 清除画布（带拖尾效果）
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.update();
            p.draw(ctx);
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    // 监听点击事件
    document.addEventListener("click", function (e) {
        // 排除链接和按钮上的点击（可选）
        createExplosion(e.clientX, e.clientY);
    });

    // 移动端触摸支持
    document.addEventListener("touchstart", function (e) {
        var touch = e.touches[0];
        if (touch) createExplosion(touch.clientX, touch.clientY);
    });
})();
