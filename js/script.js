/* =========================================================
   Brew Haven Coffee Shop — script.js
   Shared interface behaviour for every page (Part 3)
   Other scripts: menu.js (menu), forms.js (forms), map.js (map)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  setupMobileNav();
  highlightActiveNavLink();
  setupGalleryLightbox();
  setupBackToTop();
  setupRevealOnScroll();
  setupAccordions();
  setupOpenStatus();
});


/* ---------- 1. Mobile navigation toggle ---------- */
function setupMobileNav() {
  var header = document.querySelector(".site-header");
  var nav = document.querySelector(".site-nav");
  if (!header || !nav) return;

  var toggle = document.createElement("button");
  toggle.className = "nav-toggle";
  toggle.setAttribute("type", "button");
  toggle.setAttribute("aria-label", "Toggle navigation menu");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = "<span></span><span></span><span></span>";
  header.insertBefore(toggle, nav);

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("nav-open");
    toggle.classList.toggle("is-active", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("nav-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}


/* ---------- 2. Active nav link highlighting ---------- */
/* Compares the current file name with each link. The ".html" part is
   ignored so it also works on hosts that use "clean" URLs. */
function highlightActiveNavLink() {
  var links = document.querySelectorAll(".site-nav a");
  if (!links.length) return;

  function clean(name) {
    return name.replace(/\.html$/, "");
  }

  var current = clean(window.location.pathname.split("/").pop());
  if (current === "" || current === "index") current = "HomePage";

  links.forEach(function (link) {
    var isCurrent = clean(link.getAttribute("href")) === current;
    link.classList.toggle("active", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}


/* ---------- 3. Gallery lightbox ---------- */
function setupGalleryLightbox() {
  var images = document.querySelectorAll(".gallery-grid img");
  if (!images.length) return;

  var overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Enlarged gallery image");
  overlay.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close image">&times;</button>' +
    '<img class="lightbox-img" alt="">' +
    '<p class="lightbox-caption"></p>';
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector(".lightbox-img");
  var captionEl = overlay.querySelector(".lightbox-caption");
  var closeBtn = overlay.querySelector(".lightbox-close");
  var lastTrigger = null;

  function openLightbox(img) {
    var figure = img.closest("figure");
    var caption = figure ? figure.querySelector("figcaption") : null;
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt;
    captionEl.textContent = caption ? caption.textContent : img.alt;
    overlay.classList.add("is-visible");
    document.body.style.overflow = "hidden";
    lastTrigger = img;
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove("is-visible");
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  }

  images.forEach(function (img) {
    img.style.cursor = "zoom-in";
    img.setAttribute("tabindex", "0");
    img.addEventListener("click", function () { openLightbox(img); });
    img.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(img);
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) closeLightbox();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay.classList.contains("is-visible")) closeLightbox();
  });
}


/* ---------- 4. Back-to-top button ---------- */
function setupBackToTop() {
  var button = document.createElement("button");
  button.className = "back-to-top";
  button.setAttribute("type", "button");
  button.setAttribute("aria-label", "Back to top");
  button.textContent = "\u2191";
  document.body.appendChild(button);

  window.addEventListener("scroll", function () {
    button.classList.toggle("is-visible", window.scrollY > 400);
  });
  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


/* ---------- 5. Scroll reveal animation ---------- */
/* Sections fade and slide in as they enter the screen. Skipped when
   the visitor has asked their device to reduce motion. */
function setupRevealOnScroll() {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll("main section, .news-item").forEach(function (element) {
    element.classList.add("reveal");
    observer.observe(element);
  });
}


/* ---------- 6. Accordion (FAQ) ---------- */
/* One panel open at a time. Uses aria-expanded so screen readers
   announce the open/closed state. */
function setupAccordions() {
  document.querySelectorAll(".accordion").forEach(function (accordion) {
    var triggers = accordion.querySelectorAll(".accordion-trigger");

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var wasOpen = trigger.getAttribute("aria-expanded") === "true";

        triggers.forEach(function (other) {
          other.setAttribute("aria-expanded", "false");
          document.getElementById(other.getAttribute("aria-controls")).hidden = true;
        });

        if (!wasOpen) {
          trigger.setAttribute("aria-expanded", "true");
          document.getElementById(trigger.getAttribute("aria-controls")).hidden = false;
        }
      });
    });
  });
}


/* ---------- 7. "Open now" status ---------- */
/* Main shop hours, by day (0 = Sunday). Values are [opens, closes]
   in 24-hour decimal time, so 6.5 means 06:30. */
var SHOP_HOURS = {
  0: [8, 18],
  1: [6.5, 20], 2: [6.5, 20], 3: [6.5, 20], 4: [6.5, 20], 5: [6.5, 20],
  6: [7, 21]
};

function formatHour(decimal) {
  var hours = Math.floor(decimal);
  var minutes = Math.round((decimal - hours) * 60);
  return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
}

function setupOpenStatus() {
  var el = document.getElementById("open-status");
  if (!el) return;

  var now = new Date();
  var day = now.getDay();
  var hour = now.getHours() + now.getMinutes() / 60;
  var today = SHOP_HOURS[day];
  var isOpen = hour >= today[0] && hour < today[1];
  var text;

  if (isOpen) {
    text = "We are open now at the main shop until " + formatHour(today[1]) + ".";
  } else if (hour < today[0]) {
    text = "The main shop is closed right now. We open today at " + formatHour(today[0]) + ".";
  } else {
    text = "The main shop is closed right now. We open tomorrow at " + formatHour(SHOP_HOURS[(day + 1) % 7][0]) + ".";
  }

  el.textContent = text;
  el.classList.toggle("is-open", isOpen);
}
/* =========================================================
   Brew Haven Coffee Shop — menu.js
   Dynamic menu: loads items from JavaScript data, with category
   tabs, live search, sorting and a details pop-up (modal).
   ========================================================= */

var MENU_CATEGORIES = [
  "All", "Specialty coffee", "Cold beverages", "Tea selection",
  "Pastries & baked goods", "Light meals"
];

var MENU_ITEMS = [
  { id: 1, name: "Espresso", category: "Specialty coffee", price: 22, description: "A single, concentrated shot with a rich golden crema." },
  { id: 2, name: "Double Espresso", category: "Specialty coffee", price: 28, description: "Two shots of our house blend for a stronger kick." },
  { id: 3, name: "Cappuccino", category: "Specialty coffee", price: 32, description: "Espresso with steamed milk and thick foam, finished with chocolate dust." },
  { id: 4, name: "Latte", category: "Specialty coffee", price: 34, description: "Smooth espresso with plenty of silky steamed milk." },
  { id: 5, name: "Caramel Latte", category: "Specialty coffee", price: 38, description: "Our signature latte with caramel and latte art on top." },
  { id: 6, name: "Mocha", category: "Specialty coffee", price: 36, description: "Espresso, chocolate and steamed milk in one warm cup." },
  { id: 7, name: "Flat White", category: "Specialty coffee", price: 33, description: "A velvety, milk-forward espresso drink with a thin layer of foam." },
  { id: 8, name: "Americano", category: "Specialty coffee", price: 28, description: "Espresso topped up with hot water for a long, clean cup." },
  { id: 9, name: "Iced Americano", category: "Cold beverages", price: 30, description: "Chilled espresso poured over ice and water." },
  { id: 10, name: "Iced Latte", category: "Cold beverages", price: 35, description: "Espresso and cold milk over ice." },
  { id: 11, name: "Frappé", category: "Cold beverages", price: 40, description: "Blended iced coffee topped with cream." },
  { id: 12, name: "Fresh Juice", category: "Cold beverages", price: 25, description: "Freshly squeezed juice of the day." },
  { id: 13, name: "Rooibos Tea", category: "Tea selection", price: 20, description: "Caffeine-free South African red bush tea." },
  { id: 14, name: "Earl Grey", category: "Tea selection", price: 22, description: "Black tea scented with bergamot." },
  { id: 15, name: "Chamomile", category: "Tea selection", price: 20, description: "A calming, floral herbal infusion." },
  { id: 16, name: "Green Tea", category: "Tea selection", price: 22, description: "Light, fresh and gently grassy." },
  { id: 17, name: "Butter Croissant", category: "Pastries & baked goods", price: 22, description: "Flaky, buttery and baked fresh every morning." },
  { id: 18, name: "Blueberry Muffin", category: "Pastries & baked goods", price: 25, description: "Soft muffin packed with juicy blueberries." },
  { id: 19, name: "Chocolate Brownie", category: "Pastries & baked goods", price: 28, description: "Dense, fudgy chocolate brownie." },
  { id: 20, name: "Cinnamon Roll", category: "Pastries & baked goods", price: 26, description: "Warm roll swirled with cinnamon and a sweet glaze." },
  { id: 21, name: "Scone", category: "Pastries & baked goods", price: 20, description: "A classic scone, best enjoyed with jam and cream." },
  { id: 22, name: "Red Velvet Cake", category: "Pastries & baked goods", price: 35, description: "A slice of red velvet cake with cream cheese icing." },
  { id: 23, name: "Avocado Toast", category: "Light meals", price: 45, description: "Smashed avocado on toasted bread." },
  { id: 24, name: "Breakfast Wrap", category: "Light meals", price: 50, description: "A hearty wrap filled with breakfast favourites." },
  { id: 25, name: "Chicken Mayo Sandwich", category: "Light meals", price: 42, description: "Creamy chicken mayo on fresh bread." },
  { id: 26, name: "Granola Bowl", category: "Light meals", price: 38, description: "Crunchy granola served with yoghurt and fruit." }
];

document.addEventListener("DOMContentLoaded", function () {
  var resultsEl = document.getElementById("menu-results");
  if (!resultsEl) return;

  var tabsEl = document.getElementById("menu-tabs");
  var searchEl = document.getElementById("menu-search");
  var sortEl = document.getElementById("menu-sort");
  var countEl = document.getElementById("menu-count");
  var state = { category: "All", query: "", sort: "default" };

  var modal = buildModal();
  buildTabs();
  render();

  searchEl.addEventListener("input", function () {
    state.query = searchEl.value.trim().toLowerCase();
    render();
  });

  sortEl.addEventListener("change", function () {
    state.sort = sortEl.value;
    render();
  });


  /* ----- Category tabs (keyboard accessible) ----- */
  function buildTabs() {
    MENU_CATEGORIES.forEach(function (name, index) {
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "tab";
      tab.textContent = name;
      tab.dataset.category = name;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", index === 0 ? "true" : "false");
      tab.tabIndex = index === 0 ? 0 : -1;

      tab.addEventListener("click", function () { selectTab(tab); });
      tab.addEventListener("keydown", function (event) {
        var tabs = Array.prototype.slice.call(tabsEl.children);
        var i = tabs.indexOf(tab);
        var target = null;
        if (event.key === "ArrowRight") target = tabs[(i + 1) % tabs.length];
        if (event.key === "ArrowLeft") target = tabs[(i - 1 + tabs.length) % tabs.length];
        if (event.key === "Home") target = tabs[0];
        if (event.key === "End") target = tabs[tabs.length - 1];
        if (target) {
          event.preventDefault();
          target.focus();
          selectTab(target);
        }
      });

      tabsEl.appendChild(tab);
    });
  }

  function selectTab(selected) {
    Array.prototype.forEach.call(tabsEl.children, function (tab) {
      var isSelected = tab === selected;
      tab.setAttribute("aria-selected", isSelected ? "true" : "false");
      tab.tabIndex = isSelected ? 0 : -1;
    });
    state.category = selected.dataset.category;
    render();
  }


  /* ----- Filter + sort, then draw the cards ----- */
  function getVisibleItems() {
    var items = MENU_ITEMS.filter(function (item) {
      var inCategory = state.category === "All" || item.category === state.category;
      var text = (item.name + " " + item.category + " " + item.description).toLowerCase();
      return inCategory && text.indexOf(state.query) !== -1;
    });

    items.sort(function (a, b) {
      if (state.sort === "price-asc") return a.price - b.price;
      if (state.sort === "price-desc") return b.price - a.price;
      if (state.sort === "name") return a.name.localeCompare(b.name);
      return a.id - b.id;
    });
    return items;
  }

  function render() {
    var items = getVisibleItems();
    resultsEl.textContent = "";
    items.forEach(function (item) { resultsEl.appendChild(buildCard(item)); });

    if (items.length === 0) {
      countEl.textContent = "No items match \"" + searchEl.value.trim() + "\". Try a different word or category.";
    } else {
      countEl.textContent = "Showing " + items.length + " of " + MENU_ITEMS.length + " items";
    }
  }

  function buildCard(item) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "card menu-card";

    var category = document.createElement("span");
    category.className = "menu-category";
    category.textContent = item.category;

    var name = document.createElement("span");
    name.className = "menu-name";
    name.textContent = item.name;

    var price = document.createElement("span");
    price.className = "price";
    price.textContent = "R" + item.price;

    card.appendChild(category);
    card.appendChild(name);
    card.appendChild(price);
    card.addEventListener("click", function () { openModal(item, card); });
    return card;
  }


  /* ----- Details modal ----- */
  function buildModal() {
    var overlay = document.createElement("div");
    overlay.className = "modal";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "modal-title");
    overlay.innerHTML =
      '<div class="modal-box">' +
        '<button type="button" class="modal-close" aria-label="Close details">&times;</button>' +
        '<p class="menu-category" id="modal-category"></p>' +
        '<h2 id="modal-title"></h2>' +
        '<p id="modal-description"></p>' +
        '<p class="price" id="modal-price"></p>' +
        '<a class="btn" id="modal-enquire" href="enquiry.html">Enquire about this item</a>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.querySelector(".modal-close").addEventListener("click", closeModal);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) closeModal();
    });
    overlay.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeModal();
      if (event.key === "Tab") {
        /* keep keyboard focus inside the pop-up while it is open */
        var focusable = overlay.querySelectorAll("button, a[href]");
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    return overlay;
  }

  var lastTrigger = null;

  function openModal(item, trigger) {
    document.getElementById("modal-category").textContent = item.category;
    document.getElementById("modal-title").textContent = item.name;
    document.getElementById("modal-description").textContent = item.description;
    document.getElementById("modal-price").textContent = "R" + item.price;
    document.getElementById("modal-enquire").setAttribute(
      "href", "enquiry.html?item=" + encodeURIComponent(item.name)
    );
    lastTrigger = trigger;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  }
});
/* =========================================================
   Brew Haven Coffee Shop — forms.js
   Client-side validation, error messages, AJAX submission and
   email compilation for enquiry.html and contact-us.html
   ========================================================= */

