/* ==========================================================================
   Portfolio · David Rodríguez San Miguel
   Tema claro/oscuro, menú móvil, copiar email, enlace activo y apariciones.
   Todo el contenido está en el HTML: si este archivo falla, la web sigue
   funcionando.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Tema claro / oscuro ---------- */
  var THEME_COLORS = { light: '#f3f6f5', dark: '#111917' };
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  var themeToggle = document.querySelector('.theme-toggle');

  function currentTheme() {
    return root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
  }

  function syncThemeUI() {
    var theme = currentTheme();
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'
      );
    }
    // Si el tema se eligió a mano, la barra del navegador móvil lo sigue
    if (root.hasAttribute('data-theme')) {
      document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
        meta.setAttribute('content', THEME_COLORS[theme]);
      });
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-switching');
      root.setAttribute('data-theme', next);
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          root.classList.remove('theme-switching');
        });
      });
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        /* Sin almacenamiento (modo privado): el cambio dura hasta recargar */
      }
      syncThemeUI();
    });
  }

  if (systemDark.addEventListener) {
    systemDark.addEventListener('change', syncThemeUI);
  }
  syncThemeUI();

  /* ---------- Cabecera con borde al hacer scroll ---------- */
  var header = document.querySelector('.site-header');
  var ticking = false;

  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
  updateHeader();

  /* ---------- Menú móvil ---------- */
  var navToggle = document.querySelector('.nav__toggle');
  var navList = document.getElementById('menu');

  function setMenu(open) {
    if (!navToggle || !navList) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navList.classList.toggle('is-open', open);
  }

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    navList.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        navToggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (navToggle.getAttribute('aria-expanded') === 'true' &&
          !event.target.closest('.nav')) {
        setMenu(false);
      }
    });

    // Al pasar a escritorio, el menú desplegable se cierra
    var desktop = window.matchMedia('(min-width: 860px)');
    if (desktop.addEventListener) {
      desktop.addEventListener('change', function (mq) {
        if (mq.matches) setMenu(false);
      });
    }
  }

  /* ---------- Copiar email ---------- */
  var copyButton = document.querySelector('.copy-button');
  var copyStatus = document.querySelector('[data-copy-status]');

  function fallbackCopy(text) {
    var field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(field);
    return ok;
  }

  if (copyButton) {
    var label = copyButton.querySelector('.copy-button__label');
    var resetTimer;

    copyButton.addEventListener('click', function () {
      var text = copyButton.getAttribute('data-copy');

      function done(ok) {
        copyButton.classList.toggle('is-copied', ok);
        if (label) label.textContent = ok ? 'Email copiado' : 'No se ha podido copiar';
        if (copyStatus) {
          copyStatus.textContent = ok
            ? 'Email copiado al portapapeles'
            : 'No se ha podido copiar. Selecciona el email y cópialo a mano.';
        }
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          copyButton.classList.remove('is-copied');
          if (label) label.textContent = 'Copiar email';
          if (copyStatus) copyStatus.textContent = '';
        }, 2500);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { done(true); },
          function () { done(fallbackCopy(text)); }
        );
      } else {
        done(fallbackCopy(text));
      }
    });
  }

  /* ---------- Enlace activo del menú ---------- */
  var navLinks = navList ? navList.querySelectorAll('a[href^="#"]') : [];

  if ('IntersectionObserver' in window && navLinks.length) {
    var linkFor = {};
    navLinks.forEach(function (link) {
      linkFor[link.getAttribute('href').slice(1)] = link;
    });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        navLinks.forEach(function (other) { other.removeAttribute('aria-current'); });
        link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main section[id]').forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------- Aparición suave al hacer scroll ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  if (!reduceMotion.matches && 'IntersectionObserver' in window && revealItems.length) {
    root.classList.add('motion');

    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  /* ---------- Año del pie ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
