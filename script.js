// =============================================
// STICKY NAV — add shadow on scroll
// =============================================
const nav = document.querySelector('.nav');

/* No longer changing nav appearance on scroll as per user request */

// =============================================
// FAQ ACCORDION
// =============================================
const faqItems = document.querySelectorAll('.faq__item');

if (faqItems.length > 0) {
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    question.addEventListener('click', () => {
      // Optional: Close other items when one is opened
      faqItems.forEach(otherItem => {
        if (otherItem !== item) otherItem.classList.remove('active');
      });

      item.classList.toggle('active');
    });
  });
}

// =============================================
// MOBILE HAMBURGER MENU
// =============================================
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile');


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

// =============================================
// PROJECT SLIDER
// =============================================
const projectTrack = document.getElementById('projects-track');
const projectPrev = document.getElementById('projects-prev');
const projectNext = document.getElementById('projects-next');
const projectIndicators = document.getElementById('projects-indicators');

if (projectTrack && projectPrev && projectNext && projectIndicators) {
  const slides = Array.from(projectTrack.children);
  let currentIndex = 0;

  // Create indicators
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    if (index === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
      goToSlide(index);
    });

    projectIndicators.appendChild(dot);
  });

  const dots = Array.from(projectIndicators.children);

  function updateSlider() {
    // Move track
    projectTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');

    // Update buttons state
    projectPrev.disabled = currentIndex === 0;
    projectNext.disabled = currentIndex === slides.length - 1;
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
  }

  projectPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  });

  projectNext.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    }
  });

  // Init
  updateSlider();
}

// =============================================
// ANIMATED STATS COUNTER
// =============================================
const animateCounter = (el, target, duration = 2000) => {
  let startTimestamp = null;
  const startValue = 0;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    // Ease out cubic function for smooth deceleration
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(easeOutCubic * (target - startValue) + startValue);

    // Formatting with specific suffixes
    if (target === 98) {
      el.textContent = `${currentValue}%`;
    } else if (target >= 10 && target !== 98) {
      el.textContent = `${currentValue}+`;
    } else {
      el.textContent = currentValue;
    }

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      // Ensure final values are exact
      if (target === 98) {
        el.textContent = '98%';
      } else if (target >= 10) {
        el.textContent = `${target}+`;
      } else {
        el.textContent = target;
      }
    }
  };

  window.requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.stat__number');
      numbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'), 10);
        animateCounter(num, target);
      });
      // Animation should only run once
      statsObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.3 // Trigger when 30% of the section is visible
});

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) {
  statsObserver.observe(statsStrip);
}