/* ---------- Settings (change these in one place) ---------- */
/* The contact form builds an email to this address. Use an inbox you can check. */
var CONTACT_RECIPIENT = "rendzorikhotso16@gmail.com";

/* Real form service (Formspree). Create a free form at formspree.io and
   paste its address here, for example https://formspree.io/f/abcdwxyz
   Every enquiry is then emailed to the address you signed up with.
   See README.md, "Setting up the enquiry form". */
var AJAX_ENDPOINT = "https://formspree.io/f/mjyypdrb";

/* How long to wait for the server before giving up (milliseconds) */
var AJAX_TIMEOUT_MS = 10000;

/* Prices used for the enquiry estimate (in rand) */
var PRICING = {
  cateringPerPerson: 65,
  cateringMinGuests: 8,
  cateringNoticeDays: 3,
  eventBase: 1200,
  eventPerGuest: 40,
  eventWeekendFee: 300,
  eventNoticeDays: 7,
  subscriptionPerBag: 95
};

/* How the quantity and date fields change for each enquiry type */
var TYPE_CONFIG = {
  catering: {
    qtyLabel: "Number of guests", qtyShort: "The number of guests", qtyMin: 1, qtyMax: 200,
    qtyRequired: true, qtyHint: "A minimum of 8 guests is charged.",
    dateLabel: "Date needed", dateRequired: true
  },
  event: {
    qtyLabel: "Number of guests", qtyShort: "The number of guests", qtyMin: 1, qtyMax: 40,
    qtyRequired: true, qtyHint: "Our space holds up to 40 people.",
    dateLabel: "Event date", dateRequired: true
  },
  subscription: {
    qtyLabel: "Bags of beans per month (250 g each)", qtyShort: "The number of bags", qtyMin: 1, qtyMax: 10,
    qtyRequired: true, qtyHint: "Between 1 and 10 bags per month.",
    dateLabel: "Preferred first delivery date", dateRequired: true
  },
  general: {
    qtyLabel: "Quantity (optional)", qtyShort: "The quantity", qtyMin: 1, qtyMax: 100,
    qtyRequired: false, qtyHint: "",
    dateLabel: "Preferred date (optional)", dateRequired: false
  }
};

