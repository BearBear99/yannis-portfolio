// Scroll animation
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(section => {
    section.classList.add('fade-up');
    observer.observe(section);
  });

  // Continuous slow auto-scroll carousels + pause on hover + click to zoom + arrows
  document.querySelectorAll('.carousel.auto').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const images = Array.from(track.querySelectorAll('img'));
    
    // Duplicate images for seamless loop
    images.forEach(img => {
      const clone = img.cloneNode(true);
      track.appendChild(clone);
    });

    let position = 0;
    const speed = 0.5;
    let isPaused = false;
    let manualControl = false;

    function animate() {
      if (!isPaused && !manualControl) {
        position -= speed;
        if (Math.abs(position) >= track.scrollWidth / 2) {
          position = 0;
        }
        track.style.transform = `translateX(${position}px)`;
      }
      requestAnimationFrame(animate);
    }
    animate();

    track.addEventListener('mouseenter', () => { isPaused = true; });
    track.addEventListener('mouseleave', () => { 
      if (!manualControl) isPaused = false; 
    });

    // Manual arrow controls
    const wrapper = carousel.closest('.carousel-wrapper') || carousel.parentElement;
    const leftArrow = wrapper.querySelector('.carousel-arrow.left');
    const rightArrow = wrapper.querySelector('.carousel-arrow.right');

    if (leftArrow && rightArrow) {
      leftArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        manualControl = true;
        isPaused = true;
        position += 244;
        if (position > 0) position = 0;
        track.style.transform = `translateX(${position}px)`;
        setTimeout(() => { 
          manualControl = false; 
          isPaused = false; 
        }, 2000);
      });

      rightArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        manualControl = true;
        isPaused = true;
        position -= 244;
        if (Math.abs(position) >= track.scrollWidth / 2) position = 0;
        track.style.transform = `translateX(${position}px)`;
        setTimeout(() => { 
          manualControl = false; 
          isPaused = false; 
        }, 2000);
      });
    }

    track.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        openLightbox(e.target.src, e.target.alt, track);
      }
    });
  });

  function openLightbox(src, alt, track) {
    const wasPaused = track.style.transform;
    track.style.transform = 'none';

    document.querySelectorAll('.lightbox').forEach(el => el.remove());

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <img src="${src}" alt="${alt}">
        <button class="lightbox-close">×</button>
      </div>
    `;

    overlay.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0,0,0,0.9) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 999999 !important;
    `;

    const content = overlay.querySelector('.lightbox-content');
    content.style.cssText = 'position: relative; max-width: 90vw; max-height: 90vh;';

    const img = overlay.querySelector('img');
    img.style.cssText = 'max-width: 90vw; max-height: 85vh; object-fit: contain; border-radius: 8px;';

    const closeBtn = overlay.querySelector('.lightbox-close');
    closeBtn.style.cssText = 'position: absolute; top: -40px; right: 0; background: none; border: none; color: #fff; font-size: 2.5rem; cursor: pointer; z-index: 1000000;';

    document.body.appendChild(overlay);

    const closeLightbox = () => {
      overlay.remove();
      track.style.transform = wasPaused;
    };

    closeBtn.onclick = closeLightbox;
    overlay.onclick = (e) => {
      if (e.target === overlay) closeLightbox();
    };
  }
});
