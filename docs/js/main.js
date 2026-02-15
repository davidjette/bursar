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

      // TODO: Replace with real endpoint (Typeform, Google Form, or API)
      // For now, log and show success
      console.log('Waitlist signup:', email);

      // Simulate API delay
      await new Promise(r => setTimeout(r, 800));

      btn.textContent = '✓ You\'re on the list!';
      btn.style.background = '#38a169';
      form.querySelector('input').style.display = 'none';

      const msg = form.parentElement.querySelector('.success-msg');
      if (msg) {
        msg.style.display = 'block';
        msg.textContent = `We'll be in touch at ${email}. California boards launching February 2026.`;
      }

      // Track conversion (placeholder for GA4 / UTM)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'waitlist_signup', {
          event_category: 'conversion',
          event_label: form.closest('[data-variant]')?.dataset.variant || 'unknown',
          value: 1,
        });
      }
    });
  });

  // Smooth scroll for nav CTA
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
