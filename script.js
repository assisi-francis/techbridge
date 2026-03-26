// =============================================
// STICKY NAV — add shadow on scroll
// =============================================
const nav = document.querySelector('.nav');

/* No longer changing nav appearance on scroll as per user request */

// =============================================
// MOBILE HAMBURGER MENU
// =============================================
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile');
const dropdownToggle = document.querySelector('.nav__dropdown');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// =============================================
// DESKTOP DROPDOWN (keyboard accessible)
// =============================================
if (dropdownToggle) {
  dropdownToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dropdownToggle.classList.toggle('open');
    }
    if (e.key === 'Escape') {
      dropdownToggle.classList.remove('open');
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownToggle.contains(e.target)) {
      dropdownToggle.classList.remove('open');
    }
  });
}

// =============================================
// SCROLL ANIMATIONS (Intersection Observer)
// =============================================
const animatedEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on index within parent
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 100;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

animatedEls.forEach(el => observer.observe(el));

// =============================================
// SMOOTH SCROLL for CTA buttons
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  });
});

// =============================================
// FORM SUBMISSION (Web3Forms AJAX)
// =============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.form-submit');
    const originalText = btn.innerHTML;
    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Initial UI Feedback
    btn.innerHTML = '<ion-icon name="sync-outline" class="rotate-animation"></ion-icon> Sending...';
    btn.classList.add('btn-processing');
    btn.disabled = true;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      const result = await response.json();

      if (response.status === 200) {
        // SUCCESS
        btn.innerHTML = '✅ Message Sent!';
        btn.style.background = '#16a34a';
        btn.style.borderColor = '#16a34a';
        contactForm.reset();
      } else {
        // ERROR FROM API
        console.error(result);
        btn.innerHTML = '❌ Error sending';
        btn.style.background = '#dc2626';
        btn.style.borderColor = '#dc2626';
      }
    } catch (error) {
      // NETWORK ERROR
      console.error(error);
      btn.innerHTML = '❌ Network Error';
    } finally {
      // Revert button after delay
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        btn.classList.remove('btn-processing');
      }, 5000);
    }
  });
}