document.addEventListener("DOMContentLoaded", function () {
  var contactForm = document.getElementById("contact-form");
  var enquiryForm = document.getElementById("enquiry-form");
  if (contactForm) setupContactForm(contactForm);
  if (enquiryForm) setupEnquiryForm(enquiryForm);
});


/* =========================================================
   VALIDATION (shared by both forms)
   ========================================================= */

/* Returns an error message for one field, or "" when it is valid. */
function getError(field) {
  if (field.type === "checkbox") {
    return field.required && !field.checked ? "Please tick this box to continue." : "";
  }

  var value = field.value.trim();
  var label = field.getAttribute("data-label") || "This field";

  if (value === "") {
    if (!field.required) return "";
    return field.tagName === "SELECT" ? "Please choose an option." : label + " is required.";
  }

  var rule = field.getAttribute("data-validate");

  if (rule === "name" && !/^[\p{L}][\p{L}' -]{1,59}$/u.test(value)) {
    return "Please enter a valid name (letters only, 2 to 60 characters).";
  }

  if (rule === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    return "Please enter a valid email address, for example name@example.com.";
  }

  if (rule === "phone") {
    var digits = value.replace(/[\s-]/g, "");
    if (!/^(\+27|0)\d{9}$/.test(digits)) {
      return "Enter a South African number, for example 0634373969 or +27 11 123 4567.";
    }
  }

  if (rule === "date") {
    var chosen = new Date(value + "T00:00:00");
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var limit = new Date(today);
    limit.setFullYear(limit.getFullYear() + 1);

    if (isNaN(chosen.getTime())) return label + " is not a valid date.";
    if (chosen < today) return "Please choose today's date or a future date.";
    if (chosen > limit) return "Please choose a date within the next 12 months.";
  }

  if (rule === "number") {
    var n = Number(value);
    var min = Number(field.min);
    var max = Number(field.max);
    if (!Number.isInteger(n) || n < min || n > max) {
      return label + " must be a whole number from " + min + " to " + max + ".";
    }
  }

  var minLength = Number(field.getAttribute("minlength")) || 0;
  var maxLength = Number(field.getAttribute("maxlength")) || 0;
  if (minLength && value.length < minLength) {
    return label + " must be at least " + minLength + " characters.";
  }
  if (maxLength && value.length > maxLength) {
    return label + " must be " + maxLength + " characters or fewer.";
  }

  return "";
}

/* Shows or clears the message under a field (the message element
   always has the id "<field id>-error"). */
function setFieldState(field, message) {
  var errorEl = document.getElementById(field.id + "-error");
  field.classList.toggle("is-invalid", message !== "");
  field.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  if (errorEl) {
    errorEl.textContent = message;
    field.setAttribute("aria-describedby", message !== "" ? errorEl.id : "");
  }
}

function checkField(field) {
  var message = getError(field);
  setFieldState(field, message);
  return message === "";
}

function attachValidation(form) {
  form.querySelectorAll("input, select, textarea").forEach(function (field) {
    field.addEventListener("blur", function () { checkField(field); });
    field.addEventListener("change", function () { checkField(field); });
    field.addEventListener("input", function () {
      /* once a field has shown an error, re-check it as the user types */
      if (field.classList.contains("is-invalid")) checkField(field);
    });
  });
}

function validateForm(form) {
  var firstInvalid = null;
  form.querySelectorAll("input, select, textarea").forEach(function (field) {
    if (!checkField(field) && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) firstInvalid.focus();
  return firstInvalid === null;
}

/* Live "12 / 500" character counters */
function updateCounter(field) {
  var out = document.getElementById(field.getAttribute("data-counter"));
  if (out) out.textContent = field.value.length + " / " + field.maxLength;
}

function attachCounters(form) {
  form.querySelectorAll("[data-counter]").forEach(function (field) {
    updateCounter(field);
    field.addEventListener("input", function () { updateCounter(field); });
  });
}

/* A hidden "website" field that real people never fill in. If a bot
   fills it, the form is quietly ignored (basic spam protection). */
function isBot(form) {
  return form.elements.website && form.elements.website.value !== "";
}

function collect(form) {
  var data = {};
  new FormData(form).forEach(function (value, key) {
    if (key !== "website") data[key] = typeof value === "string" ? value.trim() : value;
  });
  return data;
}

/* ---------- Small helpers ---------- */
function pad(n) { return n < 10 ? "0" + n : String(n); }

function toISODate(date) {
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}

function formatDate(date) {
  return date.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatRand(amount) {
  return "R" + amount.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function el(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}


/* =========================================================
   CONTACT FORM: validate, then compile an email (mailto link)
   ========================================================= */
function setupContactForm(form) {
  var result = document.getElementById("contact-result");
  var after = document.getElementById("email-after");
  attachValidation(form);
  attachCounters(form);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (isBot(form) || !validateForm(form)) return;

    var data = collect(form);
    var typeText = form.elements.messagetype.selectedOptions[0].text;
    var subjectText =
    form.elements.subject.selectedOptions[0].text;
    var subject = "[" + typeText + "] " + subjectText;
    var body =
      "Name: " + data.fullname + "\n" +
      "Email: " + data.email + "\n" +
      "Phone: " + (data.phone || "Not provided") + "\n" +
      "Message type: " + typeText + "\n\n" +
      data.message;

    var mailto = "mailto:" + CONTACT_RECIPIENT +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body.replace(/\n/g, "\r\n"));

    document.getElementById("email-preview").textContent =
      "To: " + CONTACT_RECIPIENT + "\nSubject: " + subject + "\n\n" + body;
    document.getElementById("email-send").setAttribute("href", mailto);

    after.hidden = true;
    form.hidden = true;
    result.hidden = false;
    result.focus();
  });

  /* Edit: go back to the form with the answers still filled in */
  document.getElementById("email-edit").addEventListener("click", function () {
    after.hidden = true;
    result.hidden = true;
    form.hidden = false;
    form.elements.fullname.focus();
  });

  /* Once the visitor opens their email app, thank them and offer
     a way to write another message. (The link itself still opens
     the email app as normal.) */
  document.getElementById("email-send").addEventListener("click", function () {
    after.hidden = false;
  });

  /* Send another message: clear everything and show a blank form */
  document.getElementById("email-another").addEventListener("click", function () {
    form.reset();
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      setFieldState(field, "");
    });
    form.querySelectorAll("[data-counter]").forEach(updateCounter);
    after.hidden = true;
    result.hidden = true;
    form.hidden = false;
    form.elements.fullname.focus();
    if (form.scrollIntoView) form.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}


/* =========================================================
   ENQUIRY FORM: validate, send with AJAX (fetch), show a quote
   ========================================================= */
function setupEnquiryForm(form) {
  var status = document.getElementById("enquiry-status");
  var button = form.querySelector("button[type='submit']");

  form.elements.eventdate.min = toISODate(new Date());
  attachValidation(form);
  attachCounters(form);

  form.elements.enquirytype.addEventListener("change", function () { applyTypeConfig(form); });
  applyTypeConfig(form);
  prefillFromUrl(form);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (isBot(form) || !validateForm(form)) return;

    var data = collect(form);
    status.hidden = true;
    button.disabled = true;
    button.textContent = "Sending...";

    var quote = buildQuote(data);
    var reference = "BH-" + Date.now().toString(36).toUpperCase().slice(-6);

    /* The estimate is worked out on the visitor's own device, so it is
       shown straight away. The server only confirms the enquiry arrived. */
    showQuote(quote, "Sending your enquiry (reference " + reference + ")...");

    /* Stop with a clear message if the form service has not been set up yet */
    if (!isEndpointConfigured()) {
      console.error("forms.js: set AJAX_ENDPOINT to your Formspree form address (see README.md).");
      setReference("Your enquiry has not been sent yet.");
      status.textContent = "Sorry, enquiries cannot be sent right now. Please email us at " + CONTACT_RECIPIENT + " instead.";
      status.hidden = false;
      button.disabled = false;
      button.textContent = "Send enquiry";
      return;
    }

    /* Everything the business needs, including the estimate the visitor saw */
    var payload = Object.assign({}, data, {
      reference: reference,
      estimate: quoteToText(quote),
      _subject: "Brew Haven enquiry " + reference + ": " + quote.heading + " (" + data.fullname + ")"
    });

    /* AJAX with a time limit, so a slow server can never leave the
       button stuck on "Sending..." */
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, AJAX_TIMEOUT_MS);

    fetch(AJAX_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
      .then(function (response) {
        if (response.status === 429) throw new Error("rate-limit");
        if (!response.ok) throw new Error("Server responded with status " + response.status);
        return response.json();
      })
      .then(function () {
        setReference("Reference: " + reference + ". Your enquiry has been received.");
        form.reset();
        applyTypeConfig(form);
        form.querySelectorAll("[data-counter]").forEach(updateCounter);
      })
      .catch(function (error) {
        setReference("Your enquiry has not been sent yet.");
        status.textContent = error.message === "rate-limit"
          ? "We are receiving a lot of enquiries right now. Please wait a minute and try again."
          : "Sorry, we could not send your enquiry right now. Please check your internet connection and try again, or email us at " + CONTACT_RECIPIENT + ".";
        status.hidden = false;
      })
      .finally(function () {
        clearTimeout(timer);
        button.disabled = false;
        button.textContent = "Send enquiry";
      });
  });
}

