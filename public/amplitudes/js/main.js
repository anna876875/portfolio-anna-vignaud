/* AMPLITUDES — éco-JS — v2 */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// Menu mobile
$('.hbg')?.addEventListener('click', () => $('.mnav').classList.add('on'));
$('.cls')?.addEventListener('click', () => $('.mnav').classList.remove('on'));
$$('.mnav a').forEach(a => a.addEventListener('click', () => $('.mnav').classList.remove('on')));

// Reveal au scroll
const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('vis'); io.unobserve(e.target) } }), {threshold:.1});
$$('.rev').forEach(el => io.observe(el));

// Tabs filtres
$$('.tab').forEach(t => t.addEventListener('click', () => {
  t.closest('.tabs').querySelectorAll('.tab').forEach(x => x.classList.remove('on'));
  t.classList.add('on');
}));

// Filtre destinations par région
$$('[data-region-filter]').forEach(btn => btn.addEventListener('click', () => {
  const r = btn.dataset.regionFilter;
  $$('[data-region]').forEach(c => c.style.display = (r === 'all' || c.dataset.region === r) ? '' : 'none');
}));

// Créateur de voyage — sélection par groupe
$$('[data-creator] .sel-opt, [data-creator] .mood-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    opt.closest('[data-creator]').querySelectorAll('.sel-opt,.mood-opt').forEach(x => x.classList.remove('on'));
    opt.classList.add('on');
    updateCreatorBtn();
  });
});
/* ── TUNNEL RÉSERVATION ─────────────────────────────────────── */
(function() {
  const form    = document.getElementById('sej-bk-form');
  const tunnel  = document.getElementById('sej-tunnel');
  if (!form || !tunnel) return;

  const depInput  = document.getElementById('bk-dep');
  const travelers = document.getElementById('bk-travelers');
  const depErr    = document.getElementById('bk-dep-err');
  const tunnelOv  = document.getElementById('sej-tunnel-ov');
  const tunnelCls = document.getElementById('sej-tunnel-cls');

  const PRICE_PP = 2490;
  const FMT = { day:'2-digit', month:'long', year:'numeric' };

  function openTunnel() {
    const isFlexible = document.querySelector('.sej-date-tab.on')?.dataset.panel === 'date-flex';
    let date;
    if (isFlexible) {
      const sel = document.querySelector('.sej-month-btn.on');
      if (!sel) { document.querySelector('.sej-month-grid')?.classList.add('err'); return; }
      date = sel.dataset.month + '-01';
    } else {
      date = depInput?.value;
      if (!date) { depErr?.classList.add('on'); depInput?.focus(); return; }
      depErr?.classList.remove('on');
    }

    const n = parseInt(travelers?.value || 2);
    const dep = new Date(date + 'T00:00:00');
    const ret = new Date(dep); ret.setDate(ret.getDate() + 5);

    document.getElementById('tunnel-dep').textContent     = dep.toLocaleDateString('fr-FR', FMT);
    document.getElementById('tunnel-ret').textContent     = ret.toLocaleDateString('fr-FR', FMT);
    document.getElementById('tunnel-travelers').textContent = n + (n > 1 ? ' voyageurs' : ' voyageur');
    document.getElementById('tunnel-price').textContent   = (n * PRICE_PP).toLocaleString('fr-FR') + ' €';

    tunnel.classList.add('on');
    tunnel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    tunnelCls?.focus();
  }

  function closeTunnel() {
    tunnel.classList.remove('on');
    tunnel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.getElementById('bk-submit')?.focus();
  }

  form.addEventListener('submit', e => { e.preventDefault(); openTunnel(); });
  tunnelOv?.addEventListener('click', closeTunnel);
  tunnelCls?.addEventListener('click', closeTunnel);
  depInput?.addEventListener('input', () => depErr?.classList.remove('on'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && tunnel.classList.contains('on')) closeTunnel(); });
})();

/* ── PROGRAMME TABS ────────────────────────────────────────────── */
(function(){
  const tabs = document.querySelectorAll('.prog-tab');
  if(!tabs.length) return;
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('on'); t.setAttribute('aria-selected','false'); });
      document.querySelectorAll('.prog-panel').forEach(function(p){ p.classList.remove('on'); });
      tab.classList.add('on');
      tab.setAttribute('aria-selected','true');
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      if(panel) panel.classList.add('on');
    });
  });
})();

