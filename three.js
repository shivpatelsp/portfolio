const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    const audio = document.getElementById('background-music');
    
    let numParticles = 150;
    let particles = [];

    // Initialize AudioContext
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Resize Canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0,
          radius: Math.random() * 2 + 1,
          opacity: Math.random(),
        });
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw Visualizer
    function draw() {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.vx += (Math.random() - 0.5) * 0.5;
        particle.vy += (Math.random() - 0.5) * 0.5;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const scale = dataArray[i % bufferLength] / 255;
        particle.opacity = scale;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });
    }

    // Function to start audio and visualizer on any user interaction
    function activateAudio() {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
          console.log("AudioContext resumed.");
          audio.volume = 0.25; // Limit volume to 25%
          audio.play().then(() => {
            console.log('Audio playback started.');
            draw(); // Start visualizer
          }).catch(err => {
            console.error('Error playing audio:', err);
          });
        }).catch(err => {
          console.error('Error resuming AudioContext:', err);
        });
      }
    }

    // Listen for user interactions: scroll, click, or tap anywhere
    window.addEventListener('scroll', activateAudio, { once: true });
    window.addEventListener('click', activateAudio, { once: true });
    window.addEventListener('touchstart', activateAudio, { once: true });
