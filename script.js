
document.getElementById('playButton').addEventListener('click', function () {
  document.getElementById('bgm').play();
  this.style.display = 'none';
});

document.getElementById('confirmButton').addEventListener('click', function () {
  document.getElementById('confirmationMessage').style.display = 'block';
  this.disabled = true;
  this.textContent = 'Presença Confirmada';
  this.style.backgroundColor = '#aaa';
});

// Balões
const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'pink'];
function createBalloon() {
  const balloon = document.createElement('div');
  balloon.classList.add('balloon');
  balloon.style.left = Math.random() * 100 + 'vw';
  balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  balloon.style.width = '20px';
  balloon.style.height = '30px';
  balloon.style.borderRadius = '50%';
  balloon.style.opacity = '0.7';
  balloon.style.position = 'fixed';
  balloon.style.bottom = '-100px';
  balloon.style.animation = 'float 6s infinite ease-in';
  balloon.style.zIndex = 9999;
  document.body.appendChild(balloon);
  setTimeout(() => balloon.remove(), 6000);
}
setInterval(createBalloon, 500);