/* ── DATE TOGGLE + MOIS FLEXIBLES ──────────────────────────────── */
(function(){
  const tabs = $$('.sej-date-tab');
  if(!tabs.length) return;
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('on'));
    $$('.sej-date-panel').forEach(p => p.classList.remove('on'));
    tab.classList.add('on');
    const panel = document.getElementById(tab.dataset.panel);
    if(panel) panel.classList.add('on');
  }));
  $$('.sej-month-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.sej-month-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    document.querySelector('.sej-month-grid')?.classList.remove('err');
  }));
})();

/* ── MODALE CRÉATION VOYAGE ──────────────────────────────────────── */
(function () {
  var modal   = document.getElementById('cre-modal');
  if (!modal) return;

  var overlay  = document.getElementById('cre-ov');
  var cls      = document.getElementById('cre-cls');
  var backBtn  = document.getElementById('cre-back');
  var bar      = document.getElementById('cre-bar');
  var progress = modal.querySelector('[role="progressbar"]');
  var form     = document.getElementById('cre-form');
  var TOTAL    = 5;
  var current  = 1;
  var answers  = {};

  function setProgress(step) {
    var pct = Math.round((step / TOTAL) * 100);
    bar.style.width = pct + '%';
    if (progress) progress.setAttribute('aria-valuenow', pct);
  }

  function show(step) {
    for (var n = 1; n <= TOTAL; n++) {
      var el = document.getElementById('cre-s' + n);
      if (el) el.hidden = (n !== step);
    }
    var s6 = document.getElementById('cre-s6'); if (s6) s6.hidden = true;
    var done = document.getElementById('cre-done'); if (done) done.hidden = true;
    setProgress(step);
    backBtn.hidden = (step <= 1);
    current = step;
  }

  function showForm() {
    for (var n = 1; n <= TOTAL; n++) {
      var el = document.getElementById('cre-s' + n);
      if (el) el.hidden = true;
    }
    var done = document.getElementById('cre-done'); if (done) done.hidden = true;
    var s6 = document.getElementById('cre-s6');
    if (s6) { s6.hidden = false; var fi = s6.querySelector('input'); if (fi) setTimeout(function(){ fi.focus(); }, 60); }
    setProgress(TOTAL);
    backBtn.hidden = false;
    current = TOTAL + 1;
  }

  function showConfirm() {
    for (var n = 1; n <= TOTAL; n++) {
      var el = document.getElementById('cre-s' + n);
      if (el) el.hidden = true;
    }
    var s6 = document.getElementById('cre-s6'); if (s6) s6.hidden = true;
    var done = document.getElementById('cre-done'); if (done) done.hidden = false;
    setProgress(TOTAL);
    backBtn.hidden = true;
  }

  function open() {
    current = 1;
    answers = {};
    modal.querySelectorAll('.cre-opt').forEach(function (o) { o.classList.remove('on'); });
    if (form) form.reset();
    show(1);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    cls.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  var triggerBtn = document.getElementById('btn-cre');
  if (triggerBtn) triggerBtn.addEventListener('click', open);

  cls.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) close();
  });

  modal.querySelectorAll('.cre-opt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.closest('.cre-step').querySelectorAll('.cre-opt').forEach(function (o) { o.classList.remove('on'); });
      btn.classList.add('on');
      answers[btn.dataset.field] = btn.dataset.val;
      setTimeout(function () {
        if (current < TOTAL) show(current + 1);
        else showForm();
      }, 360);
    });
  });

  backBtn.addEventListener('click', function () {
    if (current === TOTAL + 1) show(TOTAL);
    else if (current > 1) show(current - 1);
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var prenom = document.getElementById('cre-prenom').value.trim();
      var email  = document.getElementById('cre-email').value.trim();
      if (!prenom) { document.getElementById('cre-prenom').focus(); return; }
      if (!email || !email.includes('@')) { document.getElementById('cre-email').focus(); return; }
      answers.prenom = prenom;
      answers.email  = email;
      answers.tel    = document.getElementById('cre-tel').value.trim();
      showConfirm();
    });
  }
})();

