// Waitlist form handler
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.waitlist-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      const btn = form.querySelector('button');
      const origText = btn.textContent;
      btn.textContent = 'Joining...';
      btn.disabled = true;

      // Submit to backend
      const utm = typeof getUTM === 'function' ? getUTM() : {};
      await submitData('waitlist', {
        email,
        sourcePage: window.location.pathname,
        variant: document.body.dataset.variant || 'unknown',
        ...utm,
      });

      btn.textContent = '✓ You\'re on the list!';
      btn.style.background = '#059669';
      form.querySelector('input').style.display = 'none';

      const msg = form.parentElement.querySelector('.success-msg');
      if (msg) {
        msg.style.display = 'block';
        msg.textContent = `We'll be in touch at ${email}. California boards launching February 2026.`;
      }

      // Track conversion
      if (typeof gtag !== 'undefined') {
        gtag('event', 'waitlist_signup', {
          event_category: 'conversion',
          event_label: document.body.dataset.variant || 'unknown',
        });
      }
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