/* Changes the labels, limits and required state of the date and
   quantity fields to suit the chosen enquiry type. */
function applyTypeConfig(form) {
  var chosen = form.elements.enquirytype.value;
  var cfg = TYPE_CONFIG[chosen] || TYPE_CONFIG.general;
  var qty = form.elements.quantity;
  var date = form.elements.eventdate;

  document.getElementById("quantity-label").textContent = cfg.qtyLabel;
  document.getElementById("eventdate-label").textContent = cfg.dateLabel;
  document.getElementById("quantity-hint").textContent = cfg.qtyHint;

  qty.min = cfg.qtyMin;
  qty.max = cfg.qtyMax;
  qty.setAttribute("data-label", cfg.qtyShort);
  qty.required = chosen !== "" && cfg.qtyRequired;
  date.required = chosen !== "" && cfg.dateRequired;

  setFieldState(qty, "");
  setFieldState(date, "");
}

/* products-services.html links here with ?item=Latte so the visitor
   does not have to type the item name again. */
function prefillFromUrl(form) {
  var item = new URLSearchParams(window.location.search).get("item");
  if (!item) return;

  form.elements.enquirytype.value = "general";
  applyTypeConfig(form);
  form.elements.details.value = ("I would like to know more about: " + item).slice(0, 300);
  form.elements.details.dispatchEvent(new Event("input"));
}

