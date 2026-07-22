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
    const date = depInput?.value;
    if (!date) {
      depErr?.classList.add('on');
      depInput?.focus();
      return;
    }
    depErr?.classList.remove('on');

    const n = parseInt(travelers?.value || 2);
    const dep = new Date(date + 'T00:00:00');
    const ret = new Date(dep); ret.setDate(ret.getDate() + 10);

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

function updateCreatorBtn() {
  const dest = $('[data-creator="destination"] .sel-opt.on');
  const mois = $('[data-creator="mois"] .sel-opt.on');
  const mood = $('[data-creator="mood"] .mood-opt.on');
  const btn  = $('#creator-btn');
  if (!btn) return;
  const count = [dest, mois, mood].filter(Boolean).length;
  btn.textContent = count === 3 ? 'Voir mon voyage →' : `Créer mon voyage (${count}/3 choix) →`;
}