/* ── GALERIE PHOTOS ─────────────────────────────────────── */
(function () {
  var PHOTOS = [
    // Paysages
    { cat:'paysages', src:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=80&fm=webp&fit=crop', alt:'Savane tanzanienne au coucher du soleil' },
    { cat:'paysages', src:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=80&fm=webp&fit=crop', alt:'Vue aérienne sur les plaines d\'Afrique de l\'Est' },
    { cat:'paysages', src:'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80&fm=webp&fit=crop', alt:'Immensité sauvage, Tanzanie' },
    { cat:'paysages', src:'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1400&q=80&fm=webp&fit=crop', alt:'Paysage d\'Afrique de l\'Est au lever du soleil' },
    // Safari & Faune
    { cat:'safari', src:'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1400&q=80&fm=webp&fit=crop', alt:'Éléphants à la mare du Serengeti' },
    { cat:'safari', src:'https://images.unsplash.com/photo-1548021682-1720ed403a5b?w=1400&q=80&fm=webp&fit=crop', alt:'Zèbres en migration sur les plaines du Serengeti' },
    { cat:'safari', src:'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=80&fm=webp&fit=crop', alt:'Lions au coucher du soleil, Serengeti' },
    { cat:'safari', src:'https://images.unsplash.com/photo-1544985361-b420d7a77043?w=1400&q=80&fm=webp&fit=crop', alt:'Faune sauvage en bordure de rivière' },
    { cat:'safari', src:'https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=1400&q=80&fm=webp&fit=crop', alt:'Game drive au lever du soleil, Serengeti' },
    // Hébergements
    { cat:'lodges', src:'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1400&q=80&fm=webp&fit=crop', alt:'Tented camp sur pilotis, Serengeti Savanna Lodge' },
    { cat:'lodges', src:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1400&q=80&fm=webp&fit=crop', alt:'Suite de luxe avec vue panoramique sur la savane' },
    { cat:'lodges', src:'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1400&q=80&fm=webp&fit=crop', alt:'Resort face au lagon de Zanzibar' },
    // Zanzibar
    { cat:'zanzibar', src:'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=1400&q=80&fm=webp&fit=crop', alt:'Plage de Zanzibar, eaux turquoise' },
    { cat:'zanzibar', src:'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1400&q=80&fm=webp&fit=crop', alt:'Dhow traditionnel au coucher du soleil, Zanzibar' },
    { cat:'zanzibar', src:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=80&fm=webp&fit=crop', alt:'Lagon et récif corallien, Mnemba Island' },
  ];

  var modal   = document.getElementById('pgal');
  if (!modal) return;

  var imgEl   = document.getElementById('pgal-img');
  var altEl   = document.getElementById('pgal-alt');
  var idxEl   = document.getElementById('pgal-idx');
  var clsBtn  = document.getElementById('pgal-cls');
  var prevBtn = document.getElementById('pgal-prev');
  var nextBtn = document.getElementById('pgal-next');
  var openBtn = document.getElementById('btn-pgal');
  var catBtns = modal.querySelectorAll('.pgal-cat');

  var filtered = PHOTOS.slice();
  var idx = 0;

  function updateNav() {
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === filtered.length - 1;
  }

  function showPhoto(i) {
    idx = Math.max(0, Math.min(filtered.length - 1, i));
    var p = filtered[idx];
    imgEl.classList.add('pgal-loading');
    imgEl.onload = function () { imgEl.classList.remove('pgal-loading'); };
    imgEl.onerror = function () { imgEl.classList.remove('pgal-loading'); };
    imgEl.src = p.src;
    imgEl.alt = p.alt;
    if (altEl) altEl.textContent = p.alt;
    if (idxEl) idxEl.textContent = (idx + 1) + ' / ' + filtered.length;
    updateNav();
  }

  function setCat(cat) {
    filtered = cat === 'all' ? PHOTOS.slice() : PHOTOS.filter(function (p) { return p.cat === cat; });
    catBtns.forEach(function (b) { b.classList.toggle('on', b.dataset.cat === cat); });
    showPhoto(0);
  }

  function open() {
    var sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = sw + 'px';
    document.body.style.overflow = 'hidden';
    setCat('all');
    modal.hidden = false;
    clsBtn.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    imgEl.src = '';
    if (openBtn) openBtn.focus();
  }

  if (openBtn) openBtn.addEventListener('click', open);
  clsBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { showPhoto(idx - 1); });
  nextBtn.addEventListener('click', function () { showPhoto(idx + 1); });

  catBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { setCat(btn.dataset.cat); });
  });

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowLeft')  showPhoto(idx - 1);
    if (e.key === 'ArrowRight') showPhoto(idx + 1);
  });
})();

