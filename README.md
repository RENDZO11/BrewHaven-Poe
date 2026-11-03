# Brew Haven Coffee Shop

A multi-page website for **Brew Haven**, a fictional coffee shop in Braamfontein, Johannesburg.
Built for WEDE5020 (Web Development). Student: St10510131.

**Live website:** _add your Netlify or GitHub Pages link here_

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `HomePage.html` | Welcome, specials, open-now status |
| About | `about-us.html` | Mission, vision, audience, FAQ accordion |
| Products and Services | `products-services.html` | Searchable, sortable menu and services |
| Gallery | `gallery.html` | Photos with a lightbox |
| News and Updates | `news-updates.html` | Announcements |
| Enquiry | `enquiry.html` | Cost and availability estimate (AJAX form) |
| Contact Us | `contact-us.html` | Locations, hours, map, email form |

`index.html` simply forwards visitors to `HomePage.html`, because hosting platforms open `index.html` first.

## Folder structure

```
brew-haven/
├── HomePage.html, about-us.html, products-services.html,
│   gallery.html, news-updates.html, enquiry.html, contact-us.html
├── index.html          (redirects to HomePage.html)
├── css/style.css
├── js/script.js        (shared interface features)
├── js/menu.js          (dynamic menu, tabs, search, modal)
├── js/forms.js         (validation, AJAX, email)
├── js/map.js           (Leaflet map)
├── Images/             (descriptive file names)
├── robots.txt, sitemap.xml, _headers
└── README.md
```

## Part 3: what was added

### 1. Functionality (JavaScript)

| Requirement | Where it is |
|---|---|
| Accordion | FAQ on `about-us.html` (`setupAccordions` in `script.js`) |
| Tabs | Menu category tabs on `products-services.html` (`menu.js`) |
| Modal | Menu item details pop-up (`menu.js`) |
| Interactive map | Leaflet + OpenStreetMap on `contact-us.html` (`map.js`) |
| Animations and transitions | Scroll-reveal fade-in, accordion and modal animations, hover effects (CSS + `setupRevealOnScroll`) |
| Advanced DOM manipulation | Menu cards, tabs, modal, lightbox, quote results and the "open now" badge are all created and updated with JavaScript |
| Gallery lightbox | `gallery.html` (`setupGalleryLightbox`) |
| Dynamic content | The whole menu is loaded from a JavaScript array (`MENU_ITEMS`) and drawn on the page |
| Search, filter and sort | Live search box, category tabs and sort drop-down on the menu |

Other improvements: mobile hamburger menu, back-to-top button, keyboard support for tabs, modal and lightbox, and `prefers-reduced-motion` support.

### 2. Search Engine Optimisation (SEO)

**Keyword research** (focus keyword for each page):

| Page | Focus keywords |
|---|---|
| Home | coffee shop Braamfontein, fresh coffee Johannesburg |
| About | community coffee shop, student coffee shop |
| Products and Services | coffee menu, coffee catering Johannesburg |
| Gallery | coffee shop gallery, latte art |
| News and Updates | coffee shop news, latte art workshop |
| Enquiry | coffee catering, private event venue Braamfontein, coffee subscription |
| Contact Us | coffee shop Braamfontein contact, opening hours |

**On-page SEO**

- Unique `<title>` and `<meta name="description">` on every page, plus Open Graph tags.
- One `<h1>` per page, with `<h2>` and `<h3>` used in order.
- Descriptive image file names (for example `caramel-latte.jpg`) and descriptive `alt` text.
- Clean internal linking: the main navigation, a footer link, and links inside page text (for example Home to Menu and Enquiry).
- Mobile-friendly: responsive layout, viewport tag, breakpoints at 1024px and 600px.
- Local SEO: `lang="en-ZA"` and LocalBusiness structured data (JSON-LD) with address, phone and opening hours on the home page.

**Off-page SEO (plan)**

- Backlinks: ask the university's student societies and local blogs to link to the website; list Brew Haven in local business directories.
- Social media: share the news posts on Instagram, Facebook and X (footer links are placeholders to replace with the real profiles).
- Local SEO: claim a Google Business Profile for the main shop and campus kiosk, and ask customers for reviews.

**Additional requests**

- `robots.txt`: allows all pages and points to the sitemap.
- `sitemap.xml`: lists all seven pages with priorities.
- Page speed: scripts use `defer`, below-the-fold images use `loading="lazy"`, the first image uses `fetchpriority="high"`, there are no large libraries (only Leaflet, on one page), and a pre-sized layout limits layout shift.
- Security: see below.

### 3. Forms

| | `enquiry.html` | `contact-us.html` |
|---|---|---|
| Purpose | Ask about catering, events, subscriptions or the menu | Send a general message |
| After validation | Shows an estimated **cost and availability** straight away and sends the enquiry to the business inbox with AJAX (`fetch` to Formspree) | Compiles an **email** and lets the visitor send it to the recipient set in the code |
| Recipient | n/a | `rendzorikhotso16@gmail.com` (`CONTACT_RECIPIENT` in `forms.js`) |

### Setting up the enquiry form (Formspree)

