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
    const handleMove = (x, y) => {
      if (!this.rotating) {
        this.mouseX = x;
        this.mouseY = y;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = x - this.mouseTouchX;
      const dirY = y - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
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

    const mouseMove = (e) => handleMove(e.clientX, e.clientY);
    const touchMove = (e) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("touchmove", touchMove);

    const startInteraction = (x, y, isRotation) => {
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      this.mouseTouchX = x;
      this.mouseTouchY = y;
      this.prevMouseX = x;
      this.prevMouseY = y;
      this.rotating = isRotation;
    };

    paper.addEventListener("mousedown", (e) => {
      if (this.holdingPaper) return;
      if (e.button === 0) {
        startInteraction(e.clientX, e.clientY, false);
      }
      if (e.button === 2) {
        startInteraction(e.clientX, e.clientY, true);
      }
    });

    paper.addEventListener("touchstart", (e) => {
      if (this.holdingPaper) return;
      const touch = e.touches[0];
      startInteraction(touch.clientX, touch.clientY, false);
    });

    const endInteraction = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    window.addEventListener("mouseup", endInteraction);
    window.addEventListener("touchend", endInteraction);
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
