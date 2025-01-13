const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const audio = document.getElementById('background-music');

let numParticles = 150; // Number of particles
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Reinitialize particles to fit the new canvas size
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
      radius: Math.random() * 1 + 1,
      direction: Math.random() * Math.PI * 2,
      opacity: 0.5,
      life: 1,
      lifeSpan: Math.random() * 5 + 1,
    });
  }
}

// Initialize canvas size and particles
resizeCanvas();
window.addEventListener('resize', resizeCanvas); // Adjust canvas size dynamically

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
source.connect(analyser);
analyser.connect(audioCtx.destination);

audio.play();

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numParticles; i++) {
    const particle = particles[i];

    particle.vx += (Math.random() - 0.5) * dataArray[i % bufferLength] * 0.0001;
    particle.vy += (Math.random() - 0.5) * dataArray[i % bufferLength] * 0.0001;

    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > canvas.width) {
      particle.vx *= -1;
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.vy *= -1;
    }

    particle.life -= 0.01;
    particle.opacity = Math.max(0, particle.life) * (dataArray[i % bufferLength] / 255) * 0.5;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
    ctx.fill();

    if (particle.life <= 0) {
      particle.x = Math.random() * canvas.width;
      particle.y = Math.random() * canvas.height;
      particle.vx = 0;
      particle.vy = 0;
      particle.life = Math.random() * 5 + 1;
    }
  }
}

draw();
