// 点击文字飘浮特效 - Ciallo 版
(function () {
    "use strict";

    // 文字池
    var texts = [
        "Ciallo～(∠・ω< )⌒☆",
        "Ciallo～(∠・ω< )⌒☆",
        "Ciallo～(∠・ω< )⌒☆",
        "√",
        "☆",
        "～",
    ];

    // 颜色调色板
    var colors = [
        "#ff6b9d", "#c44dff", "#4fc3f7", "#ffd54f",
        "#ff8a65", "#81c784", "#ba68c8", "#4dd0e1",
    ];

    // 创建全屏 Canvas
    var canvas = document.createElement("canvas");
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

    // 飘浮文字数组
    var floatTexts = [];

    function randomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function randomText() {
        return texts[Math.floor(Math.random() * texts.length)];
    }

    // 飘浮文字类
    function FloatText(x, y, text, color) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;

        // 随机偏移角度，略微往两侧扩散
        var angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
        var speed = Math.random() * 1.5 + 1.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.life = 1.0;
        this.decay = 0.008 + Math.random() * 0.005;
        this.size = 16 + Math.random() * 10;
        this.rotation = (Math.random() - 0.5) * 0.5;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.03 + Math.random() * 0.02;
    }

    FloatText.prototype.update = function () {
        this.x += this.vx + Math.sin(this.wobble) * 0.5;
        this.y += this.vy;
        this.vy += 0.02; // 轻微重力
        this.vx *= 0.99;
        this.life -= this.decay;
        this.rotation += this.rotationSpeed;
        this.wobble += this.wobbleSpeed;
    };

    FloatText.prototype.draw = function (ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.font = "bold " + this.size + "px 'Segoe UI', 'Microsoft YaHei', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // 光晕
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;

        // 描边
        ctx.strokeStyle = "rgba(255,255,255," + this.life * 0.8 + ")";
        ctx.lineWidth = 3;
        ctx.strokeText(this.text, 0, 0);

        // 填充
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, 0, 0);

        ctx.restore();
    };

    // 创建一组飘浮文字
    function spawnFloatTexts(x, y) {
        var count = 3 + Math.floor(Math.random() * 3);
        for (var i = 0; i < count; i++) {
            var ox = x + (Math.random() - 0.5) * 30;
            var oy = y + (Math.random() - 0.5) * 15;
            floatTexts.push(new FloatText(ox, oy, randomText(), randomColor()));
        }
    }

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = floatTexts.length - 1; i >= 0; i--) {
            var ft = floatTexts[i];
            ft.update();
            ft.draw(ctx);
            if (ft.life <= 0) {
                floatTexts.splice(i, 1);
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    // 监听点击
    document.addEventListener("click", function (e) {
        spawnFloatTexts(e.clientX, e.clientY);
    });

    // 移动端触摸
    document.addEventListener("touchstart", function (e) {
        var touch = e.touches[0];
        if (touch) spawnFloatTexts(touch.clientX, touch.clientY);
    });
})();
