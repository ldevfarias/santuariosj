/* ============================================================
   SANTUÁRIO DE SÃO JOSÉ DE RIBAMAR — JS PRINCIPAL
   ============================================================ */

(function () {
  'use strict';

  /* ── HEADER: scroll effect ── */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── NAV: active link on scroll ── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observerNav.observe(s));

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mainNav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!header.contains(e.target) && mainNav.classList.contains('open')) {
      hamburger.classList.remove('open');
      mainNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Dropdown toggle on mobile
  document.querySelectorAll('.has-dropdown').forEach(item => {
    const link = item.querySelector('.nav-link');
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  // Close nav on nav-link click (mobile)
  document.querySelectorAll('.dropdown a, .nav-list > li > .nav-link').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  /* ── HERO SLIDER ── */
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('hero-dots');
  let currentSlide = 0;
  let slideTimer;

  // Build dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'hero-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(btn);
  });

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dotsContainer.children[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dotsContainer.children[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }

  function startSlider() { slideTimer = setInterval(nextSlide, 5500); }
  function resetSlider() { clearInterval(slideTimer); startSlider(); }

  dotsContainer.querySelectorAll('.hero-dot').forEach(btn => {
    btn.addEventListener('click', resetSlider);
  });

  startSlider();

  // Pause on hover
  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', () => clearInterval(slideTimer));
  hero.addEventListener('mouseleave', startSlider);

  /* ── BACK TO TOP ── */
  const backBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.missa-card, .sacramento-card, .noticia-card, .grupo-card, .devocao-card, ' +
    '.agenda-item, .contato-item, .sobre-content, .sobre-image-wrap, ' +
    '.saojose-content, .devocao-text, .devocao-cards, .section-header, .grande-citacao'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  document.querySelectorAll('.sobre-image-wrap').forEach(el => {
    el.classList.remove('reveal');
    el.classList.add('reveal-left');
  });
  document.querySelectorAll('.sobre-content').forEach(el => {
    el.classList.remove('reveal');
    el.classList.add('reveal-right');
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── CONTACT FORM ── */
  const form = document.getElementById('form-contato');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nome     = form.nome.value.trim();
      const email    = form.email.value.trim();
      const mensagem = form.mensagem.value.trim();

      if (!nome || !email || !mensagem) {
        shakeForm();
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      // Simulate async submit
      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      }, 1600);
    });
  }

  function shakeForm() {
    form.style.animation = 'shake 0.4s ease';
    form.addEventListener('animationend', () => form.style.animation = '', { once: true });
  }

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerOffset = header.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── THEME SWITCHER ── */
  const THEME_KEY        = 'santuario-theme';
  const rootEl           = document.documentElement;
  const themeSwitcherBtn = document.getElementById('theme-switcher');

  function applyTheme(theme) {
    if (theme === 'alternativo') {
      rootEl.setAttribute('data-theme', 'alternativo');
      themeSwitcherBtn.setAttribute(
        'aria-label',
        'Paleta ativa: Igreja Azul. Clique para ver paleta Tradicional'
      );
    } else {
      rootEl.removeAttribute('data-theme');
      themeSwitcherBtn.setAttribute(
        'aria-label',
        'Paleta ativa: Tradicional. Clique para ver paleta Igreja Azul'
      );
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);

  themeSwitcherBtn.addEventListener('click', () => {
    const next = rootEl.getAttribute('data-theme') === 'alternativo'
      ? 'tradicional'
      : 'alternativo';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ── INJECT SHAKE KEYFRAME ── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{ transform: translateX(0) }
      20%    { transform: translateX(-8px) }
      40%    { transform: translateX(8px) }
      60%    { transform: translateX(-6px) }
      80%    { transform: translateX(6px) }
    }
  `;
  document.head.appendChild(style);

})();
