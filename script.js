(function () {
  "use strict";

  var EMAIL = "okonkwochibuike80@gmail.com";

  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* Mobile menu */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");

  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* Copy buttons */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        var original = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = original; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      }
    });
  });

  /* Contact form: no backend on GitHub Pages, so build a mailto: link */
  var form = document.getElementById("contact-form");
  var error = document.getElementById("cf-error");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var from = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();

      if (!name || !from || !message || from.indexOf("@") < 1) {
        if (error) error.hidden = false;
        return;
      }
      if (error) error.hidden = true;

      var subject = "Portfolio enquiry from " + name;
      var body = message + "\n\n" + name + "\n" + from;
      window.location.href =
        "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }
})();

/* ---------- Load and scroll animations (Motion) ----------
   Only transform and opacity are animated, so it stays on the GPU and never shifts layout.
   Selectors here must match the hidden-state list in styles.css. */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root.classList.contains("will-animate")) return; // reduced motion, or no IntersectionObserver

  var M = window.MotionLite;
  if (!M || !M.animate || !M.inView) {
    root.classList.remove("will-animate"); // helper missing: just show everything
    return;
  }
  window.__motionStarted = true;

  var EASE = [0.22, 1, 0.36, 1]; // fast start, long soft landing
  var RISE = "translateY(28px)";
  var POP = "translateY(24px) scale(0.97)";

  // Fade and move one element into place. The optional delay is a timer, so the element
  // stays hidden until it starts, then .is-revealed and the animation begin in the same tick.
  function reveal(el, o) {
    if (el.__revealed) return;
    el.__revealed = true;
    o = o || {};
    var run = function () {
      el.classList.add("is-revealed");
      M.animate(
        el,
        { opacity: [0, 1], transform: [o.from || RISE, "none"] },
        { duration: o.duration || 0.8, ease: EASE }
      );
    };
    if (o.delay) setTimeout(run, o.delay * 1000);
    else run();
  }

  function columnsOf(el) {
    var cs = getComputedStyle(el.parentElement);
    return cs.display === "grid" ? Math.max(1, cs.gridTemplateColumns.split(" ").length) : 1;
  }

  function indexOf(el) {
    return Array.prototype.indexOf.call(el.parentElement.children, el);
  }

  // Intro card: plays once on load, as a short timed sequence
  var HERO = [
    { sel: ".intro", delay: 0.05, from: "translateY(24px) scale(0.99)", duration: 0.9 },
    { sel: ".status", delay: 0.25, from: "translateY(14px)" },
    { sel: ".intro h1", delay: 0.33 },
    { sel: ".intro__sub", delay: 0.42, from: "translateY(18px)" },
    { sel: ".intro__role", delay: 0.5, step: 0.07, from: "translateY(18px)" },
    { sel: ".intro__visual", delay: 0.4, from: "scale(0.9)", duration: 1 },
    { sel: ".social li", delay: 0.7, step: 0.08, from: "translateY(14px)" },
    { sel: ".rule", delay: 0.95, from: "translateY(0)" }
  ];

  // Section headings: play as each one scrolls into view
  var HEADS = [
    { sel: ".section .divider", delay: 0, from: "translateX(-40px)", duration: 0.9 },
    { sel: ".section .eyebrow", delay: 0.05, from: "translateY(14px)" },
    { sel: ".section .section-title", delay: 0.1, from: "translateY(20px)" },
    { sel: ".section .section-lede", delay: 0.16, from: "translateY(18px)" }
  ];

  // Section content: each item plays as it scrolls into view. "index" and "column" add a
  // small stagger so items entering together cascade instead of appearing at once.
  var GROUPS = [
    { sel: ".about__text > *", mode: "index", step: 0.09, from: "translateY(20px)" },
    { sel: ".stats > li", mode: "index", step: 0.1, from: POP },
    { sel: ".skills > .skill", mode: "column", step: 0.08, from: POP },
    { sel: ".works > .work", mode: "none" },
    { sel: ".timeline > .role", mode: "none", from: "translateY(24px)" },
    { sel: ".grid-2 > .role", mode: "column", step: 0.1, from: POP },
    { sel: ".contact__list > li", mode: "index", step: 0.08, from: POP },
    { sel: ".contact__form", mode: "none", delay: 0.12, from: POP }
  ];

  function playHero() {
    HERO.forEach(function (h) {
      document.querySelectorAll(h.sel).forEach(function (el, i) {
        reveal(el, { delay: h.delay + i * (h.step || 0), from: h.from, duration: h.duration });
      });
    });
  }

  function watch(list) {
    list.forEach(function (g) {
      var els = document.querySelectorAll(g.sel);
      if (!els.length) return;
      // Fires once per element, when it is 8% of the screen inside the bottom edge
      M.inView(
        els,
        function (el) {
          var delay = g.delay || 0;
          if (g.mode === "index") delay += Math.min(indexOf(el), 4) * g.step;
          else if (g.mode === "column") delay += (indexOf(el) % columnsOf(el)) * g.step;
          reveal(el, { delay: delay, from: g.from, duration: g.duration });
        },
        { margin: "0px 0px -8% 0px" }
      );
    });
  }

  function start() {
    playHero();
    watch(HEADS);
    watch(GROUPS);
  }

  // Wait briefly for web fonts so text does not reflow mid-animation (capped at 0.8s)
  var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([
    fonts,
    new Promise(function (resolve) { setTimeout(resolve, 800); })
  ]).then(start, start);
})();
