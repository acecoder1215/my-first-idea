document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('main-card');
  const h1 = document.getElementById('main-sentence');
  const btnNext = document.getElementById('btn-next');

  // List of encouraging sentences
  const sentences = [
    "오늘도 힘내세요!",
    "당신의 하루를 응원합니다.",
    "반짝이는 생각을 믿으세요.",
    "작은 걸음이 큰 변화를 만듭니다.",
    "당신은 생각보다 강합니다.",
    "오늘 하루도 수고 많았어요."
  ];

  // Button Color Themes (Orange, Yellow, Green, Blue)
  const buttonThemes = [
    {
      name: 'orange',
      bg: 'linear-gradient(135deg, #ffedd5 0%, #f97316 100%)',
      shadow: '0 8px 24px rgba(249, 115, 22, 0.35)',
      particles: ['#ea580c', '#f97316', '#fdba74', '#ffedd5']
    },
    {
      name: 'yellow',
      bg: 'linear-gradient(135deg, #fef9c3 0%, #ca8a04 100%)',
      shadow: '0 8px 24px rgba(202, 138, 4, 0.35)',
      particles: ['#ca8a04', '#eab308', '#fde047', '#fef9c3']
    },
    {
      name: 'green',
      bg: 'linear-gradient(135deg, #dcfce7 0%, #16a34a 100%)',
      shadow: '0 8px 24px rgba(22, 163, 74, 0.35)',
      particles: ['#16a34a', '#22c55e', '#86efac', '#dcfce7']
    },
    {
      name: 'blue',
      bg: 'linear-gradient(135deg, #dbeafe 0%, #2563eb 100%)',
      shadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
      particles: ['#2563eb', '#3b82f6', '#93c5fd', '#dbeafe']
    }
  ];

  let currentIdx = 0;
  let themeIdx = 0; // Starts with orange (index 0)

  // 1. Button Click Handlers (Text rotation + Button theme cycling + Particle splash)
  btnNext.addEventListener('click', (e) => {
    // Cycle the button theme color
    themeIdx = (themeIdx + 1) % buttonThemes.length;
    const currentTheme = buttonThemes[themeIdx];
    
    // Spawn color-coordinated particles matching the new theme
    createParticles(e.clientX, e.clientY, currentTheme.particles);

    // Apply the new theme style to the button dynamically
    btnNext.style.background = currentTheme.bg;
    btnNext.style.boxShadow = currentTheme.shadow;
    
    // Soft text fade-out transition
    h1.style.opacity = '0';
    h1.style.transform = 'scale(0.95)';
    h1.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    
    // Update text content and fade-in
    setTimeout(() => {
      currentIdx = (currentIdx + 1) % sentences.length;
      h1.textContent = sentences[currentIdx];
      
      h1.style.opacity = '1';
      h1.style.transform = 'scale(1)';
    }, 250);
  });

  // 2. 3D Tilt Hover Effect
  card.addEventListener('mousemove', (e) => {
    // Disable on mobile/tablet devices
    if (window.innerWidth < 768) {
      card.style.transform = '';
      return;
    }
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = -((x - centerX) / centerX) * 8;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });

  // 3. Dynamic Particle Splash Generator
  function createParticles(x, y, activeColors) {
    const particleCount = 14;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      document.body.appendChild(particle);
      
      const size = Math.random() * 5 + 4; // 4px to 9px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = activeColors[Math.floor(Math.random() * activeColors.length)];
      
      // Position at mouse click point
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Random circular trajectory
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 70 + 40; // spreading speed
      const destinationX = Math.cos(angle) * velocity;
      const destinationY = Math.sin(angle) * velocity;
      
      particle.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(0)`, opacity: 0 }
      ], {
        duration: Math.random() * 400 + 400, // 400ms to 800ms
        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
        fill: 'forwards'
      }).onfinish = () => {
        particle.remove();
      };
    }
  }
});
