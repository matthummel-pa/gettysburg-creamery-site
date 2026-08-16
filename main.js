/* ==========================================================================
   Pintfield Creamery — global behaviors
   ========================================================================== */
(function () {
  "use strict";

  var hamburger = document.getElementById("hamburger");
  var mainNav = document.getElementById("main-nav");
  if (hamburger && mainNav) {
    hamburger.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mainNav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var badge = document.getElementById("concept-badge");
  if (badge) {
    badge.addEventListener("click", function (e) { e.preventDefault(); });
  }

  /* Sprinkle extras in the hero */
  var sprinkleHost = document.querySelector("[data-sprinkles]");
  if (sprinkleHost && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var colors = ["#ff3d7f", "#19c98a", "#ffe14a", "#5b4dff", "#ff9f43"];
    for (var i = 0; i < 14; i++) {
      var s = document.createElement("span");
      s.className = "sprinkle-float";
      s.style.left = (6 + Math.random() * 88) + "%";
      s.style.top = (-10 - Math.random() * 40) + "px";
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = (Math.random() * 5) + "s";
      s.style.animationDuration = (5 + Math.random() * 5) + "s";
      s.style.transform = "rotate(" + (Math.random() * 180) + "deg)";
      sprinkleHost.appendChild(s);
    }
  }

  /* Netlify-friendly AJAX forms with native POST fallback */
  document.querySelectorAll("form[data-ajax]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var data = new FormData(form);
      var encoded = new URLSearchParams(data).toString();
      var hasFile = Array.prototype.some.call(form.querySelectorAll('input[type="file"]'), function (input) {
        return input.files && input.files.length;
      });

      var opts = hasFile
        ? { method: "POST", body: data }
        : {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encoded
          };

      fetch("/", opts)
        .then(function (res) {
          if (!res.ok) throw new Error("not ok");
          if (status) {
            status.className = "form-status ok";
            status.textContent = form.getAttribute("data-success") || "Sent. We'll scoop you a reply.";
          }
          form.reset();
        })
        .catch(function () {
          /* Local / GitHub Pages: show the concept success state */
          if (status) {
            status.className = "form-status ok";
            status.textContent = form.getAttribute("data-success") || "Got it (demo). On the live site this lands in the owner's inbox.";
          }
          form.reset();
        });
    });
  });
})();
