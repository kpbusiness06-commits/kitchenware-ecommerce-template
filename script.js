/* Kitchenware Store Template — front-end functionality
   Cart, search, filters, sorting, accordions, forms. No payment processing. */
(function () {
  "use strict";
  var CART_KEY = "kw-template-cart";

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartCount(items);
  }
  function cartItems() { return loadCart(); }
  function money(n) { return "$" + Number(n || 0).toFixed(2); }
  function updateCartCount(items) {
    items = items || cartItems();
    var count = items.reduce(function (s, i) { return s + i.qty; }, 0);
    document.querySelectorAll("[data-cart-count]").forEach(function (el) { el.textContent = count; });
  }

  /* Mobile navigation */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () { nav.classList.toggle("open"); });
  }

  /* Search bar */
  var searchBar = document.querySelector("[data-search-bar]");
  var openBtn = document.querySelector("[data-search-open]");
  var closeBtn = document.querySelector("[data-search-close]");
  if (openBtn && searchBar) openBtn.addEventListener("click", function () { searchBar.hidden = false; });
  if (closeBtn && searchBar) closeBtn.addEventListener("click", function () { searchBar.hidden = true; });
  var searchForm = document.querySelector("[data-search-form]");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = (document.querySelector("[data-search-input]").value || "").trim();
      if (document.querySelector("[data-shop-grid]")) {
        var shopSearch = document.querySelector("[data-shop-search]");
        if (shopSearch) { shopSearch.value = q; applyShopFilters(); }
      } else {
        window.location.href = "shop.html";
      }
    });
  }

  /* Shop filtering and sorting */
  function applyShopFilters() {
    var grid = document.querySelector("[data-shop-grid]");
    if (!grid) return;
    var checked = Array.prototype.map.call(
      document.querySelectorAll("[data-filter-category]:checked"),
      function (c) { return c.value; }
    );
    var q = ((document.querySelector("[data-shop-search]") || {}).value || "").toLowerCase();
    var visible = 0;
    grid.querySelectorAll("[data-card]").forEach(function (card) {
      var catOk = checked.length === 0 || checked.indexOf(card.dataset.category) !== -1;
      var qOk = q === "" || (card.dataset.name + " " + card.dataset.category).toLowerCase().indexOf(q) !== -1;
      var show = catOk && qOk;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });
    var none = document.querySelector("[data-no-results]");
    if (none) none.hidden = visible !== 0;
    var sort = (document.querySelector("[data-sort]") || {}).value || "featured";
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
    cards.sort(function (a, b) {
      if (sort === "name-asc") return a.dataset.name.localeCompare(b.dataset.name);
      if (sort === "name-desc") return b.dataset.name.localeCompare(a.dataset.name);
      if (sort === "price-asc") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sort === "price-desc") return Number(b.dataset.price) - Number(a.dataset.price);
      return 0;
    });
    cards.forEach(function (c) { grid.appendChild(c); });
  }
  document.querySelectorAll("[data-filter-category]").forEach(function (c) {
    c.addEventListener("change", applyShopFilters);
  });
  var sortSel = document.querySelector("[data-sort]");
  if (sortSel) sortSel.addEventListener("change", applyShopFilters);
  var shopSearch = document.querySelector("[data-shop-search]");
  if (shopSearch) shopSearch.addEventListener("input", applyShopFilters);
  var clearBtn = document.querySelector("[data-clear-filters]");
  if (clearBtn) clearBtn.addEventListener("click", function () {
    document.querySelectorAll("[data-filter-category]").forEach(function (c) { c.checked = false; });
    if (shopSearch) shopSearch.value = "";
    applyShopFilters();
  });

  /* Quantity selector (product page) */
  document.querySelectorAll("[data-qty]").forEach(function (wrap) {
    var input = wrap.querySelector("[data-qty-input]");
    wrap.querySelector("[data-qty-minus]").addEventListener("click", function () {
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    });
    wrap.querySelector("[data-qty-plus]").addEventListener("click", function () {
      input.value = (parseInt(input.value, 10) || 1) + 1;
    });
  });

  /* Add to cart */
  document.querySelectorAll("[data-add-to-cart]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var items = cartItems();
      var qtyInput = document.querySelector("[data-qty-input]");
      var qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
      var existing = items.filter(function (i) { return i.id === btn.dataset.id; })[0];
      if (existing) existing.qty += qty;
      else items.push({ id: btn.dataset.id, label: btn.dataset.label, price: 0, qty: qty });
      saveCart(items);
      btn.textContent = "Added";
      setTimeout(function () { btn.textContent = "Add to Cart"; }, 1200);
    });
  });

  /* Cart page */
  function renderCart() {
    var host = document.querySelector("[data-cart-lines]");
    if (!host) return;
    var items = cartItems();
    var empty = document.querySelector("[data-cart-empty]");
    var summary = document.querySelector("[data-cart-summary]");
    host.innerHTML = "";
    if (empty) empty.hidden = items.length !== 0;
    if (summary) summary.hidden = items.length === 0;
    var subtotal = 0;
    items.forEach(function (item, idx) {
      subtotal += item.price * item.qty;
      var row = document.createElement("div");
      row.className = "cart-line";
      row.innerHTML =
        '<div class="grow"><strong></strong><br><small class="placeholder-text">Price Placeholder</small></div>' +
        '<div class="qty"><button type="button" data-dec aria-label="Decrease">&minus;</button>' +
        '<input type="text" value="' + item.qty + '" aria-label="Quantity" readonly>' +
        '<button type="button" data-inc aria-label="Increase">+</button></div>' +
        '<button class="btn btn-ghost btn-sm" data-remove>Remove</button>';
      row.querySelector("strong").textContent = item.label;
      row.querySelector("[data-inc]").addEventListener("click", function () { item.qty++; saveCart(items); renderCart(); renderCheckout(); });
      row.querySelector("[data-dec]").addEventListener("click", function () { item.qty = Math.max(1, item.qty - 1); saveCart(items); renderCart(); renderCheckout(); });
      row.querySelector("[data-remove]").addEventListener("click", function () { items.splice(idx, 1); saveCart(items); renderCart(); renderCheckout(); });
      host.appendChild(row);
    });
    var sub = document.querySelector("[data-cart-subtotal]");
    if (sub) sub.textContent = money(subtotal);
  }

  /* Checkout summary */
  function renderCheckout() {
    var host = document.querySelector("[data-checkout-lines]");
    if (!host) return;
    var items = cartItems();
    host.innerHTML = "";
    var subtotal = 0;
    if (items.length === 0) {
      host.innerHTML = '<p class="placeholder-text">Cart is empty. Add a placeholder product from the Shop.</p>';
    }
    items.forEach(function (item) {
      subtotal += item.price * item.qty;
      var row = document.createElement("div");
      row.className = "summary-row";
      row.innerHTML = "<span></span><strong>" + money(item.price * item.qty) + "</strong>";
      row.querySelector("span").textContent = item.label + " x " + item.qty;
      host.appendChild(row);
    });
    var sub = document.querySelector("[data-checkout-subtotal]");
    if (sub) sub.textContent = money(subtotal);
  }

  /* Accordions */
  document.querySelectorAll("[data-acc-head]").forEach(function (head) {
    head.addEventListener("click", function () {
      var body = head.nextElementSibling;
      if (body) body.hidden = !body.hidden;
    });
  });

  /* Gallery thumbs */
  document.querySelectorAll(".gallery-thumbs .thumb").forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      document.querySelectorAll(".gallery-thumbs .thumb").forEach(function (t) { t.classList.remove("is-active"); });
      thumb.classList.add("is-active");
    });
  });

  /* Forms — front-end placeholders only */
  var newsletter = document.querySelector("[data-newsletter]");
  if (newsletter) newsletter.addEventListener("submit", function (e) {
    e.preventDefault();
    document.querySelector("[data-newsletter-note]").textContent =
      "Thank you (placeholder) — connect an email provider to make signup live.";
    newsletter.reset();
  });
  var contact = document.querySelector("[data-contact-form]");
  if (contact) contact.addEventListener("submit", function (e) {
    e.preventDefault();
    document.querySelector("[data-contact-note]").textContent =
      "Message noted (placeholder) — connect a form inbox to receive real messages.";
    contact.reset();
  });
  var checkout = document.querySelector("[data-checkout-form]");
  if (checkout) checkout.addEventListener("submit", function (e) {
    e.preventDefault();
    document.querySelector("[data-checkout-note]").textContent =
      "Payment is not integrated, so no order was placed. Connect a payment provider to go live.";
  });

  /* Footer year + init */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  updateCartCount();
  renderCart();
  renderCheckout();
})();
