/**
 * Business Growth Studio - Official Website Script
 * Hand-coded, lightweight, high-performance interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. STICKY HEADER & SCROLL EFFECTS
  const header = document.querySelector('.header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Initial check on load
  handleScroll();


  // 2. MOBILE NAVIGATION DRAWER
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNavToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Prevent body scrolling when mobile menu is open
      document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    });

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    });
  }


  // 3. SMOOTH SCROLLING FOR SECTION ANCHORS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate header height to offset scroll position
        const headerOffset = header ? header.offsetHeight : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // 4. ACCORDION-STYLE FAQ WITH SMOOTH TRANSITION
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (trigger && panel) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other open FAQ items for a clean accordion effect
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-panel').style.maxHeight = '0px';
          }
        });

        // Toggle active class on current item
        item.classList.toggle('active');

        // Set dynamic max-height for CSS transition
        if (item.classList.contains('active')) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          panel.style.maxHeight = '0px';
        }
      });
    }
  });


  // 5. INTERACTIVE CONTACT FORM — EMAIL + WHATSAPP INTEGRATION
  const contactForm = document.getElementById('contactForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (contactForm && successModal) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate required fields first
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="text-gradient">Sending...</span>';

      // Gather form data and send to email
      const formData = new FormData(contactForm);

      try {
        // 1. Send to email via FormSubmit
        await fetch(contactForm.action, {
          method: 'POST',
          body: formData
        });
      } catch (_) { /* continue even if email fails */ }

          // 2. Open WhatsApp with a simple pre-filled message
          const waMsg = encodeURIComponent(
            `Hello MyDigitalStore.In, I'm looking for digital growth services for my business.`
          );
      window.open(`https://wa.me/917065188908?text=${waMsg}`, '_blank');

      // 3. Show success & reset
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      contactForm.reset();
    });
  }

  // Close modal logic
  if (closeModalBtn && successModal) {
    const closeModal = () => {
      successModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the card
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && successModal.classList.contains('active')) {
        closeModal();
      }
    });
  }


  // 6. SCROLL FADE-IN ANIMATIONS (INTERSECTION OBSERVER)
  const fadeElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters viewport
      threshold: 0.15
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once element is visible, we can unobserve it
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(element => {
      elementObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    fadeElements.forEach(element => {
      element.classList.add('is-visible');
    });
  }
});