function updateCreatorBtn() {
  const dest = $('[data-creator="destination"] .sel-opt.on');
  const mois = $('[data-creator="mois"] .sel-opt.on');
  const mood = $('[data-creator="mood"] .mood-opt.on');
  const btn  = $('#creator-btn');
  if (!btn) return;
  const count = [dest, mois, mood].filter(Boolean).length;
  btn.textContent = count === 3 ? 'Voir mon voyage →' : `Créer mon voyage (${count}/3 choix) →`;
}

/* ── WIP MODAL ─────────────────────────────────────────────────────── */
(function () {
  var modal = document.getElementById('wip-modal');
  if (!modal) return;
  var ov  = modal.querySelector('.wip-ov');
  var cls = modal.querySelector('.wip-cls');

  function open() { modal.hidden = false; document.body.style.overflow = 'hidden'; }
  function close() { modal.hidden = true; document.body.style.overflow = ''; }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-wip]');
    if (!el) return;
    e.preventDefault();
    open();
  });
  if (ov)  ov.addEventListener('click', close);
  if (cls) cls.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
})();

/* ── DRAWER AGENCE ──────────────────────────────────────────────────── */
(function () {
  var DRAWER_HTML =
    '<div id="agn-drawer" class="agn-drawer" role="dialog" aria-modal="true" aria-labelledby="agnd-title">' +
    '<div class="agn-dov" id="agn-dov"></div>' +
    '<div class="agn-dpanel">' +
      '<div class="agn-dhd">' +
        '<span class="agn-dlogo">Amplitudes</span>' +
        '<button class="agn-dcls" id="agn-dcls" type="button" aria-label="Fermer">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="agn-dbody">' +
        '<span class="agn-dbadge">En développement</span>' +
        '<h2 id="agnd-title" class="agn-dtitle">L\'agence <em class="sa">Amplitudes</em></h2>' +
        '<p class="agn-dsub">Cette section est en cours de construction. Elle vous présentera bientôt notre histoire, notre équipe de conseillers et nos engagements depuis 2003.</p>' +
        '<div class="agn-dstats">' +
          '<div class="agn-dstat"><span class="agn-dstat-n">2003</span><span class="agn-dstat-l">Fondée en</span></div>' +
          '<div class="agn-dstat"><span class="agn-dstat-n">4</span><span class="agn-dstat-l">Agences</span></div>' +
          '<div class="agn-dstat"><span class="agn-dstat-n">48</span><span class="agn-dstat-l">Destinations</span></div>' +
        '</div>' +
        '<span class="agn-dcoming-lbl">Prochainement disponible :</span>' +
        '<ul class="agn-dcoming-list">' +
          '<li>Notre histoire depuis 2003</li>' +
          '<li>L\'équipe de conseillers experts</li>' +
          '<li>Nos engagements responsables</li>' +
          '<li>Nos partenaires locaux (48 pays)</li>' +
          '<li>Presse &amp; distinctions</li>' +
        '</ul>' +
        '<button type="button" id="agn-dcre" class="btn btn-dk" style="margin-top:2rem;width:100%;justify-content:center;display:flex">Créer mon voyage sur mesure</button>' +
      '</div>' +
    '</div>' +
    '</div>';

  if (!document.getElementById('agn-drawer')) {
    document.body.insertAdjacentHTML('beforeend', DRAWER_HTML);
  }

  var drawer = document.getElementById('agn-drawer');
  var ov     = document.getElementById('agn-dov');
  var cls    = document.getElementById('agn-dcls');
  var creBtn = document.getElementById('agn-dcre');

  function openDrawer() {
    drawer.classList.add('on');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { if (cls) cls.focus(); }, 50);
  }

  function closeDrawer() {
    drawer.classList.remove('on');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="agence.html"], a[href*="agence.html"]');
    if (a) { e.preventDefault(); openDrawer(); return; }
    var btn = e.target.closest('.nav-agence-btn, [data-agence]');
    if (btn) { e.preventDefault(); openDrawer(); }
  });

  if (ov)  ov.addEventListener('click', closeDrawer);
  if (cls) cls.addEventListener('click', closeDrawer);

  if (creBtn) creBtn.addEventListener('click', function () {
    closeDrawer();
    var trigger = document.getElementById('btn-cre');
    if (trigger) setTimeout(function () { trigger.click(); }, 420);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('on')) closeDrawer();
  });

  if (window.location.hash === '#agence') {
    window.history.replaceState(null, '', window.location.pathname);
    setTimeout(openDrawer, 300);
  }
})();

