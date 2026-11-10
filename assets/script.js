/* Kitchenware Template theme — navigation, accordions, quantity, gallery */
(function () {
  "use strict";
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) toggle.addEventListener("click", function () { nav.classList.toggle("open"); });

  var searchBar = document.querySelector("[data-search-bar]");
  var openBtn = document.querySelector("[data-search-open]");
  var closeBtn = document.querySelector("[data-search-close]");
  if (openBtn && searchBar) openBtn.addEventListener("click", function () { searchBar.hidden = false; });
  if (closeBtn && searchBar) closeBtn.addEventListener("click", function () { searchBar.hidden = true; });

  document.querySelectorAll("[data-acc-head]").forEach(function (head) {
    head.addEventListener("click", function () {
      var body = head.nextElementSibling;
      if (body) body.hidden = !body.hidden;
    });
  });

  document.querySelectorAll("[data-qty]").forEach(function (wrap) {
    var input = wrap.querySelector("[data-qty-input]");
    if (!input) return;
    var minus = wrap.querySelector("[data-qty-minus]");
    var plus = wrap.querySelector("[data-qty-plus]");
    if (minus) minus.addEventListener("click", function () { input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1); });
    if (plus) plus.addEventListener("click", function () { input.value = (parseInt(input.value, 10) || 1) + 1; });
  });

  var mainImg = document.querySelector("[data-gallery-main]");
  document.querySelectorAll("[data-gallery-thumb]").forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      if (mainImg && thumb.dataset.full) mainImg.src = thumb.dataset.full;
      document.querySelectorAll("[data-gallery-thumb]").forEach(function (t) { t.classList.remove("is-active"); });
      thumb.classList.add("is-active");
    });
  });
})();

/* Dropdown tap-to-expand (mobile menu) */
(function () {
  document.querySelectorAll(".bs-drop-toggle").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 990px)").matches) {
        e.preventDefault();
        a.parentNode.classList.toggle("open");
      }
    });
  });
})();
