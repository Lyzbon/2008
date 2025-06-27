let highestZ = 1;
class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Função para atualizar posição baseado no evento (mouse ou touch)
    const updatePos = (x, y) => {
      if (!this.rotating) {
        this.mouseX = x;
        this.mouseY = y;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      const dirX = x - this.mouseTouchX;
      const dirY = y - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY) || 1; // evitar divisão por zero
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }
      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Mouse move
    document.addEventListener("mousemove", (e) => {
      updatePos(e.clientX, e.clientY);
    });

    // Touch move
    document.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updatePos(touch.clientX, touch.clientY);
      }
    }, { passive: false });

    // Mouse down
    paper.addEventListener("mousedown", (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      if (e.button === 0) {
        this.mouseTouchX = e.clientX;
        this.mouseTouchY = e.clientY;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });

    // Touch start (equivale a mousedown)
    paper.addEventListener("touchstart", (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.mouseTouchX = touch.clientX;
        this.mouseTouchY = touch.clientY;
        this.prevMouseX = touch.clientX;
        this.prevMouseY = touch.clientY;
      }
      // Para mobile, deixamos sempre mover, sem rotacionar por botão direito
      this.rotating = false;
      e.preventDefault(); // evitar scroll durante o toque
    }, { passive: false });

    // Mouse up
    window.addEventListener("mouseup", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Touch end
    window.addEventListener("touchend", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