/* ── NAVIGATION DES ÉTAPES DU TUNNEL ─────────────────────────────────
   Raison : les boutons tstep-1-next / tstep-2-next / tstep-3-pay
   existaient dans le HTML sans aucun handler → tunnel bloqué à l'étape 1
   ──────────────────────────────────────────────────────────────────── */
(function () {
  var tunnel = document.getElementById('sej-tunnel');
  if (!tunnel) return;

  var steps   = tunnel.querySelectorAll('.sej-tunnel-step');
  var dots    = tunnel.querySelectorAll('.sej-t-dot');
  var lines   = tunnel.querySelectorAll('.sej-t-line');
  var success = tunnel.querySelector('.sej-tunnel-success');

  function setStep(n) {
    steps.forEach(function (s, i) { s.classList.toggle('on', i + 1 === n); });
    dots.forEach(function (d, i) {
      d.classList.toggle('on', i + 1 === n);
      d.classList.toggle('done', i + 1 < n);
    });
    lines.forEach(function (l, i) { l.classList.toggle('done', i + 1 < n); });
    var focusTarget = tunnel.querySelector('.sej-tunnel-step.on input, .sej-tunnel-step.on .sej-tunnel-submit');
    if (focusTarget) setTimeout(function () { focusTarget.focus(); }, 60);
  }

  setStep(1);

  var next1 = document.getElementById('tstep-1-next');
  if (next1) next1.addEventListener('click', function () { setStep(2); });

  var next2 = document.getElementById('tstep-2-next');
  if (next2) next2.addEventListener('click', function () {
    var prenom  = document.getElementById('t-prenom');
    var contact = document.getElementById('t-contact');
    var err     = document.getElementById('t-contact-err');
    if (!prenom || !prenom.value.trim() || !contact || !contact.value.trim()) {
      if (err) { err.style.display = 'block'; }
      if (prenom && !prenom.value.trim()) prenom.focus();
      else if (contact) contact.focus();
      return;
    }
    if (err) err.style.display = 'none';
    setStep(3);
  });

  var pay = document.getElementById('tstep-3-pay');
  if (pay) pay.addEventListener('click', function () {
    steps.forEach(function (s) { s.classList.remove('on'); });
    if (success) {
      success.classList.add('on');
      var h = success.querySelector('.sej-tunnel-success-h');
      if (h) { h.setAttribute('tabindex', '-1'); setTimeout(function () { h.focus(); }, 60); }
    }
    dots.forEach(function (d) { d.classList.remove('on'); d.classList.add('done'); });
    lines.forEach(function (l) { l.classList.add('done'); });
  });

  tunnel.querySelectorAll('.sej-t-back').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = Array.from(steps).findIndex(function (s) { return s.classList.contains('on'); });
      if (idx > 0) setStep(idx);
    });
  });
})();

