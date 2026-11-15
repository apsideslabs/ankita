/* Mobile-first header: a burger that opens the navigation below 900px. */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var inner = header.querySelector('.inner');
  var nav = header.querySelector('.nav');
  var cta = header.querySelector('.header-cta');
  if (!inner || !nav) return;

  var btn = document.createElement('button');
  btn.className = 'burger';
  btn.setAttribute('aria-label', 'Open menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  inner.appendChild(btn);

  var panel = document.createElement('div');
  panel.className = 'mobile-menu';
  panel.id = 'mobile-menu';
  panel.innerHTML = nav.innerHTML + (cta ? '<div class="mm-cta">' + cta.innerHTML + '</div>' : '');
  header.appendChild(panel);

  btn.addEventListener('click', function () {
    var open = header.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  panel.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      header.classList.remove('menu-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
