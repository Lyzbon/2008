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
    // Mouse move
    document.addEventListener("mousemove", (e) => {
      this.handleMove(e.clientX, e.clientY, paper);
    });

    // Touch move
    document.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.handleMove(touch.clientX, touch.clientY, paper);
      }
    }, { passive: false });

    // Mouse down
    paper.addEventListener("mousedown", (e) => {
      this.handleStart(e.clientX, e.clientY, e.button);
      paper.style.zIndex = highestZ++;
    });

    // Touch start
    paper.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.handleStart(touch.clientX, touch.clientY, 0);
        paper.style.zIndex = highestZ++;
      }
    }, { passive: false });

    // Mouse up
    window.addEventListener("mouseup", () => {
      this.handleEnd();
    });

    // Touch end / cancel
    window.addEventListener("touchend", () => {
      this.handleEnd();
    });
    window.addEventListener("touchcancel", () => {
      this.handleEnd();
    });
  }

  handleMove(x, y, paper) {
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
  }

  handleStart(x, y, button) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    if (button === 0) {
      this.mouseTouchX = x;
      this.mouseTouchY = y;
      this.prevMouseX = x;
      this.prevMouseY = y;
      this.rotating = false;
    }
    if (button === 2) {
      this.rotating = true;
    }
  }

  handleEnd() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
//plese god
