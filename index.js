document.addEventListener('DOMContentLoaded', () => {
  /* ==========================
     CAROUSEL LOGIC
  ========================== */
  const carousel = document.querySelector('.carousel');
  const slides = carousel ? Array.from(carousel.querySelectorAll('.slide')) : [];
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  if (slides.length) {
    let current = slides.findIndex(s => s.classList.contains('active'));
    if (current < 0) current = 0;

    const updateAria = (el, visible) => {
      el.setAttribute('aria-hidden', visible ? 'false' : 'true');
    };

    const showSlide = (index) => {
      const i = (index + slides.length) % slides.length;
      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === i);
        updateAria(s, idx === i);
      });
      current = i;
    };

    prevBtn?.addEventListener('click', e => {
      e.preventDefault();
      showSlide(current - 1);
    });

    nextBtn?.addEventListener('click', e => {
      e.preventDefault();
      showSlide(current + 1);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') showSlide(current - 1);
      if (e.key === 'ArrowRight') showSlide(current + 1);
    });

    const autoplayDelay = parseInt(carousel.getAttribute('data-autoplay'), 10) || 5000;
    let timer = null;

    const startAutoplay = () => {
      stopAutoplay();
      timer = setInterval(() => showSlide(current + 1), autoplayDelay);
    };

    const stopAutoplay = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    showSlide(current);
    startAutoplay();
  }

  /* ==========================
     CONTACT FORM (FORMSPREE AJAX)
  ========================== */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // Honeypot spam check
    if (data.get('company')) return;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        window.location.href = '/thank-you.html';
      } else {
        status.textContent = 'Something went wrong. Please try again.';
        status.style.color = '#ff6b6b';
      }
    } catch {
      status.textContent = 'Network error. Please try again later.';
      status.style.color = '#ff6b6b';
    }
  });
});
