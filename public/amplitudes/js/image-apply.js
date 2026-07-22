/* AMPLITUDES — image-apply.js
   Rendering-only. Reads image-settings.json and applies CSS adjustments.
   Independent of image-tweak.js — safe to keep after removing the panel. */
(function () {
  var STORAGE_KEY = 'amp_img_v1';
  var CONFIG_URL  = '/amplitudes/image-settings.json';

  function css(el, prop, val) {
    if (val !== null && val !== undefined) el.style[prop] = val;
  }

  function buildFilter(f) {
    if (!f) return '';
    var parts = [];
    if (f.brightness  !== undefined) parts.push('brightness('  + f.brightness  + ')');
    if (f.contrast    !== undefined) parts.push('contrast('    + f.contrast    + ')');
    if (f.saturate    !== undefined) parts.push('saturate('    + f.saturate    + ')');
    if (f.grayscale   !== undefined) parts.push('grayscale('   + f.grayscale   + '%)');
    if (f.sepia       !== undefined) parts.push('sepia('       + f.sepia       + ')');
    if (f.hueRotate   !== undefined) parts.push('hue-rotate('  + f.hueRotate   + 'deg)');
    if (f.blur        !== undefined) parts.push('blur('        + f.blur        + 'px)');
    return parts.join(' ');
  }

  function buildTransform(t) {
    if (!t) return '';
    var parts = [];
    if (t.scale      !== undefined) parts.push('scale('      + t.scale      + ')');
    if (t.translateX !== undefined) parts.push('translateX(' + t.translateX + '%)');
    if (t.translateY !== undefined) parts.push('translateY(' + t.translateY + '%)');
    return parts.join(' ');
  }

  function applyOne(id, config) {
    var sel = config.selector || ('[data-img-id="' + id + '"]');
    var els = document.querySelectorAll(sel);
    els.forEach(function (el) {
      var filter = buildFilter(config.filter);
      if (filter) css(el, 'filter', filter);

      if (config.opacity !== undefined) css(el, 'opacity', config.opacity);
      if (config.borderRadius !== undefined) css(el, 'borderRadius', config.borderRadius + 'px');

      var transform = buildTransform(config.transform);
      if (transform) css(el, 'transform', transform);

      if (config.objectPosition) css(el, 'objectPosition', config.objectPosition);

      /* Overlay */
      if (config.overlay && config.overlay.opacity > 0) {
        var parent = el.parentElement;
        if (parent) {
          var ov = parent.querySelector('[data-amp-ov="' + id + '"]');
          if (!ov) {
            ov = document.createElement('div');
            ov.setAttribute('data-amp-ov', id);
            ov.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1';
            if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
            parent.appendChild(ov);
          }
          ov.style.backgroundColor = config.overlay.color || '#000';
          ov.style.opacity         = config.overlay.opacity;
          ov.style.mixBlendMode    = config.overlay.blendMode || 'normal';
        }
      }
    });
  }

  function applyAll(settings) {
    if (!settings || !settings.images) return;
    Object.keys(settings.images).forEach(function (id) {
      applyOne(id, settings.images[id]);
    });
  }

  /* Apply from localStorage immediately (no flash) */
  try {
    var cached = localStorage.getItem(STORAGE_KEY);
    if (cached) applyAll(JSON.parse(cached));
  } catch (e) {}

  /* Fetch authoritative JSON — merge and re-apply */
  fetch(CONFIG_URL)
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data) return;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
      applyAll(data);
      if (window.AmpTweak) window.AmpTweak._onConfigLoad(data);
    })
    .catch(function () {});

  /* Public API — used by image-tweak.js for live preview */
  window.AmpImgApply = {
    apply: applyAll,
    applyOne: applyOne,
    STORAGE_KEY: STORAGE_KEY,
    CONFIG_URL: CONFIG_URL
  };
})();
