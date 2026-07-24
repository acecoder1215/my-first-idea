document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('main-card');

  // 3D Tilt Hover Effect
  card.addEventListener('mousemove', (e) => {
    // Disable on smaller touch devices (mobile, tablet)
    if (window.innerWidth < 768) {
      card.style.transform = '';
      return;
    }
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation degree (max 8 degrees for clean effect)
    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = -((x - centerX) / centerX) * 8;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
});
