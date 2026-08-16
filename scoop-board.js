/* ==========================================================================
   Homepage Scoop Case renderer + owner Scoop Board
   ========================================================================== */
(function () {
  "use strict";
  if (!window.Pintfield) return;
  var P = window.Pintfield;

  function tubHTML(flavor, extraClass) {
    if (!flavor) return "";
    var ink = flavor.ink || "#2a160f";
    return (
      '<div class="tub ' + (extraClass || "") + '" style="background:' + flavor.color + ";color:" + ink + '">' +
        '<span class="swirl" aria-hidden="true"></span>' +
        "<strong>" + flavor.name + "</strong>" +
      "</div>"
    );
  }

  function renderPublicCase() {
    var host = document.getElementById("todays-case");
    if (!host) return;
    var board = P.getBoard();
    var pub = board.published;
    var dateEl = document.getElementById("case-date");
    var noteEl = document.getElementById("case-note");
    var featEl = document.getElementById("featured-scoop");
    if (dateEl) dateEl.textContent = P.formatPretty(pub.date);
    if (noteEl) noteEl.textContent = pub.note || "Fresh churn. Walk up and pick a swirl.";
    var featured = P.byId(pub.featured);
    if (featEl && featured) {
      featEl.innerHTML =
        '<div class="featured-scoop" style="background:' + featured.color + '"></div>' +
        "<div><em class=\"mono\" style=\"color:var(--strawberry);font-style:normal;\">Scoop of the day</em>" +
        "<h3 style=\"margin:.15rem 0 0;font-size:1.35rem;\">" + featured.name + "</h3></div>";
    }
    host.innerHTML = P.hydrate(pub.regular).map(function (f) { return tubHTML(f); }).join("");

    var df = document.getElementById("df-case");
    var nsa = document.getElementById("nsa-case");
    if (df) df.innerHTML = P.hydrate(pub.dairyFree).map(function (f) { return tubHTML(f); }).join("");
    if (nsa) nsa.innerHTML = P.hydrate(pub.nsa).map(function (f) { return tubHTML(f); }).join("");

    var next = (board.schedule || []).slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; })[0];
    var nextEl = document.getElementById("next-drop");
    if (nextEl) {
      if (next) {
        var nf = P.byId(next.featured);
        nextEl.textContent = "Next scheduled drop: " + P.formatPretty(next.date) +
          (nf ? " · featured " + nf.name : "");
      } else {
        nextEl.textContent = "No future drop scheduled — the owner can queue one from the Scoop Board.";
      }
    }

    var marquee = document.getElementById("flavor-marquee");
    if (marquee) {
      var names = P.hydrate(pub.regular).map(function (f) { return f.name; }).join("  ·  ");
      marquee.innerHTML = "<span>" + names + "  ·  " + names + "</span><span>" + names + "  ·  " + names + "</span>";
    }
  }

  function renderFlavorLibrary() {
    var host = document.getElementById("flavor-library");
    if (!host) return;
    var filter = host.getAttribute("data-filter") || "all";
    function paint(tag) {
      var list = P.LIBRARY.filter(function (f) {
        if (tag === "all") return true;
        return f.tags.indexOf(tag) !== -1;
      });
      host.innerHTML = list.map(function (f) {
        return tubHTML(f) + "";
      }).join("");
    }
    paint(filter);
    document.querySelectorAll("[data-flavor-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("[data-flavor-filter]").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        paint(btn.getAttribute("data-flavor-filter"));
      });
    });
  }

  /* -------- Owner board -------- */
  function initOwnerBoard() {
    var gate = document.getElementById("board-lock");
    var app = document.getElementById("board-app");
    if (!gate || !app) return;

    var unlocked = sessionStorage.getItem("pintfield-board") === "open";
    function showApp() {
      gate.hidden = true;
      app.hidden = false;
      drawBoard();
    }
    if (unlocked) showApp();

    var pinForm = document.getElementById("pin-form");
    if (pinForm) {
      pinForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var val = (document.getElementById("pin-input") || {}).value || "";
        var err = document.getElementById("pin-err");
        if (val.trim() === P.PIN) {
          sessionStorage.setItem("pintfield-board", "open");
          showApp();
        } else if (err) {
          err.textContent = "Nope — demo PIN is the Gettysburg zip: 17325";
        }
      });
    }

    var draft = P.cloneLineup(P.getBoard().published);
    var selectedSlot = { group: "regular", index: 0 };

    function drawPalette() {
      var pal = document.getElementById("flavor-palette");
      if (!pal) return;
      pal.innerHTML = P.LIBRARY.map(function (f) {
        return '<button type="button" class="chip" data-add="' + f.id + '" style="background:' + f.color + ';color:' + f.ink + '">' + f.name + "</button>";
      }).join("");
      pal.querySelectorAll("[data-add]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-add");
          var group = selectedSlot.group;
          var arr = draft[group];
          if (!arr) return;
          arr[selectedSlot.index] = id;
          if (group === "regular") selectedSlot.index = Math.min(arr.length - 1, selectedSlot.index + 1);
          drawSlots();
        });
      });
    }

    function drawSlots() {
      function fill(id, group, max) {
        var el = document.getElementById(id);
        if (!el) return;
        var arr = draft[group] || [];
        var html = "";
        for (var i = 0; i < max; i++) {
          var flavor = P.byId(arr[i]);
          var active = selectedSlot.group === group && selectedSlot.index === i ? " style=\"outline:3px solid #5b4dff\"" : "";
          if (flavor) {
            html += '<button type="button" class="slot filled" data-g="' + group + '" data-i="' + i + '"' + active +
              ' style="background:' + flavor.color + ";color:" + flavor.ink + '">' + flavor.name + "</button>";
          } else {
            html += '<button type="button" class="slot" data-g="' + group + '" data-i="' + i + '"' + active + ">empty</button>";
          }
        }
        el.innerHTML = html;
        el.querySelectorAll(".slot").forEach(function (slot) {
          slot.addEventListener("click", function () {
            selectedSlot = { group: slot.getAttribute("data-g"), index: Number(slot.getAttribute("data-i")) };
            drawSlots();
          });
        });
      }
      fill("slots-regular", "regular", 32);
      fill("slots-df", "dairyFree", 4);
      fill("slots-nsa", "nsa", 4);

      var feat = document.getElementById("featured-select");
      if (feat && feat.options.length === 0) {
        P.LIBRARY.forEach(function (f) {
          var o = document.createElement("option");
          o.value = f.id; o.textContent = f.name;
          feat.appendChild(o);
        });
      }
      if (feat) feat.value = draft.featured;
      var note = document.getElementById("lineup-note");
      if (note) note.value = draft.note || "";
      var date = document.getElementById("lineup-date");
      if (date && !date.value) date.value = P.todayISO();
    }

    function readFields() {
      var feat = document.getElementById("featured-select");
      var note = document.getElementById("lineup-note");
      if (feat) draft.featured = feat.value;
      if (note) draft.note = note.value;
    }

    function drawSchedule() {
      var list = document.getElementById("schedule-list");
      if (!list) return;
      var board = P.getBoard();
      if (!board.schedule.length) {
        list.innerHTML = "<li>Nothing queued. Schedule a lineup for a future morning.</li>";
        return;
      }
      list.innerHTML = board.schedule.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).map(function (item, idx) {
        var f = P.byId(item.featured);
        return "<li><div><strong>" + P.formatPretty(item.date) + "</strong><div style=\"font-size:.88rem;color:var(--muted)\">" +
          (f ? f.name : "No featured") + " · " + (item.note || "") + "</div></div>" +
          '<button type="button" class="btn" data-del="' + item.date + '">Remove</button></li>';
      }).join("");
      list.querySelectorAll("[data-del]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var data = P.getBoard();
          data.schedule = data.schedule.filter(function (s) { return s.date !== btn.getAttribute("data-del"); });
          P.saveRaw(data);
          drawSchedule();
        });
      });
    }

    function drawBoard() {
      draft = P.cloneLineup(P.getBoard().published);
      drawPalette();
      drawSlots();
      drawSchedule();
    }

    var publishBtn = document.getElementById("publish-now");
    if (publishBtn) {
      publishBtn.addEventListener("click", function () {
        readFields();
        var data = P.getBoard();
        draft.date = P.todayISO();
        data.published = P.cloneLineup(draft);
        P.saveRaw(data);
        var status = document.getElementById("board-status");
        if (status) status.textContent = "Published to the homepage — today's case is live in this browser.";
      });
    }

    var schedBtn = document.getElementById("schedule-btn");
    if (schedBtn) {
      schedBtn.addEventListener("click", function () {
        readFields();
        var dateEl = document.getElementById("lineup-date");
        var date = dateEl ? dateEl.value : "";
        if (!date) return;
        var data = P.getBoard();
        var next = P.cloneLineup(draft);
        next.date = date;
        data.schedule = (data.schedule || []).filter(function (s) { return s.date !== date; });
        data.schedule.push(next);
        P.saveRaw(data);
        var status = document.getElementById("board-status");
        if (status) {
          status.textContent = date <= P.todayISO()
            ? "That date is today or past — it will apply as soon as the homepage loads."
            : "Queued for " + P.formatPretty(date) + ". The homepage will flip automatically that morning.";
        }
        drawSchedule();
      });
    }

    var resetBtn = document.getElementById("reset-board");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        P.saveRaw(P.emptyBoard());
        var status = document.getElementById("board-status");
        if (status) status.textContent = "Demo board reset to the starter lineup.";
        drawBoard();
      });
    }

    var feat = document.getElementById("featured-select");
    if (feat) feat.addEventListener("change", readFields);
    var note = document.getElementById("lineup-note");
    if (note) note.addEventListener("input", readFields);
  }

  renderPublicCase();
  renderFlavorLibrary();
  initOwnerBoard();
})();
