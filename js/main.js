// Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // FAQ accordion
  function toggleFaq(btn) {
    const answer = btn.nextElementSibling;
    const icon = btn.querySelector('.faq-icon');
    const isOpen = answer.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-answer.open').forEach(a => {
      a.classList.remove('open');
      a.previousElementSibling.querySelector('.faq-icon').classList.remove('open');
    });
    if (!isOpen) { answer.classList.add('open'); icon.classList.add('open'); }
  }

  // Glass-panel mouse specular highlight (from Lumina Health reference)
  document.querySelectorAll('.glass-texture').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '-999px');
      card.style.setProperty('--mouse-y', '-999px');
    });
  });

  // ── HERO ZOOM-OUT + SECTION SLIDE-IN TRANSITION ─────────────────
  (function () {
    var heroBody = document.querySelector('.hero-body');
    if (!heroBody) return;

    var raf = null;

    function updateZoom() {
      var sy  = window.scrollY;
      var hh  = heroBody.offsetHeight;
      var p   = Math.max(0, Math.min(1, sy / (hh * 0.72)));
      if (p <= 0) {
        heroBody.style.transform    = '';
        heroBody.style.borderRadius = '';
        heroBody.style.filter       = '';
        heroBody.style.boxShadow    = '';
      } else {
        var scale  = 1 - p * 0.09;
        var radius = p * 28;
        var dim    = 1 - p * 0.38;
        var shadow = p * 28;
        heroBody.style.transform    = 'scale(' + scale.toFixed(4) + ') translateZ(0)';
        heroBody.style.borderRadius = radius.toFixed(1) + 'px';
        heroBody.style.filter       = 'brightness(' + dim.toFixed(3) + ')';
        heroBody.style.boxShadow    = '0 ' + shadow + 'px ' + (shadow * 2) + 'px rgba(0,0,0,' + (p * 0.22).toFixed(3) + ')';
      }
      raf = null;
    }

    window.addEventListener('scroll', function () {
      if (!raf) raf = requestAnimationFrame(updateZoom);
    }, { passive: true });

    // Nav link click: plain smooth scroll (no hero animation)
    document.querySelectorAll('.nav-links a, #navMobileMenu a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || !href.startsWith('#') || href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  })();

  // Mobile nav hamburger
  function toggleMobileNav() {
    const btn = document.getElementById('navHamburger');
    const menu = document.getElementById('navMobileMenu');
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
  function closeMobileNav() {
    document.getElementById('navHamburger').classList.remove('open');
    document.getElementById('navHamburger').setAttribute('aria-expanded', 'false');
    document.getElementById('navMobileMenu').classList.remove('open');
  }
  // Close mobile menu when a link is clicked
  document.querySelectorAll('#navMobileMenu a').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });
  // Cart entry inside the mobile menu (nav-cta-area, which holds the desktop
  // cart button, is hidden on tablet/mobile — this keeps the cart reachable)
  function closeMobileNavAndOpenCart() {
    closeMobileNav();
    openCart();
  }
  window.closeMobileNavAndOpenCart = closeMobileNavAndOpenCart;

  // Glass hover lift
  document.querySelectorAll('.glass, .glass-md').forEach(card => {
    card.style.transition = 'box-shadow 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.3s cubic-bezier(0.22,1,0.36,1)';
    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('faq-answer')) {
        card.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
        card.style.transform = 'translateY(-2px)';
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      card.style.transform = '';
    });
  });

  // Sticky nav shadow on scroll
  const siteNav = document.querySelector('.site-nav');
  let navShadowTicking = false;
  window.addEventListener('scroll', () => {
    if (navShadowTicking) return;
    navShadowTicking = true;
    requestAnimationFrame(() => {
      siteNav.style.boxShadow = window.scrollY > 10 ? '0 2px 24px rgba(0,0,0,0.1)' : '0 1px 20px rgba(0,0,0,0.06)';
      navShadowTicking = false;
    });
  }, { passive: true });