/* Works out the cost and availability for the enquiry */
function buildQuote(d) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var date = d.eventdate ? new Date(d.eventdate + "T00:00:00") : null;
  var qty = Number(d.quantity) || 0;
  var daysAhead = date ? Math.round((date - today) / 86400000) : 0;
  var dateText = date ? formatDate(date) : "";
  var quote = { heading: "", status: "ok", lines: [], totalLabel: "", total: null, message: "" };

  function earliest(minDays, skipSunday) {
    var d2 = new Date(today);
    d2.setDate(d2.getDate() + minDays);
    if (skipSunday && d2.getDay() === 0) d2.setDate(d2.getDate() + 1);
    return formatDate(d2);
  }

  if (d.enquirytype === "catering") {
    var billable = Math.max(qty, PRICING.cateringMinGuests);
    quote.heading = "Catering estimate";
    quote.lines.push(["Date needed", dateText]);
    quote.lines.push(["Guests", qty < PRICING.cateringMinGuests ? qty + " (charged as " + billable + ", our minimum)" : String(qty)]);
    quote.lines.push(["Rate", formatRand(PRICING.cateringPerPerson) + " per guest (coffee and pastry)"]);
    quote.totalLabel = "Estimated total";
    quote.total = billable * PRICING.cateringPerPerson;

    if (daysAhead < PRICING.cateringNoticeDays || date.getDay() === 0) {
      quote.status = "no";
      quote.message = "We need at least " + PRICING.cateringNoticeDays + " days' notice and cannot cater on Sundays. The earliest date we can offer is " + earliest(PRICING.cateringNoticeDays, true) + ".";
    } else {
      quote.message = "Good news, we can cater on that date. We will confirm the details by email within one business day.";
    }

  } else if (d.enquirytype === "event") {
    var weekend = date.getDay() === 0 || date.getDay() === 6;
    quote.heading = "Private event estimate";
    quote.lines.push(["Event date", dateText]);
    quote.lines.push(["Venue hire (after hours)", formatRand(PRICING.eventBase)]);
    quote.lines.push(["Guests", qty + " x " + formatRand(PRICING.eventPerGuest)]);
    if (weekend) quote.lines.push(["Weekend surcharge", formatRand(PRICING.eventWeekendFee)]);
    quote.totalLabel = "Estimated total";
    quote.total = PRICING.eventBase + qty * PRICING.eventPerGuest + (weekend ? PRICING.eventWeekendFee : 0);

    if (daysAhead < PRICING.eventNoticeDays) {
      quote.status = "no";
      quote.message = "Private events need at least " + PRICING.eventNoticeDays + " days' notice. The earliest date we can offer is " + earliest(PRICING.eventNoticeDays, false) + ".";
    } else {
      quote.message = "That date is open. We will hold it for you for 48 hours while we confirm by email.";
    }

  } else if (d.enquirytype === "subscription") {
    quote.heading = "Coffee subscription estimate";
    quote.lines.push(["Bags per month", qty + " x 250 g"]);
    quote.lines.push(["Price per bag", formatRand(PRICING.subscriptionPerBag)]);
    quote.lines.push(["First delivery", dateText]);
    quote.totalLabel = "Estimated cost per month";
    quote.total = qty * PRICING.subscriptionPerBag;
    quote.message = "Deliveries within Johannesburg start from your preferred date. We will confirm your delivery slot by email.";

  } else {
    quote.heading = "Thank you for your enquiry";
    quote.status = "info";
    quote.message = "No quote is needed for this question. Our team will reply by email within one business day.";
  }

  return quote;
}