The enquiry form sends real emails through [Formspree](https://formspree.io), a free form service.

1. Create a free Formspree account with an email address you check.
2. Click **New Form**, name it "Brew Haven enquiries" and copy its address, which looks like `https://formspree.io/f/abcdwxyz`.
3. Open `js/forms.js` and replace `https://formspree.io/f/YOUR_FORM_ID` in `AJAX_ENDPOINT` with that address.
4. Change `CONTACT_RECIPIENT` in the same file to an inbox you can check (the contact form builds its email to this address).
5. Deploy, send a test enquiry from the live website and confirm the email arrives. Formspree may ask you to confirm your email address on the first submission.

Each enquiry email contains the visitor's details, a reference number and the estimate they were shown. Visitors can reply directly to the sender. The free plan allows 50 submissions a month and 20 per minute; if the limit is reached, the form shows a "please try again" message.

**Validation (JavaScript, with HTML5 attributes as a backup)**

- Required fields, name format, email format.
- South African phone numbers (`0634373969` or `+27 11 123 4567`).
- Dates cannot be in the past or more than 12 months ahead.
- Character limits with live counters; number ranges (for example a maximum of 40 guests for private events).
- Error messages appear under each field and the first error receives focus.
- AJAX errors (for example no internet) show a friendly message.

### 4. Security

- All user text is written to the page with `textContent`, never `innerHTML`, which prevents script injection.
- Hidden "honeypot" field to catch spam bots.
- External links use `rel="noopener noreferrer"`; the Leaflet files use Subresource Integrity (SRI).
- `_headers` adds a Content Security Policy, `X-Frame-Options`, `X-Content-Type-Options` and a referrer policy (applies on Netlify). HTTPS is provided by the hosting platform.

## Running and deploying

1. Open `HomePage.html` in a browser (or use the VS Code "Live Server" extension).
2. Commit and push:
   ```
   git add .
   git commit -m "Part 3: JavaScript, SEO, forms and README"
   git push
   ```
3. **GitHub Pages:** repository Settings, Pages, deploy from the `main` branch (root).
   **Netlify:** "Add new site", "Import from Git", choose the repository.
4. Replace `YOUR-USERNAME.github.io/brew-haven` in `robots.txt` and `sitemap.xml` with the live address.

## Changelog

### Part 3: 2 November 2026

**New**

- Added `enquiry.html` with a validated, AJAX-powered enquiry form that returns an estimated cost and availability.
- Added `js/script.js`, `js/menu.js`, `js/forms.js` and `js/map.js`.
- Added an FAQ accordion (About), category tabs and a details modal (Products), and an interactive Leaflet map (Contact).
- Menu is now dynamic, with live search, category filter and sorting.
- Added scroll-reveal animations, an "open now" badge and a skip-to-content link.
- Added `robots.txt`, `sitemap.xml`, `_headers` and `index.html`.
- Added unique titles, meta descriptions, Open Graph tags and JSON-LD structured data.
- Added "Enquiry" to the main navigation and social/sitemap links to the footer.

**Changed**

- Contact form rebuilt with JavaScript validation, character counters and an email-compiling step.
- Contact form: after the visitor opens their email app, a thank-you note and a "Send another message" button appear, which clears the form for a new message.
- Images renamed to descriptive file names and `alt` text improved.
- Below-the-fold images now lazy-load; scripts load with `defer`.
- Updated `css/style.css` with Part 3 components.
- Enquiry form now sends real enquiries to the business inbox through Formspree (the demo service was removed), with a reference number and the estimate included in the email.
- Enquiry form shows the estimate immediately and gives up on a slow server after 10 seconds (`AbortController`), so the button never stays stuck on "Sending...".

### Feedback from Part 2 (edits made)

| Feedback received | Change made | File(s) |
|---|---|---|
| _Paste the lecturer's comment here_ | _Describe exactly what was changed_ | _file name_ |
| _Paste the lecturer's comment here_ | _Describe exactly what was changed_ | _file name_ |

### Earlier parts

- **Part 2:** external stylesheet in `css/`, custom properties, Flexbox/Grid layouts, hover and focus states, responsive breakpoints.
- **Part 1:** six-page semantic HTML structure and project proposal.

## References

Formspree (n.d.) *Formspree help centre*. Available at: https://help.formspree.io/ (Accessed: 2 November 2026).

Google (n.d.) *SEO starter guide*. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 2 November 2026).

Leaflet (n.d.) *Leaflet quick start guide*. Available at: https://leafletjs.com/examples/quick-start/ (Accessed: 2 November 2026).

MDN Web Docs (n.d.) *Fetch API*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API (Accessed: 2 November 2026).

MDN Web Docs (n.d.) *Intersection Observer API*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (Accessed: 2 November 2026).

OpenStreetMap Foundation (n.d.) *Tile usage policy*. Available at: https://operations.osmfoundation.org/policies/tiles/ (Accessed: 2 November 2026).

Schema.org (n.d.) *CafeOrCoffeeShop*. Available at: https://schema.org/CafeOrCoffeeShop (Accessed: 2 November 2026).

Sitemaps.org (n.d.) *Sitemaps XML format*. Available at: https://www.sitemaps.org/protocol.html (Accessed: 2 November 2026).

W3C (2023) *Web Content Accessibility Guidelines (WCAG) 2.2*. Available at: https://www.w3.org/TR/WCAG22/ (Accessed: 2 November 2026).