(function () {
  var modal    = document.getElementById('authModal');
  var backdrop = document.getElementById('authBackdrop');
  var panel    = document.getElementById('authPanel');

  /* ── Open / Close ─────────────────────────── */
  function openAuthModal(tab) {
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('registerError').style.display = 'none';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regConfirm').value = '';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        modal.classList.add('auth-open');
      });
    });
    switchAuthTab(tab || 'login');
  }

  function closeAuthModal() {
    modal.classList.remove('auth-open');
    backdrop.style.opacity = '0';
    panel.style.transform = 'scale(0.93) translateY(24px)';
    panel.style.opacity = '0';
    setTimeout(function () {
      modal.style.display = 'none';
      backdrop.style.opacity = '';
      panel.style.transform = '';
      panel.style.opacity = '';
      document.body.style.overflow = '';
    }, 420);
  }

  /* ── Tab switcher ─────────────────────────── */
  function switchAuthTab(tab) {
    var loginTab   = document.getElementById('loginTab');
    var regTab     = document.getElementById('registerTab');
    var loginForm  = document.getElementById('loginFormEl');
    var regForm    = document.getElementById('registerFormEl');
    var onStyle    = { background:'white', color:'#212121', fontWeight:'600', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' };
    var offStyle   = { background:'transparent', color:'rgba(33,33,33,0.45)', fontWeight:'500', boxShadow:'none' };
    if (tab === 'login') {
      Object.assign(loginTab.style, onStyle);
      Object.assign(regTab.style, offStyle);
      loginForm.style.display = 'block';
      regForm.style.display = 'none';
    } else {
      Object.assign(regTab.style, onStyle);
      Object.assign(loginTab.style, offStyle);
      regForm.style.display = 'block';
      loginForm.style.display = 'none';
    }
  }

  /* ── Validation helpers ───────────────────── */
  function showErr(id, msg) {
    var el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
  }

  /* ── Login submit ─────────────────────────── */
  document.getElementById('loginSubmitBtn').addEventListener('click', function (e) {
    e.preventDefault();
    var email    = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;
    document.getElementById('loginError').style.display = 'none';
    var missing = [];
    if (!email || !email.includes('@')) missing.push('a valid email');
    if (password.length < 6)           missing.push('your password (min. 6 characters)');
    if (missing.length) {
      showErr('loginError', 'Please provide: ' + missing.join(' and ') + '.');
      return;
    }
    closeAuthModal();
    showAuthToast('Welcome back!', 'You have signed in successfully.');
  });

  /* ── Register submit ──────────────────────── */
  document.getElementById('registerSubmitBtn').addEventListener('click', function (e) {
    e.preventDefault();
    var name     = document.getElementById('regName').value.trim();
    var email    = document.getElementById('regEmail').value.trim();
    var password = document.getElementById('regPassword').value;
    var confirm  = document.getElementById('regConfirm').value;
    document.getElementById('registerError').style.display = 'none';
    if (!name) {
      showErr('registerError', 'Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      showErr('registerError', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      showErr('registerError', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      showErr('registerError', 'Passwords do not match — please re-enter.');
      return;
    }
    closeAuthModal();
    showAuthToast('Account created!', 'Welcome to Calaseed, ' + name.split(' ')[0] + '!');
  });

  /* ── Toast ────────────────────────────────── */
  function showAuthToast(title, sub) {
    var toastEl = document.getElementById('authToast');
    var inner   = document.getElementById('authToastInner');
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastSub').textContent   = sub;
    toastEl.style.display = 'block';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        inner.style.transform = 'translateY(0)';
        inner.style.opacity   = '1';
      });
    });
    setTimeout(function () {
      inner.style.transform = 'translateY(24px)';
      inner.style.opacity   = '0';
      setTimeout(function () {
        toastEl.style.display = 'none';
        inner.style.transform = '';
        inner.style.opacity   = '';
      }, 450);
    }, 3600);
  }

  /* ── Tab switch buttons ───────────────────── */
  document.getElementById('goToRegister').addEventListener('click', function () { switchAuthTab('register'); });
  document.getElementById('goToLogin').addEventListener('click',    function () { switchAuthTab('login'); });
  document.getElementById('loginTab').addEventListener('click',     function () { switchAuthTab('login'); });
  document.getElementById('registerTab').addEventListener('click',  function () { switchAuthTab('register'); });

  /* ── Close triggers ───────────────────────── */
  document.getElementById('authCloseBtn').addEventListener('click', closeAuthModal);
  backdrop.addEventListener('click', closeAuthModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeAuthModal();
  });

  /* ── Expose globals (used by onclick in markup) ── */
  window.openAuthModal  = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.switchAuthTab  = switchAuthTab;
}());

