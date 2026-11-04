# Kitchenware Ecommerce Website Template

A reusable, placeholder-only storefront template for a premium kitchenware store.
No business name, products, prices, or brand content are included — every content
slot is a clearly labeled placeholder for you to complete.

## Pages

- `index.html` — Homepage: header/nav, hero, categories, promo banner, featured
  products, featured collections, reviews, newsletter, footer
- `shop.html` — Product grid with category filters, sorting, and search
- `product.html` — Gallery, variations, quantity selector, add to cart,
  specifications, shipping/returns accordions, related products
- `about.html`, `contact.html`, `faq.html` — Info pages (contact form is front-end only)
- `shipping-policy.html`, `returns-policy.html`, `privacy-policy.html`, `terms.html` — Policy pages
- `cart.html` — Cart with quantity adjustments (saved in the browser)
- `checkout.html` — Checkout layout. **Payment is NOT integrated** — connect a
  payment provider before accepting real orders; nothing is charged.

## Files

- `styles.css` — the design system. Retheme everything from the variables at the top.
- `script.js` — navigation, mobile menu, search, shop filters/sorting, cart logic.

## Customize

1. Replace the LOGO and Brand Name placeholders in each page header.
2. Replace placeholder products in `shop.html` / `index.html` with real products
   (update `data-price`, `data-category`, and names so filters, sorting, and cart work).
3. Paste your real policy text into the policy pages.
4. Connect a real checkout/payment provider and an email provider for the
   newsletter and contact forms.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Publish on GitHub Pages

Push this folder as a repository, then in GitHub: Settings → Pages →
Deploy from a branch → `main` / root.

## Use as a Shopify theme

This repo also carries a full Shopify Online Store 2.0 theme built from the
same design (the static HTML pages stay at the root for reference; Shopify
reads only the theme folders):

- `layout/theme.liquid` — the theme shell (header + footer sections)
- `config/` — theme settings schema and data
- `locales/en.default.json`
- `assets/` — `styles.css` (the same design system) and `script.js`
- `sections/` — header, footer, hero, featured collection, promo banner,
  reviews placeholder, newsletter, and the main product / collection / cart /
  page / search / 404 sections. Product, collection, cart, search, and the
  newsletter form run on real Shopify data and forms.
- `snippets/product-card.liquid`
- `templates/` — JSON templates for index, product, collection, cart, page,
  search, and 404

Connect it in Shopify: Online Store → Themes → Add theme → Connect from
GitHub → this repository → `main`. It installs as an **unpublished** theme;
your live theme is untouched until you choose to publish.
