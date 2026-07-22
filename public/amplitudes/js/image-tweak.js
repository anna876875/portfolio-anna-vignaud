/* AMPLITUDES — image-tweak.js
   Developer image adjustment panel. Remove this file in production.
   Depends on image-apply.js being loaded first. */
(function () {
  'use strict';

  /* ─── Internal state ─────────────────────────────────────────── */
  var _config   = { version: 1, images: {} };
  var _selected = null; /* currently selected image id */
  var _panel    = null;
  var _fab      = null;
  var _open     = false;

  var DEFAULTS = {
    filter:       { brightness: 1, contrast: 1, saturate: 1, grayscale: 0, sepia: 0, hueRotate: 0, blur: 0 },
    opacity:       1,
    borderRadius:  0,
    transform:    { scale: 1, translateX: 0, translateY: 0 },
    objectPosition: '50% 50%',
    overlay:      { opacity: 0, color: '#000000', blendMode: 'normal' }
  };

  /* ─── Helpers ────────────────────────────────────────────────── */
  function deepMerge(target, source) {
    var out = Object.assign({}, target);
    Object.keys(source).forEach(function (k) {
      if (source[k] !== null && typeof source[k] === 'object' && !Array.isArray(source[k])) {
        out[k] = deepMerge(target[k] || {}, source[k]);
      } else {
        out[k] = source[k];
      }
    });
    return out;
  }

  function getImgConfig(id) {
    return deepMerge(DEFAULTS, _config.images[id] || {});
  }

  function setImgConfig(id, cfg) {
    _config.images[id] = cfg;
  }

  /* ─── Discover all images on page ───────────────────────────── */
  function discoverImages() {
    var imgs = document.querySelectorAll('img, [style*="background-image"]');
    var list = [];
    var seen = {};
    imgs.forEach(function (el) {
      var id = el.getAttribute('data-img-id');
      if (!id) {
        id = el.getAttribute('alt') || el.getAttribute('class') || '';
        id = id.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase().slice(0, 40);
        if (!id) id = 'img';
        var base = id, n = 1;
        while (seen[id]) id = base + '-' + (++n);
        el.setAttribute('data-img-id', id);
      }
      if (!seen[id]) {
        seen[id] = true;
        var thumb = el.tagName === 'IMG' ? el.src : '';
        list.push({ id: id, el: el, thumb: thumb });
      }
    });
    return list;
  }

  /* ─── Build panel HTML ───────────────────────────────────────── */
  function buildPanel() {
    var el = document.createElement('div');
    el.id = 'amp-tweak-panel';
    el.innerHTML = [
      '<div id="atp-header">',
        '<span id="atp-title">Image Tweaks</span>',
        '<div id="atp-hdr-btns">',
          '<button id="atp-export" title="Export JSON">&#8681;</button>',
          '<button id="atp-save">Save Changes</button>',
          '<button id="atp-close">&#10005;</button>',
        '</div>',
      '</div>',
      '<div id="atp-body">',
        '<div id="atp-col-l">',
          '<div id="atp-search-wrap"><input id="atp-search" placeholder="Filter images…" /></div>',
          '<ul id="atp-img-list"></ul>',
        '</div>',
        '<div id="atp-col-r" id="atp-controls">',
          '<p id="atp-placeholder">← Select an image</p>',
          '<div id="atp-controls-inner" style="display:none">',
            '<div class="atp-group">',
              '<span class="atp-group-label">Filters</span>',
              _slider('brightness',  'Luminosité',    0.0, 3.0, 0.01, 1),
              _slider('contrast',    'Contraste',     0.0, 3.0, 0.01, 1),
              _slider('saturate',    'Saturation',    0.0, 3.0, 0.01, 1),
              _slider('grayscale',   'Gris',          0,   100, 1,    0),
              _slider('sepia',       'Sépia',         0.0, 1.0, 0.01, 0),
              _slider('hueRotate',   'Teinte',        0,   360, 1,    0),
              _slider('blur',        'Flou (px)',     0,   20,  0.1,  0),
            '</div>',
            '<div class="atp-group">',
              '<span class="atp-group-label">Visibilité</span>',
              _slider('opacity',     'Opacité',       0.0, 1.0, 0.01, 1),
              _slider('borderRadius','Rayon (px)',     0,   120, 1,    0),
            '</div>',
            '<div class="atp-group">',
              '<span class="atp-group-label">Transform</span>',
              _slider('scale',       'Échelle',       0.5, 2.0, 0.01, 1),
              _slider('translateX',  'Position X (%)', -50, 50, 0.5,  0),
              _slider('translateY',  'Position Y (%)', -50, 50, 0.5,  0),
            '</div>',
            '<div class="atp-group">',
              '<span class="atp-group-label">Object Position</span>',
              _slider('posX',        'Horiz. (%)',    0, 100, 0.5, 50),
              _slider('posY',        'Vertical (%)', 0, 100, 0.5, 50),
            '</div>',
            '<div class="atp-group">',
              '<span class="atp-group-label">Overlay</span>',
              _slider('overlayOpacity', 'Opacité overlay', 0, 1, 0.01, 0),
              '<div class="atp-row">',
                '<label for="atp-overlayColor">Couleur</label>',
                '<input type="color" id="atp-overlayColor" value="#000000" />',
              '</div>',
              '<div class="atp-row">',
                '<label for="atp-blendMode">Blend mode</label>',
                '<select id="atp-blendMode">',
                  ['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion','hue','saturation','color','luminosity'].map(function(m){ return '<option value="'+m+'">'+m+'</option>'; }).join(''),
                '</select>',
              '</div>',
            '</div>',
            '<button id="atp-reset" style="margin-top:8px;width:100%">Réinitialiser</button>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
    return el;
  }

  function _slider(id, label, min, max, step, def) {
    return [
      '<div class="atp-row">',
        '<label for="atp-' + id + '">' + label + '</label>',
        '<div class="atp-slider-wrap">',
          '<input type="range" id="atp-' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + def + '" />',
          '<span class="atp-val" id="atp-' + id + '-val">' + def + '</span>',
        '</div>',
      '</div>'
    ].join('');
  }

  /* ─── Panel styles ───────────────────────────────────────────── */
  function injectStyles() {
    var s = document.createElement('style');
    s.textContent = [
      '#amp-tweak-fab{position:fixed;bottom:24px;right:24px;z-index:99990;width:48px;height:48px;border-radius:50%;background:#2B7A72;color:#fff;border:none;font-size:20px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;transition:transform .15s}',
      '#amp-tweak-fab:hover{transform:scale(1.08)}',
      '#amp-tweak-panel{position:fixed;bottom:84px;right:24px;z-index:99991;width:820px;max-width:calc(100vw - 32px);height:540px;max-height:calc(100vh - 100px);background:#fafaf9;border:1px solid #e3ded6;border-radius:14px;box-shadow:0 16px 48px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px}',
      '#atp-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#fff;border-bottom:1px solid #e3ded6;gap:8px}',
      '#atp-title{font-weight:700;font-size:14px;color:#1a1815;letter-spacing:-.015em}',
      '#atp-hdr-btns{display:flex;gap:6px}',
      '#atp-save{background:#2B7A72;color:#fff;border:none;padding:5px 14px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600}',
      '#atp-save:hover{background:#24665e}',
      '#atp-export{background:transparent;color:#6a6560;border:1px solid #e3ded6;padding:4px 10px;border-radius:7px;cursor:pointer;font-size:15px}',
      '#atp-close{background:transparent;border:none;color:#6a6560;cursor:pointer;font-size:16px;padding:2px 6px}',
      '#atp-body{display:flex;flex:1;overflow:hidden}',
      '#atp-col-l{width:220px;border-right:1px solid #e3ded6;display:flex;flex-direction:column;background:#f5f4f1}',
      '#atp-search-wrap{padding:10px;border-bottom:1px solid #e3ded6}',
      '#atp-search{width:100%;box-sizing:border-box;padding:6px 10px;border:1px solid #d8d3cb;border-radius:7px;font-size:12px;background:#fff}',
      '#atp-img-list{flex:1;overflow-y:auto;margin:0;padding:6px;list-style:none}',
      '#atp-img-list li{padding:7px 8px;border-radius:7px;cursor:pointer;display:flex;align-items:center;gap:8px;color:#3a3733}',
      '#atp-img-list li:hover{background:#eceae6}',
      '#atp-img-list li.on{background:#2B7A72;color:#fff}',
      '#atp-img-list li .atp-li-thumb{width:32px;height:32px;object-fit:cover;border-radius:4px;flex-shrink:0;background:#e3ded6}',
      '#atp-img-list li .atp-li-id{font-size:11px;word-break:break-all;line-height:1.3}',
      '#atp-col-r{flex:1;overflow-y:auto;padding:16px}',
      '#atp-placeholder{color:#9a948e;text-align:center;margin-top:40px}',
      '.atp-group{margin-bottom:16px;padding:12px;background:#fff;border:1px solid #e3ded6;border-radius:10px}',
      '.atp-group-label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9a948e;margin-bottom:8px}',
      '.atp-row{display:flex;align-items:center;gap:8px;padding:4px 0}',
      '.atp-row label{width:110px;flex-shrink:0;font-size:12px;color:#5a5550}',
      '.atp-slider-wrap{display:flex;align-items:center;gap:8px;flex:1}',
      '.atp-slider-wrap input[type=range]{flex:1;accent-color:#2B7A72}',
      '.atp-val{width:38px;text-align:right;font-size:11px;color:#6a6560;font-variant-numeric:tabular-nums}',
      '.atp-row input[type=color]{width:36px;height:26px;border:1px solid #e3ded6;border-radius:5px;cursor:pointer;padding:2px}',
      '.atp-row select{flex:1;padding:4px 6px;border:1px solid #d8d3cb;border-radius:6px;font-size:12px;background:#fff}',
      '#atp-reset{padding:6px;background:#fff;border:1px solid #e3ded6;border-radius:7px;color:#6a6560;cursor:pointer;font-size:12px}',
      '#atp-reset:hover{background:#fee2e2;border-color:#fca5a5;color:#dc2626}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ─── Populate image list ─────────────────────────────────────── */
  function renderImgList(images, filter) {
    var ul = document.getElementById('atp-img-list');
    ul.innerHTML = '';
    images.forEach(function (img) {
      if (filter && img.id.indexOf(filter) === -1) return;
      var li = document.createElement('li');
      if (img.id === _selected) li.classList.add('on');
      if (img.thumb) {
        var th = document.createElement('img');
        th.src = img.thumb;
        th.className = 'atp-li-thumb';
        th.alt = '';
        li.appendChild(th);
      } else {
        var ph = document.createElement('div');
        ph.className = 'atp-li-thumb';
        li.appendChild(ph);
      }
      var sp = document.createElement('span');
      sp.className = 'atp-li-id';
      sp.textContent = img.id;
      li.appendChild(sp);
      li.addEventListener('click', function () { selectImage(img.id); });
      ul.appendChild(li);
    });
  }

  /* ─── Read/write controls ─────────────────────────────────────── */
  function r(id) { return document.getElementById('atp-' + id); }

  function loadControls(cfg) {
    var f = cfg.filter, t = cfg.transform, o = cfg.overlay;
    setSlider('brightness',     f.brightness);
    setSlider('contrast',       f.contrast);
    setSlider('saturate',       f.saturate);
    setSlider('grayscale',      f.grayscale);
    setSlider('sepia',          f.sepia);
    setSlider('hueRotate',      f.hueRotate);
    setSlider('blur',           f.blur);
    setSlider('opacity',        cfg.opacity);
    setSlider('borderRadius',   cfg.borderRadius);
    setSlider('scale',          t.scale);
    setSlider('translateX',     t.translateX);
    setSlider('translateY',     t.translateY);
    var pos = (cfg.objectPosition || '50% 50%').split(' ');
    setSlider('posX', parseFloat(pos[0]) || 50);
    setSlider('posY', parseFloat(pos[1]) || 50);
    setSlider('overlayOpacity', o.opacity);
    r('overlayColor').value = o.color || '#000000';
    r('blendMode').value    = o.blendMode || 'normal';
  }

  function setSlider(id, val) {
    var el = r(id); if (!el) return;
    el.value = val;
    var vEl = r(id + '-val'); if (vEl) vEl.textContent = Math.round(val * 100) / 100;
  }

  function readControls() {
    function fv(id) { return parseFloat(r(id).value); }
    return {
      filter: {
        brightness: fv('brightness'),
        contrast:   fv('contrast'),
        saturate:   fv('saturate'),
        grayscale:  fv('grayscale'),
        sepia:      fv('sepia'),
        hueRotate:  fv('hueRotate'),
        blur:       fv('blur')
      },
      opacity:       fv('opacity'),
      borderRadius:  fv('borderRadius'),
      transform: {
        scale:      fv('scale'),
        translateX: fv('translateX'),
        translateY: fv('translateY')
      },
      objectPosition: fv('posX') + '% ' + fv('posY') + '%',
      overlay: {
        opacity:   fv('overlayOpacity'),
        color:     r('overlayColor').value,
        blendMode: r('blendMode').value
      }
    };
  }

  /* ─── Select image ──────────────────────────────────────────────── */
  var _cachedImages = [];
  function selectImage(id) {
    _selected = id;
    document.getElementById('atp-placeholder').style.display = 'none';
    document.getElementById('atp-controls-inner').style.display = '';
    loadControls(getImgConfig(id));
    renderImgList(_cachedImages);
  }

  /* ─── Live preview ───────────────────────────────────────────────── */
  function livePreview() {
    if (!_selected) return;
    var cfg = readControls();
    setImgConfig(_selected, cfg);
    window.AmpImgApply.applyOne(_selected, cfg);
    /* update val labels */
    _panel.querySelectorAll('input[type=range]').forEach(function (el) {
      var vEl = document.getElementById(el.id + '-val');
      if (vEl) vEl.textContent = Math.round(parseFloat(el.value) * 100) / 100;
    });
  }

  /* ─── Save ──────────────────────────────────────────────────────── */
  function saveChanges() {
    try { localStorage.setItem(window.AmpImgApply.STORAGE_KEY, JSON.stringify(_config)); } catch (e) {}
    fetch('/api/image-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(_config)
    })
    .then(function (res) {
      var btn = document.getElementById('atp-save');
      btn.textContent = res.ok ? 'Sauvegardé ✓' : 'Erreur !';
      btn.style.background = res.ok ? '#15803d' : '#dc2626';
      setTimeout(function () { btn.textContent = 'Save Changes'; btn.style.background = ''; }, 2000);
    })
    .catch(function () {
      var btn = document.getElementById('atp-save');
      btn.textContent = 'Erreur réseau';
      btn.style.background = '#dc2626';
      setTimeout(function () { btn.textContent = 'Save Changes'; btn.style.background = ''; }, 2000);
    });
  }

  /* ─── Export JSON ─────────────────────────────────────────────── */
  function exportJSON() {
    var blob = new Blob([JSON.stringify(_config, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'image-settings.json';
    a.click();
  }

  /* ─── Toggle panel ────────────────────────────────────────────── */
  function togglePanel() {
    _open = !_open;
    _panel.style.display = _open ? 'flex' : 'none';
    if (_open) {
      _cachedImages = discoverImages();
      renderImgList(_cachedImages);
    }
  }

  /* ─── Wire events ─────────────────────────────────────────────── */
  function wireEvents() {
    document.getElementById('atp-close').addEventListener('click', function () {
      _open = false; _panel.style.display = 'none';
    });
    document.getElementById('atp-save').addEventListener('click', saveChanges);
    document.getElementById('atp-export').addEventListener('click', exportJSON);
    document.getElementById('atp-reset').addEventListener('click', function () {
      if (!_selected) return;
      var fresh = deepMerge(DEFAULTS, {});
      setImgConfig(_selected, fresh);
      loadControls(fresh);
      window.AmpImgApply.applyOne(_selected, fresh);
    });
    document.getElementById('atp-search').addEventListener('input', function () {
      renderImgList(_cachedImages, this.value.trim().toLowerCase());
    });
    _panel.querySelectorAll('input[type=range], input[type=color], select').forEach(function (el) {
      el.addEventListener('input', livePreview);
    });
  }

  /* ─── Init ───────────────────────────────────────────────────── */
  function init() {
    injectStyles();

    _fab = document.createElement('button');
    _fab.id = 'amp-tweak-fab';
    _fab.title = 'Image Tweaks';
    _fab.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    _fab.addEventListener('click', togglePanel);
    document.body.appendChild(_fab);

    _panel = buildPanel();
    _panel.style.display = 'none';
    document.body.appendChild(_panel);

    wireEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ─── Public API (for image-apply.js callback) ──────────────── */
  window.AmpTweak = {
    _onConfigLoad: function (data) {
      _config = data;
    }
  };
})();
