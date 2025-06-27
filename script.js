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
    // ======= MOUSE EVENTS =======
    document.addEventListener("mousemove", (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      this.updateTransform(paper);
    });

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
        e.preventDefault(); // evitar menu contexto no botão direito
        this.rotating = true;
      }
    });

    window.addEventListener("mouseup", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // ======= TOUCH EVENTS =======
    paper.addEventListener("touchstart", (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      const touch = e.touches[0];
      this.mouseTouchX = touch.clientX;
      this.mouseTouchY = touch.clientY;
      this.prevMouseX = touch.clientX;
      this.prevMouseY = touch.clientY;

      // Para mobile, vamos rotacionar se for toque com dois dedos
      if (e.touches.length === 2) {
        this.rotating = true;
        // calcula ângulo inicial entre dois dedos
        this.initialAngle = this.getAngle(
          e.touches[0].clientX,
          e.touches[0].clientY,
          e.touches[1].clientX,
          e.touches[1].clientY
        );
      }
    }, { passive: false });

    paper.addEventListener("touchmove", (e) => {
      e.preventDefault(); // evitar scroll ao arrastar
      const touch = e.touches[0];

      if (this.rotating && e.touches.length === 2) {
        // calcula ângulo atual entre dois dedos para rotacionar
        const angle = this.getAngle(
          e.touches[0].clientX,
          e.touches[0].clientY,
          e.touches[1].clientX,
          e.touches[1].clientY
        );
        let deltaAngle = angle - this.initialAngle;
        this.rotation += deltaAngle;
        this.initialAngle = angle;
      } else if (this.holdingPaper) {
        this.mouseX = touch.clientX;
        this.mouseY = touch.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }

      this.updateTransform(paper);
    }, { passive: false });

    window.addEventListener("touchend", (e) => {
      if (e.touches.length < 2) {
        this.rotating = false;
      }
      if (e.touches.length === 0) {
        this.holdingPaper = false;
      }
    });
  }

  updateTransform(paper) {
    if (this.holdingPaper || this.rotating) {
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  getAngle(x1, y1, x2, y2) {
    return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
