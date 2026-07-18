document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const welcomeView = document.getElementById('welcome-view');
  const appView = document.getElementById('app-view');
  const btnStart = document.getElementById('btn-start');
  const btnBack = document.getElementById('btn-back');
  const ideaForm = document.getElementById('idea-form');
  const ideaInput = document.getElementById('idea-input');
  const ideasList = document.getElementById('ideas-list');
  const emptyState = document.getElementById('empty-state');
  const card = document.getElementById('main-card');

  // Application State
  let ideas = JSON.parse(localStorage.getItem('my_first_ideas') || '[]');

  // Initialize
  renderIdeas();

  // 1. View Switching Logic (with transitions)
  function switchView(fromView, toView) {
    fromView.classList.remove('active');
    
    // Wait for the exit transition (400ms matching CSS)
    setTimeout(() => {
      fromView.style.display = 'none';
      toView.style.display = 'flex';
      
      // Force reflow for enter animation
      toView.offsetHeight;
      
      toView.classList.add('active');
    }, 400);
  }

  btnStart.addEventListener('click', (e) => {
    // Spark particles at click position
    createParticles(e.clientX, e.clientY);
    switchView(welcomeView, appView);
    
    // Focus the input in workspace
    setTimeout(() => {
      ideaInput.focus();
    }, 850);
  });

  btnBack.addEventListener('click', () => {
    switchView(appView, welcomeView);
  });

  // 2. Ideas Management Logic
  function renderIdeas() {
    ideasList.innerHTML = '';
    
    if (ideas.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      
      ideas.forEach((idea) => {
        const li = document.createElement('li');
        li.className = 'idea-item';
        
        // Escape HTML to prevent XSS
        const safeText = escapeHTML(idea.text);
        
        li.innerHTML = `
          <span class="idea-text">${safeText}</span>
          <button class="btn-delete" data-id="${idea.id}" aria-label="삭제">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
            </svg>
          </button>
        `;
        
        // Handle deletion click
        const btnDelete = li.querySelector('.btn-delete');
        btnDelete.addEventListener('click', () => {
          deleteIdea(idea.id, li);
        });
        
        ideasList.appendChild(li);
      });
    }
  }

  // Escape HTML helper
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Add Idea
  ideaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = ideaInput.value.trim();
    if (!text) return;

    const newIdea = {
      id: Date.now().toString(),
      text: text
    };

    ideas.unshift(newIdea);
    saveIdeas();
    renderIdeas();
    
    // Spark particles at submit button
    const btnSubmit = document.getElementById('btn-submit');
    const rect = btnSubmit.getBoundingClientRect();
    createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    ideaInput.value = '';
    ideaInput.focus();
  });

  // Delete Idea
  function deleteIdea(id, element) {
    // Fade out and shrink animation before deletion
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px) scale(0.95)';
    element.style.maxHeight = '0';
    element.style.padding = '0';
    element.style.margin = '0';
    element.style.border = 'none';
    element.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    
    setTimeout(() => {
      ideas = ideas.filter(idea => idea.id !== id);
      saveIdeas();
      renderIdeas();
    }, 300);
  }

  function saveIdeas() {
    localStorage.setItem('my_first_ideas', JSON.stringify(ideas));
  }

  // 3. 3D Tilt Hover Effect
  card.addEventListener('mousemove', (e) => {
    // Disable on smaller touch devices
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

  // 4. Interactive Particles
  function createParticles(x, y) {
    const particleCount = 14;
    const colors = ['#2563eb', '#3b82f6', '#06b6d4', '#60a5fa', '#2dd4bf'];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      document.body.appendChild(particle);
      
      const size = Math.random() * 5 + 4; // 4px to 9px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      // Position at trigger point
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Random circular trajectory
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 70 + 40; // distance spread
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
