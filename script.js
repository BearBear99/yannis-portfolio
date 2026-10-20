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

  // Continuous slow auto-scroll carousels + pause on hover + click to zoom
  document.querySelectorAll('.carousel.auto').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const images = track.querySelectorAll('img');
    
    // Duplicate images for seamless loop
    images.forEach(img => {
      const clone = img.cloneNode(true);
      track.appendChild(clone);
    });

    let position = 0;
    const speed = 0.5;
    let isPaused = false;

    function animate() {
      if (!isPaused) {
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
    track.addEventListener('mouseleave', () => { isPaused = false; });

    track.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        openLightbox(e.target.src, e.target.alt);
      }
    });
  });

  function openLightbox(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <img src="${src}" alt="${alt}">
        <button class="lightbox-close">×</button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.lightbox-close').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  }
});