/* ══════════════════════════════════════════════════════
   MARKETPLACE — filter tabs + cart
   ══════════════════════════════════════════════════════ */
(function () {
  var cart = []; // { id, name, price }

  /* ── Filter tabs ───────────────────────────────── */
  document.querySelectorAll('.mkt-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.mkt-tab').forEach(function (t) { t.classList.remove('mkt-active'); });
      tab.classList.add('mkt-active');
      var filter = tab.dataset.filter;
      document.querySelectorAll('.mkt-card').forEach(function (card) {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.removeAttribute('data-hidden');
          card.style.display = '';
        } else {
          card.setAttribute('data-hidden', '');
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── Add to cart ───────────────────────────────── */
  document.querySelectorAll('.add-cart-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id    = btn.dataset.id;
      var name  = btn.dataset.name;
      var price = parseFloat(btn.dataset.price);

      // Prevent duplicate
      var exists = cart.find(function (i) { return i.id === id; });
      if (exists) {
        openCart(); return;
      }

      cart.push({ id: id, name: name, price: price });
      btn.textContent = '✓ Added';
      btn.classList.add('in-cart');
      btn.style.pointerEvents = 'none';

      updateCartBadge();
      renderCart();
      // Brief flash then open
      setTimeout(openCart, 320);
    });
  });

  /* ── Cart open / close ─────────────────────────── */
  function openCart() {
    document.getElementById('cartDrawer').classList.add('cart-open');
    document.getElementById('cartOverlay').classList.add('cart-open');
    document.body.style.overflow = 'hidden';
    renderCart();
  }
  function closeCart() {
    document.getElementById('cartDrawer').classList.remove('cart-open');
    document.getElementById('cartOverlay').classList.remove('cart-open');
    document.body.style.overflow = '';
  }

  /* ── Render cart items ─────────────────────────── */
  function renderCart() {
    var listEl   = document.getElementById('cartItems');
    var emptyEl  = document.getElementById('cartEmpty');
    var footerEl = document.getElementById('cartFooter');
    var countEl  = document.getElementById('cartCount');
    var totalEl  = document.getElementById('cartTotal');

    countEl.textContent = cart.length ? '(' + cart.length + ' item' + (cart.length > 1 ? 's' : '') + ')' : '';

    if (cart.length === 0) {
      listEl.style.display   = 'none';
      emptyEl.style.display  = 'flex';
      footerEl.style.display = 'none';
      return;
    }

    emptyEl.style.display  = 'none';
    listEl.style.display   = 'block';
    footerEl.style.display = 'block';

    var total = cart.reduce(function (s, i) { return s + i.price; }, 0);
    totalEl.textContent = '$' + total.toFixed(2).replace('.00', '');

    listEl.innerHTML = cart.map(function (item, idx) {
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(33,33,33,0.07);">' +
        '<div style="flex:1;min-width:0;">' +
          '<p style="font-family:\'Source Serif 4\',serif;font-size:13.5px;font-weight:600;color:#212121;margin:0 0 2px 0;letter-spacing:-0.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + item.name + '</p>' +
          '<span style="font-family:\'Source Serif 4\',serif;font-size:12px;color:rgba(33,33,33,0.5);">$' + item.price + '</span>' +
        '</div>' +
        '<button data-remove="' + idx + '" aria-label="Remove item" style="margin-left:12px;width:26px;height:26px;border-radius:50%;background:rgba(33,33,33,0.06);border:none;cursor:pointer;font-size:14px;color:rgba(33,33,33,0.45);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:sans-serif;transition:background 0.15s;">×</button>' +
      '</div>';
    }).join('');

    listEl.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.dataset.remove, 10);
        var removedId = cart[idx].id;
        cart.splice(idx, 1);
        // Re-enable the add-to-cart button for removed item
        var addBtn = document.querySelector('.add-cart-btn[data-id="' + removedId + '"]');
        if (addBtn) {
          addBtn.textContent = '+ Cart';
          addBtn.classList.remove('in-cart');
          addBtn.style.pointerEvents = '';
        }
        updateCartBadge();
        renderCart();
      });
    });
  }

  /* ── Badge count ───────────────────────────────── */
  function updateCartBadge() {
    document.querySelectorAll('.cart-badge').forEach(function (badge) {
      if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.classList.add('visible');
      } else {
        badge.classList.remove('visible');
      }
    });
  }

  /* ── Checkout (mock) ───────────────────────────── */
  function handleCheckout() {
    closeCart();
    var total = cart.reduce(function (s, i) { return s + i.price; }, 0);
    showAuthToastMkt('Order placed!', cart.length + ' item' + (cart.length > 1 ? 's' : '') + ' · $' + total.toFixed(2).replace('.00', '') + ' confirmed.');
    cart = [];
    document.querySelectorAll('.add-cart-btn.in-cart').forEach(function (b) {
      b.textContent = '+ Cart';
      b.classList.remove('in-cart');
      b.style.pointerEvents = '';
    });
    updateCartBadge();
  }

  function showAuthToastMkt(title, sub) {
    var toastEl = document.getElementById('authToast');
    var inner   = document.getElementById('authToastInner');
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastSub').textContent   = sub;
    toastEl.style.display = 'block';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        inner.style.transform = 'translateY(0)';
        inner.style.opacity   = '1';
      });
    });
    setTimeout(function () {
      inner.style.transform = 'translateY(24px)';
      inner.style.opacity   = '0';
      setTimeout(function () {
        toastEl.style.display = 'none';
        inner.style.transform = '';
        inner.style.opacity   = '';
      }, 450);
    }, 3800);
  }

  /* Expose */
  window.openCart       = openCart;
  window.closeCart      = closeCart;
  window.handleCheckout = handleCheckout;
  window.addToCartItem  = function(id, name, price) {
    var exists = cart.find(function(i) { return i.id === id; });
    if (exists) { openCart(); return; }
    cart.push({ id: id, name: name, price: price });
    updateCartBadge();
    renderCart();
    setTimeout(openCart, 320);
  };
}());

