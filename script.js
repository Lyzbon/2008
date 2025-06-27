init(paper) {
  const getTouch = (e) => e.touches ? e.touches[0] : e;

  const moveHandler = (e) => {
    const touch = getTouch(e);
    if (!this.rotating) {
      this.mouseX = touch.clientX;
      this.mouseY = touch.clientY;
      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    }

    const dirX = touch.clientX - this.mouseTouchX;
    const dirY = touch.clientY - this.mouseTouchY;
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

  document.addEventListener("mousemove", moveHandler);
  document.addEventListener("touchmove", moveHandler, { passive: false });

  const downHandler = (e) => {
    const touch = getTouch(e);
    this.holdingPaper = true;
    paper.style.zIndex = highestZ++;
    this.mouseTouchX = touch.clientX;
    this.mouseTouchY = touch.clientY;
    this.prevMouseX = touch.clientX;
    this.prevMouseY = touch.clientY;

    if (e.type === "touchstart") e.preventDefault(); // evita zoom duplo no mobile
  };

  paper.addEventListener("mousedown", downHandler);
  paper.addEventListener("touchstart", downHandler, { passive: false });

  const upHandler = () => {
    this.holdingPaper = false;
    this.rotating = false;
  };

  window.addEventListener("mouseup", upHandler);
  window.addEventListener("touchend", upHandler);

  paper.addEventListener("contextmenu", (e) => e.preventDefault());
}
