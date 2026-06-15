/* ===========================================================
   AD LUXURY REALTY — site script
   - Splash/preloader screen on load
   - Sticky header background on scroll
   - Mobile nav toggle
   - Reveal-on-scroll animations
   - Footer year
   - Netlify-friendly form submission (AJAX, no page reload)
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* --- Preloader / splash screen --- */
  const preloader = document.getElementById("preloader");
  const minDisplay = 1300; // ms — keep the splash visible at least this long
  const startTime = Date.now();

  const hidePreloader = () => {
    const elapsed = Date.now() - startTime;
    const wait = Math.max(0, minDisplay - elapsed);
    setTimeout(() => {
      preloader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
      setTimeout(() => preloader.remove(), 700);
    }, wait);
  };

  if (document.readyState === "complete") {
    hidePreloader();
  } else {
    window.addEventListener("load", hidePreloader);
  }

  /* --- Sticky header --- */
  const header = document.getElementById("site-header");
  const onScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- Mobile nav toggle --- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  const headerCta = document.querySelector(".header-cta");

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.classList.toggle("open");
    mainNav.classList.toggle("open", isOpen);
    headerCta.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    header.classList.toggle("scrolled", isOpen || window.scrollY > 24);
  });

  // Close mobile nav after tapping a link
  document.querySelectorAll(".main-nav a, .header-cta").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      mainNav.classList.remove("open");
      headerCta.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* --- Reveal on scroll --- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* --- Footer year --- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --- Contact form: submit to Netlify Forms via fetch --- */
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      })
        .then(() => {
          note.textContent = "Thanks — we've received your message and will be in touch shortly.";
          form.reset();
        })
        .catch(() => {
          note.textContent = "Something went wrong. Please email hello@adluxuryrealty.com directly.";
        });
    });
  }
});
