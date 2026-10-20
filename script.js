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
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:99999;';
    overlay.innerHTML = `
      <div class="lightbox-content" style="position:relative;max-width:90vw;max-height:90vh;">
        <img src="${src}" alt="${alt}" style="max-width:90vw;max-height:85vh;object-fit:contain;border-radius:8px;">
        <button class="lightbox-close" style="position:absolute;top:-40px;right:0;background:none;border:none;color:#fff;font-size:2.5rem;cursor:pointer;">×</button>
      </div>
    `;
    document.documentElement.appendChild(overlay);
    overlay.querySelector('.lightbox-close').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  }
});
