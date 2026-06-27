/**
 * Placeholder Image Generator
 * Generates SVG data URI placeholders for missing images.
 * Detects image type from filename/path and applies appropriate styling.
 */
(function () {
  'use strict';

  var COLORS = {
    logo: '#000000',
    banner: '#6cb130',
    general: '#2e5b5f'
  };

  function classifyImage(src, alt) {
    var s = (src + ' ' + (alt || '')).toLowerCase();
    if (s.indexOf('logo') !== -1 || s.indexOf('aisin') !== -1 || s.indexOf('isin') !== -1) {
      return 'logo';
    }
    if (s.indexOf('banner') !== -1 || s.indexOf('hero') !== -1 || s.indexOf('main') !== -1 || s.indexOf('mv') !== -1 || s.indexOf('slide') !== -1 || s.indexOf('keyvisual') !== -1) {
      return 'banner';
    }
    return 'general';
  }

  function getLabel(img) {
    if (img.alt && img.alt.trim()) {
      return img.alt.trim();
    }
    var src = img.getAttribute('src') || '';
    var filename = src.split('/').pop().split('?')[0];
    if (filename) {
      return filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
    }
    return 'image';
  }

  function makePlaceholder(img) {
    var type = classifyImage(img.getAttribute('src') || '', img.alt);
    var bgColor = COLORS[type];
    var label = getLabel(img);

    // Determine dimensions
    var w = img.width || img.naturalWidth || parseInt(img.getAttribute('width'), 10) || 300;
    var h = img.height || img.naturalHeight || parseInt(img.getAttribute('height'), 10) || 200;

    // For very small or zero dimensions, use sensible defaults
    if (w < 10) w = 300;
    if (h < 10) h = 200;

    // Calculate font size relative to image dimensions
    var fontSize = Math.max(10, Math.min(w / label.length * 1.2, h * 0.25, 24));

    // Truncate label if too long
    var displayLabel = label.length > 40 ? label.substring(0, 37) + '...' : label;

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">'
      + '<rect width="100%" height="100%" fill="' + bgColor + '"/>'
      + '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" '
      + 'fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="' + fontSize + 'px" font-weight="400">'
      + escapeXml(displayLabel)
      + '</text>'
      + '</svg>';

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function escapeXml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function attachHandler(img) {
    if (img.dataset.placeholderHandled) return;
    img.dataset.placeholderHandled = 'true';

    img.addEventListener('error', function () {
      if (!this.dataset.placeholderApplied) {
        this.dataset.placeholderApplied = 'true';
        this.src = makePlaceholder(this);
      }
    });

    // If image already failed before script loaded
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
      if (!img.dataset.placeholderApplied) {
        img.dataset.placeholderApplied = 'true';
        img.src = makePlaceholder(img);
      }
    }
  }

  function init() {
    var images = document.querySelectorAll('img');
    for (var i = 0; i < images.length; i++) {
      attachHandler(images[i]);
    }

    // Observe dynamically added images
    if (typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeName === 'IMG') {
              attachHandler(node);
            }
            if (node.querySelectorAll) {
              var imgs = node.querySelectorAll('img');
              for (var i = 0; i < imgs.length; i++) {
                attachHandler(imgs[i]);
              }
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