/* ── Shop card click handler ──────────────────────── */
function handleShopCardClick(card) {
  var id    = card.dataset.id;
  var name  = card.dataset.name;
  var price = parseFloat(card.dataset.price);
  if (card.dataset.incart) { openCart(); return; }
  card.dataset.incart = '1';
  addToCartItem(id, name, price);
}

/* ══════════════════════════════════════════════════════
   EARLY ACCESS — CTA email form
   ══════════════════════════════════════════════════════ */
function handleEarlyAccess() {
  var email   = (document.getElementById('ctaEmail').value || '').trim();
  var errorEl = document.getElementById('ctaError');
  errorEl.style.display = 'none';

  if (!email) {
    errorEl.textContent = 'Please enter your email address to join the waitlist.';
    errorEl.style.display = 'block';
    return;
  }
  var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  if (!valid) {
    errorEl.textContent = 'That email doesn\'t look right — please check the format (e.g. you@example.com).';
    errorEl.style.display = 'block';
    return;
  }

  document.getElementById('ctaSuccessEmail').textContent = email;
  document.getElementById('ctaFormWrap').style.display = 'none';
  document.getElementById('ctaSuccess').style.display  = 'block';
  document.getElementById('ctaNoSpam').style.display   = 'none';
}

/* ══════════════════════════════════════════════════════
   PAYMENT MODAL
   ══════════════════════════════════════════════════════ */