function showQuote(quote, reference) {
  var panel = document.getElementById("enquiry-result");
  panel.textContent = "";
  panel.appendChild(el("h2", "", quote.heading));

  if (quote.status !== "info") {
    panel.appendChild(el("p", "badge " + (quote.status === "ok" ? "badge-ok" : "badge-no"),
      quote.status === "ok" ? "Available" : "Not available on that date"));
  }

  if (quote.lines.length) {
    var list = el("dl", "quote-list");
    quote.lines.forEach(function (line) {
      var row = el("div");
      row.appendChild(el("dt", "", line[0]));
      row.appendChild(el("dd", "", line[1]));
      list.appendChild(row);
    });
    panel.appendChild(list);
  }

  if (quote.total !== null) {
    panel.appendChild(el("p", "quote-total", quote.totalLabel + ": " + formatRand(quote.total)));
  }

  panel.appendChild(el("p", "", quote.message));
  var referenceLine = el("p", "hint", reference);
  referenceLine.id = "enquiry-reference";
  panel.appendChild(referenceLine);
  panel.appendChild(el("p", "hint", "Prices are estimates and may change when we confirm your booking."));

  panel.hidden = false;
  panel.focus();
  if (panel.scrollIntoView) panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Updates the small status line under the estimate */
function setReference(text) {
  var line = document.getElementById("enquiry-reference");
  if (line) line.textContent = text;
}

function isEndpointConfigured() {
  return AJAX_ENDPOINT.indexOf("rendzorikhotso16@gmail.com") === -1;
}

/* Plain-text copy of the estimate, sent along with the enquiry */
function quoteToText(quote) {
  var text = quote.heading + "\n";
  quote.lines.forEach(function (line) { text += line[0] + ": " + line[1] + "\n"; });
  if (quote.total !== null) text += quote.totalLabel + ": " + formatRand(quote.total) + "\n";
  if (quote.status === "no") text += "NOT AVAILABLE on the requested date. ";
  return text + quote.message;
}
/* =========================================================
   Brew Haven Coffee Shop — map.js
   Interactive map of both locations using Leaflet and
   OpenStreetMap (loaded on contact-us.html only).
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  var mapEl = document.getElementById("map");
  if (!mapEl) return;

  /* If the Leaflet library could not load, show a message instead */
  if (typeof L === "undefined") {
    mapEl.textContent = "The interactive map could not be loaded. Please use the addresses listed above.";
    mapEl.classList.add("map-fallback");
    return;
  }

  /* Approximate coordinates for the two Braamfontein locations */
  var shops = {
    main: { name: "Main Shop, Coffee Lane", address: "123 Coffee Lane, Braamfontein", coords: [-26.1929, 28.0346] },
    kiosk: { name: "Campus Kiosk, University Square", address: "Shop 12, University Square, 45 Jorissen Street", coords: [-26.1923, 28.0307] }
  };

  var map = L.map("map", { scrollWheelZoom: false }).setView([-26.1926, 28.0326], 16);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var markers = {};
  Object.keys(shops).forEach(function (key) {
    var shop = shops[key];
    var popup = document.createElement("div");
    var title = document.createElement("strong");
    title.textContent = shop.name;
    popup.appendChild(title);
    popup.appendChild(document.createElement("br"));
    popup.appendChild(document.createTextNode(shop.address));

    markers[key] = L.marker(shop.coords).addTo(map).bindPopup(popup);
  });

  /* The two buttons above the map fly to each location */
  document.querySelectorAll("[data-map-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      var key = button.getAttribute("data-map-target");
      map.flyTo(shops[key].coords, 17);
      markers[key].openPopup();
    });
  });

  /* Mouse-wheel zoom is only switched on after the map is clicked,
     so scrolling the page never gets "stuck" on the map. */
  map.on("click", function () { map.scrollWheelZoom.enable(); });
});