/* ── WISHLIST · STICKY BAR · SOCIAL PROOF ────────────────────────────
   Wishlist persistante en localStorage, drawer latéral, sticky CTA
   mobile via IntersectionObserver, compteur social proof live.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  var WL_KEY = 'amp_wl';

  function getWL() {
    try { return JSON.parse(localStorage.getItem(WL_KEY) || '[]'); } catch (e) { return []; }
  }
  function setWL(data) {
    try { localStorage.setItem(WL_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function updateBadge() {
    var n = getWL().length;
    var badge = document.getElementById('wl-count');
    var btn   = document.getElementById('wl-hdr-btn');
    if (badge) { badge.textContent = n; badge.hidden = n === 0; }
    if (btn)   btn.setAttribute('aria-label', 'Mes favoris (' + n + ')');
  }

  function toggleItem(id, title, price, img) {
    var wl = getWL();
    var idx = wl.findIndex(function (i) { return i.id === id; });
    if (idx > -1) { wl.splice(idx, 1); } else { wl.push({ id: id, title: title, price: price, img: img }); }
    setWL(wl);
    updateBadge();
    return idx === -1;
  }

  function syncBtns() {
    var wl = getWL();
    document.querySelectorAll('.wl-btn,.wl-btn-detail').forEach(function (btn) {
      var on = wl.some(function (i) { return i.id === btn.dataset.id; });
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-label', on ? 'Retirer des favoris' : 'Ajouter aux favoris');
    });
  }

  document.querySelectorAll('.wl-btn,.wl-btn-detail').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var added = toggleItem(
        btn.dataset.id || '',
        btn.dataset.title || '',
        btn.dataset.price || '',
        btn.dataset.img   || ''
      );
      btn.classList.toggle('on', added);
      btn.setAttribute('aria-label', added ? 'Retirer des favoris' : 'Ajouter aux favoris');
    });
  });

  function renderWL() {
    var list = document.getElementById('wl-list');
    if (!list) return;
    var wl = getWL();
    if (!wl.length) {
      list.innerHTML = '<div class="wl-empty">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
        '<p>Aucun favori pour l\'instant.<br>Explorez nos circuits !</p></div>';
      return;
    }
    list.innerHTML = wl.map(function (item) {
      return '<div class="wl-item">' +
        '<img class="wl-item-img" src="' + item.img + '" alt="" loading="lazy">' +
        '<div class="wl-item-body">' +
        '<p class="wl-item-title">' + item.title + '</p>' +
        '<p class="wl-item-price">Dès ' + item.price + '</p>' +
        '<button class="wl-item-rm" type="button" data-rm="' + item.id + '">Retirer</button>' +
        '</div></div>';
    }).join('');
    list.querySelectorAll('[data-rm]').forEach(function (rmBtn) {
      rmBtn.addEventListener('click', function () {
        toggleItem(rmBtn.dataset.rm, '', '', '');
        renderWL();
        syncBtns();
      });
    });
  }

  var drawer   = document.getElementById('wl-drawer');
  var drawerOv = document.getElementById('wl-drawer-ov');
  var hdrBtn   = document.getElementById('wl-hdr-btn');

  function openWL() {
    if (!drawer) return;
    renderWL();
    drawer.classList.add('on');
    if (drawerOv) drawerOv.classList.add('on');
    document.body.style.overflow = 'hidden';
    var cls = document.getElementById('wl-drawer-cls');
    if (cls) setTimeout(function () { cls.focus(); }, 50);
  }
  function closeWL() {
    if (!drawer) return;
    drawer.classList.remove('on');
    if (drawerOv) drawerOv.classList.remove('on');
    document.body.style.overflow = '';
    if (hdrBtn) hdrBtn.focus();
  }

  if (hdrBtn)   hdrBtn.addEventListener('click', openWL);
  if (drawerOv) drawerOv.addEventListener('click', closeWL);
  var cls = document.getElementById('wl-drawer-cls');
  if (cls) cls.addEventListener('click', closeWL);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('on')) closeWL();
  });

  /* Sticky mobile booking bar */
  var stickyBar   = document.getElementById('sticky-bk-bar');
  var ctaTrigger  = document.getElementById('reserver');
  if (stickyBar && ctaTrigger && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      stickyBar.classList.toggle('vis', !entries[0].isIntersecting);
    }, { threshold: 0 });
    io.observe(ctaTrigger);
    var stickyBtn = stickyBar.querySelector('.sticky-bk-cta');
    if (stickyBtn) {
      stickyBtn.addEventListener('click', function () {
        ctaTrigger.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* Social proof live counter */
  var liveN = document.getElementById('sej-live-n');
  if (liveN) {
    var liveCount = Math.floor(Math.random() * 8) + 9;
    liveN.textContent = liveCount;
    setInterval(function () {
      var d = Math.round(Math.random() * 2) - 1;
      liveCount = Math.max(7, Math.min(19, liveCount + d));
      liveN.textContent = liveCount;
    }, 8000);
  }

  /* Sort catalogue */
  var sortSel = document.getElementById('voy-sort');
  if (sortSel) {
    sortSel.addEventListener('change', function () {
      var grid  = document.getElementById('voy-grid');
      if (!grid) return;
      var cards = Array.from(grid.querySelectorAll('.voy-card:not([hidden])'));
      var priceMap = { nepal:2490, tanzanie:3290, japon:3890, maldives:4590, maroc:1890, perou:3490, islande:2490, srilanka:2190, costarica:2890, ethiopie:3190, polynesie:5490, bhoutan:4290 };
      var durMap   = { court:8,   moyen:12, long:15 };
      cards.sort(function (a, b) {
        if (sortSel.value === 'prix-asc')  return (priceMap[a.dataset.id]||0) - (priceMap[b.dataset.id]||0);
        if (sortSel.value === 'prix-desc') return (priceMap[b.dataset.id]||0) - (priceMap[a.dataset.id]||0);
        if (sortSel.value === 'duree-asc') return (durMap[a.dataset.duree]||0) - (durMap[b.dataset.duree]||0);
        return 0;
      });
      cards.forEach(function (c) { grid.appendChild(c); });
    });
  }

  syncBtns();
  updateBadge();
})();