(function () {
  var currentPlan = {};

  function openPayModal(planName, price, period, isPaid) {
    currentPlan = { planName: planName, price: price, period: period, isPaid: isPaid };

    /* Reset */
    ['payName','payEmail','payCard','payExpiry','payCvv'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('payError').style.display   = 'none';
    document.getElementById('payFormArea').style.display = 'block';
    document.getElementById('paySuccess').style.display  = 'none';

    /* Plan box */
    document.getElementById('payPlanName').textContent = planName;
    if (price === '0') {
      document.getElementById('payPlanPrice').textContent  = '$0';
      document.getElementById('payPlanPeriod').textContent = 'Free forever';
    } else {
      document.getElementById('payPlanPrice').textContent  = '$' + price;
      document.getElementById('payPlanPeriod').textContent = period;
    }

    /* Card fields & secondary UI */
    document.getElementById('payCardFields').style.display    = isPaid ? 'block' : 'none';
    document.getElementById('paySecurityNote').style.display  = isPaid ? 'flex'  : 'none';

    /* Title / subtitle / button text */
    if (isPaid) {
      document.getElementById('payFormTitle').textContent = 'Complete your order';
      document.getElementById('payFormSub').textContent   = 'You’ll be charged $' + price + period + '. Cancel any time.';
      document.getElementById('paySubmitBtn').textContent = 'Pay $' + price + ' →';
    } else {
      document.getElementById('payFormTitle').textContent = 'Create your free account';
      document.getElementById('payFormSub').textContent   = 'No credit card required. Get started in seconds.';
      document.getElementById('paySubmitBtn').textContent = 'Get started free →';
    }

    /* Show */
    var modal = document.getElementById('payModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        modal.classList.add('pay-open');
      });
    });
  }

  function closePayModal() {
    var modal = document.getElementById('payModal');
    modal.classList.remove('pay-open');
    setTimeout(function() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 420);
  }

  function submitPayment() {
    var name    = (document.getElementById('payName').value  || '').trim();
    var email   = (document.getElementById('payEmail').value || '').trim();
    var errorEl = document.getElementById('payError');
    errorEl.style.display = 'none';

    if (!name) {
      errorEl.textContent = 'Please enter your full name.';
      errorEl.style.display = 'block'; return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      errorEl.style.display = 'block'; return;
    }

    if (currentPlan.isPaid) {
      var card   = (document.getElementById('payCard').value   || '').replace(/\s/g, '');
      var expiry = (document.getElementById('payExpiry').value || '').trim();
      var cvv    = (document.getElementById('payCvv').value    || '').trim();

      if (card.length < 16 || !/^\d+$/.test(card)) {
        errorEl.textContent = 'Please enter a valid 16-digit card number.';
        errorEl.style.display = 'block'; return;
      }
      if (!/^\d{2}\s*\/\s*\d{2}$/.test(expiry)) {
        errorEl.textContent = 'Please enter a valid expiry date in MM / YY format.';
        errorEl.style.display = 'block'; return;
      }
      if (cvv.length < 3 || !/^\d+$/.test(cvv)) {
        errorEl.textContent = 'Please enter a valid CVV (3–4 digits on the back of your card).';
        errorEl.style.display = 'block'; return;
      }
    }

    /* Show success */
    document.getElementById('payFormArea').style.display = 'none';
    document.getElementById('paySuccess').style.display  = 'block';

    if (currentPlan.isPaid) {
      document.getElementById('paySuccessTitle').textContent = 'Payment confirmed!';
      document.getElementById('paySuccessMsg').textContent   =
        'Your ' + currentPlan.planName + ' plan is active. A receipt has been sent to ' + email + '.';
    } else {
      document.getElementById('paySuccessTitle').textContent = 'Account created!';
      document.getElementById('paySuccessMsg').textContent   =
        'Welcome to Calaseed! We sent a confirmation to ' + email + '. Start exploring your free dashboard.';
    }
  }

  /* Card number auto-formatting */
  document.getElementById('payCard').addEventListener('input', function() {
    var v = this.value.replace(/\D/g,'').substring(0,16);
    this.value = v.replace(/(.{4})/g,'$1 ').trim();
  });

  /* Expiry auto-formatting */
  document.getElementById('payExpiry').addEventListener('input', function() {
    var v = this.value.replace(/\D/g,'').substring(0,4);
    if (v.length >= 3) v = v.substring(0,2) + ' / ' + v.substring(2);
    this.value = v;
  });

  /* Backdrop close */
  document.getElementById('payBackdrop').addEventListener('click', closePayModal);

  /* Escape key */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('payModal').style.display === 'flex') closePayModal();
  });

  /* Expose globals */
  window.openPayModal  = openPayModal;
  window.closePayModal = closePayModal;
  window.submitPayment = submitPayment;
}());
