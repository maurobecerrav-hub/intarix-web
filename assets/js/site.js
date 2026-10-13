/* Intarix 2.0 — interacciones compartidas (sin dependencias) */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  // ─── Header: sombra al hacer scroll ───
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Dropdown "Plataformas" (click + hover, accesible por teclado) ───
  document.querySelectorAll('[data-dropdown]').forEach(function (item) {
    var toggle = item.querySelector('[aria-controls]');
    var menu = document.getElementById(toggle.getAttribute('aria-controls'));
    var hoverTimer;
    function set(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    }
    toggle.addEventListener('click', function () {
      // Con mouse el hover ya abrió el menú: el clic no debe cerrarlo. Con teclado alterna.
      if (item.matches(':hover')) set(true);
      else set(toggle.getAttribute('aria-expanded') !== 'true');
    });
    item.addEventListener('mouseenter', function () { clearTimeout(hoverTimer); set(true); });
    item.addEventListener('mouseleave', function () { hoverTimer = setTimeout(function () { set(false); }, 120); });
    item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) set(false); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { set(false); toggle.focus(); }
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('click', function (e) { if (!item.contains(e.target)) set(false); });
  });

  // ─── Menú móvil ───
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  function setMobile(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.inert = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuToggle && mobileMenu) {
    mobileMenu.inert = true;
    menuToggle.addEventListener('click', function () { setMobile(menuToggle.getAttribute('aria-expanded') !== 'true'); });
    mobileMenu.querySelectorAll('a, button').forEach(function (el) { el.addEventListener('click', function () { setMobile(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) { setMobile(false); menuToggle.focus(); } });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', function (mq) { if (mq.matches) setMobile(false); });
  }

  // ─── Anclas de la versión anterior → nuevas secciones ───
  var legacyAnchors = { productos: 'plataformas', valor: 'diferenciador', cta: 'contacto', comparacion: 'diferenciador' };
  var hash = location.hash.slice(1);
  if (legacyAnchors[hash] && document.getElementById(legacyAnchors[hash])) {
    history.replaceState(null, '', '#' + legacyAnchors[hash]);
    document.getElementById(legacyAnchors[hash]).scrollIntoView();
  }

  // ─── Revelado sutil al hacer scroll ───
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ─── Año en footer ───
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ─── Modal de contacto + EmailJS ───
  var modal = document.getElementById('contact-modal');
  if (!modal) return;
  var form = document.getElementById('contact-form');
  var errorBox = document.getElementById('form-error');
  var success = document.getElementById('form-success');
  var submitBtn = document.getElementById('form-submit');
  var interest = document.getElementById('f-interes');
  var lastFocus = null;

  if (window.emailjs) {
    window.emailjs.init({ publicKey: 'WKhLZim9I8fTPpbhm' });
  }

  function openModal(preset) {
    lastFocus = document.activeElement;
    if (preset && interest) interest.value = preset;
    form.hidden = false;
    success.hidden = true;
    errorBox.hidden = true;
    modal.inert = false;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { document.getElementById('f-nombre').focus(); }, 60);
  }
  function closeModal() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.inert = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-contact]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); openModal(btn.getAttribute('data-contact')); });
  });
  modal.querySelectorAll('[data-close]').forEach(function (btn) { btn.addEventListener('click', closeModal); });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      var focusables = modal.querySelectorAll('button:not([disabled]), input, select, textarea');
      var visible = Array.prototype.filter.call(focusables, function (el) { return el.offsetParent !== null; });
      var first = visible[0], last = visible[visible.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function showError(msg) { errorBox.textContent = msg; errorBox.hidden = false; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorBox.hidden = true;
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var data = { nombre: v('f-nombre'), cargo: v('f-cargo'), empresa: v('f-empresa'), tel: v('f-tel'), mail: v('f-mail'), interes: v('f-interes'), mensaje: v('f-mensaje') };

    if (!data.nombre || !data.cargo || !data.empresa || !data.mail || !data.interes) {
      showError('Por favor completa todos los campos obligatorios.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.mail)) {
      showError('Por favor ingresa un correo válido.');
      return;
    }
    if (!window.emailjs) {
      showError('No pudimos enviar el formulario. Escríbenos directamente a contacto@intarix.cl');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';
    var params = {
      nombre: data.nombre,
      cargo: data.cargo,
      empresa: data.empresa,
      email: data.mail,
      solucion: data.interes,
      telefono: data.tel || 'No proporcionado',
      mensaje: data.mensaje || '(sin mensaje)'
    };

    // El envío principal (lead hacia Intarix) determina el éxito del formulario.
    // La confirmación automática al usuario es secundaria: si falla, no mostramos
    // un falso error después de haber recibido correctamente el lead.
    window.emailjs.send('service_qd51tv9', 'template_c5ef8gv', params)
      .then(function (response) {
        console.info('EmailJS lead enviado:', response && response.status);

        form.reset();
        form.hidden = true;
        success.hidden = false;
        success.focus();

        // Envío secundario: correo de confirmación al usuario.
        return window.emailjs.send('service_qd51tv9', 'template_0zvvq3s', params)
          .then(function (confirmationResponse) {
            console.info('EmailJS confirmación enviada:', confirmationResponse && confirmationResponse.status);
          })
          .catch(function (confirmationError) {
            console.warn('EmailJS: el lead fue recibido, pero falló la confirmación al usuario:', {
              status: confirmationError && confirmationError.status,
              text: confirmationError && confirmationError.text
            });
          });
      })
      .catch(function (err) {
        console.error('EmailJS: falló el envío principal del formulario:', {
          status: err && err.status,
          text: err && err.text,
          error: err
        });

        showError('No pudimos enviar tu mensaje en este momento. Puedes escribirnos directamente a contacto@intarix.cl.');
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensaje';
      });
  });
})();
