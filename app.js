/* ============================================================
   TRAVEL Z — scroll & ritual engine (prototype)
   Spec: lerp ≈0.18 · fade falloff ^1.35 · ±26px drift ·
   26px reveals · 1px blend-difference progress line ·
   session-gated entry · reduced-motion fallbacks
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var LERP = 0.18, FALLOFF = 1.35, DRIFT = 26;

  /* ---------- asset resolver (single-point swap for hosted deploys) ---------- */
  var BASE = window.TZ_ASSET_BASE || "assets/";
  document.querySelectorAll("[data-asset]").forEach(function (el) {
    el.src = BASE + el.getAttribute("data-asset");
  });
  document.querySelectorAll("[data-poster]").forEach(function (el) {
    el.poster = BASE + el.getAttribute("data-poster");
  });

  /* ---------- progress line ---------- */
  var line = document.querySelector(".progress-line");
  function updateLine() {
    if (!line) return;
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? scrollY / max : 0;
    line.style.height = (p * 100) + "vh";
  }

  /* ---------- one-time reveals ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- scrub core ---------- */
  function makeScrub(video, track, beats, onProgress) {
    var target = 0, current = 0, duration = 0, primed = false;

    video.addEventListener("loadedmetadata", function () { duration = video.duration; });
    if (video.readyState >= 1) duration = video.duration;

    // iOS/Android need one play()+pause() inside a user gesture before seeking works
    function prime() {
      if (primed) return;
      primed = true;
      var p = video.play();
      if (p && p.then) p.then(function () { video.pause(); }).catch(function () {});
      else video.pause();
    }
    ["touchstart", "wheel", "keydown", "pointerdown"].forEach(function (ev) {
      addEventListener(ev, prime, { once: true, passive: true });
    });

    function progress() {
      var r = track.getBoundingClientRect();
      var total = r.height - innerHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -r.top / total));
    }

    function paintBeats(p) {
      beats.forEach(function (b) {
        var d = Math.abs(p - b.center) / b.spread;      // 0 at center → 1 at edge
        var o = Math.max(0, 1 - Math.pow(d, FALLOFF));  // spec falloff
        b.el.style.opacity = o;
        b.el.style.transform = "translateY(" + ((p - b.center) / b.spread) * -DRIFT + "px)";
      });
    }

    function frame() {
      var p = progress();
      target = p * (duration || 0);
      if (reduced) current = target;
      else current += (target - current) * LERP;
      if (duration && Math.abs(video.currentTime - current) > 0.033) {
        try { video.currentTime = current; } catch (e) {}
      }
      paintBeats(p);
      if (onProgress) onProgress(p);
      updateLine();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- INDEX PAGE ---------- */
  var stage = document.getElementById("stage");
  if (stage) {
    var loop = document.getElementById("vid-loop");
    var walk = document.getElementById("vid-walk");
    var chrome = document.querySelector(".chrome");
    var entered = false;

    function enter() {
      if (entered) return;
      entered = true;
      // prime walkthrough for seeking inside this gesture
      var p = walk.play();
      if (p && p.then) p.then(function () { walk.pause(); }).catch(function () {});
      stage.classList.add("entered");             // crossfade loop → walkthrough
      setTimeout(function () { loop.pause(); }, 450);
      document.body.classList.remove("locked");
      stage.setAttribute("aria-hidden", "false");
      announce("Unlocked. Scroll to continue the journey.");
    }

    // any tap / click / key unlocks (mobile + desktop), pill included
    function onAnyInput(e) {
      if (entered) return;
      if (e.type === "keydown" && (e.metaKey || e.ctrlKey || e.altKey)) return;
      enter();
    }
    stage.addEventListener("pointerdown", onAnyInput);
    addEventListener("keydown", onAnyInput);
    var pill = document.getElementById("enter-pill");
    if (pill) pill.addEventListener("click", function (e) { e.stopPropagation(); enter(); });

    // DECIDED (v0.6.1): the ritual runs on EVERY plain load/refresh.
    // Skipped only for anchored navigation (e.g. #experiences from the
    // Bali back-link) and for reduced-motion users.
    var skip = location.hash !== "";
    if (skip || reduced) {
      entered = true;
      stage.classList.add("entered");
      document.body.classList.remove("locked");
      loop.pause();
    } else {
      document.body.classList.add("locked");
      loop.play().catch(function () {});
    }

    // chrome stays light over the film, flips dark once the light section arrives
    var after = document.querySelector(".after-film");
    var cue = buildScrollCue(document.getElementById("walk-track"));
    cue.el.classList.add("hidden");            // hidden during the lock ritual
    makeScrub(walk, document.getElementById("walk-track"),
      [{ el: document.getElementById("beat-world"), center: 0.55, spread: 0.28 }],
      function (p) {
        var overLight = after && after.getBoundingClientRect().top < 70;
        chrome.classList.toggle("on-media", !overLight && p < 0.9);
        document.body.classList.toggle("over-light", overLight);
        cue.el.classList.toggle("hidden", !entered);
        cue.update(p);
      });
  }

  /* ---------- BALI PAGE ---------- */
  var bali = document.getElementById("vid-bali");
  if (bali) {
    var chrome2 = document.querySelector(".chrome");
    /* Chapter timing spec (v0.6 — measured shot cuts, do NOT redistribute):
       film 22.1667 s scrubbed across #bali-track
       Ch1 ACCOMMODATION  0.000 → 7.917 s  = progress 0.000–0.357, center 0.179, spread 0.205
       Ch2 ACTIVITIES     7.917 → 15.167 s = progress 0.357–0.684, center 0.521, spread 0.188
       Ch3 MINDSET       15.167 → 22.167 s = progress 0.684–1.000, center 0.842, spread 0.182
       opacity = max(0, 1 − (|p − center| / spread)^1.35)
       spread = (half chapter duration / 22.1667) × 1.15  (1.15 → slight crossfade at cuts)
       Timestamps valid ONLY for this exact bali.mp4 — re-measure after any re-cut. */
    var D = 22.166667, CUT1 = 7.916667, CUT2 = 15.166667;
    function c(t0, t1) { return ((t0 + t1) / 2) / D; }
    function s(t0, t1) { return ((t1 - t0) / 2) / D * 1.15; }

    /* right-edge chapter timeline */
    document.body.classList.add("has-timeline");
    var tlFill = document.querySelector(".tl-fill");
    var tlItems = Array.prototype.slice.call(document.querySelectorAll(".tl-item"));
    var trackEl = document.getElementById("bali-track");
    var B1 = CUT1 / D, B2 = CUT2 / D; // chapter boundaries in progress: 0.357 / 0.684
    tlItems.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var total = trackEl.offsetHeight - innerHeight;
        var y = trackEl.offsetTop + parseFloat(btn.getAttribute("data-p")) * total;
        scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
      });
    });

    // v0.6.2: center chapter overlays removed — chapters live on the
    // right-edge timeline only. Beats array is empty; the cut boundaries
    // below still drive the timeline's active state.
    var cueB = buildScrollCue(document.getElementById("bali-track"));
    makeScrub(bali, document.getElementById("bali-track"), [], function (p) {
      cueB.update(p);
      if (tlFill) tlFill.style.height = (p * 100) + "%";
      var idx = p < B1 ? 0 : (p < B2 ? 1 : 2);
      tlItems.forEach(function (btn, i) {
        btn.classList.toggle("active", i === idx);
        if (i === idx) btn.setAttribute("aria-current", "true");
        else btn.removeAttribute("aria-current");
      });
      var after = document.querySelector(".after-film");
      var overLight = after && after.getBoundingClientRect().top < 70;
      chrome2.classList.toggle("on-media", !overLight);
      document.body.classList.toggle("over-light", overLight);
    });
  }

  /* ---------- meeting scheduler (demo) ---------- */
  var panelMeeting = document.getElementById("panel-meeting");
  if (panelMeeting) {
    var tabM = document.getElementById("tab-meeting");
    var tabC = document.getElementById("tab-contact");
    var panelContact = document.getElementById("panel-contact");
    var dateInput = document.getElementById("meet-date");
    var dateLabel = document.getElementById("meet-date-label");
    var slotList = document.getElementById("slot-list");
    var calBtn = document.getElementById("cal-btn");
    var HOSTS = ["Concierge Sofia", "Concierge Marek", "Concierge Elena", "Concierge Tomas"];
    var BASES = [9 * 60, 11 * 60 + 30, 14 * 60, 16 * 60 + 30]; // 4 slots per day

    function setTab(meeting) {
      tabM.classList.toggle("active", meeting);
      tabC.classList.toggle("active", !meeting);
      tabM.setAttribute("aria-selected", meeting);
      tabC.setAttribute("aria-selected", !meeting);
      panelMeeting.hidden = !meeting;
      panelContact.hidden = meeting;
    }
    tabM.addEventListener("click", function () { setTab(true); });
    tabC.addEventListener("click", function () { setTab(false); });

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function fmtDate(d) {
      return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    }
    function seed(d) { // deterministic per-date variation
      var s = d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate(), x = 0;
      for (var i = 0; i < 5; i++) x = (x * 31 + s) % 97;
      return x;
    }
    function icsFor(d, mins) {
      var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, mins);
      var end = new Date(start.getTime() + 30 * 60000);
      function st(t) {
        return t.getFullYear() + pad(t.getMonth() + 1) + pad(t.getDate()) +
               "T" + pad(t.getHours()) + pad(t.getMinutes()) + "00";
      }
      return "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//TRAVEL Z//Demo//EN\r\n" +
             "BEGIN:VEVENT\r\nUID:tz-demo-" + st(start) + "@travelz.example\r\n" +
             "DTSTAMP:" + st(new Date()) + "\r\nDTSTART:" + st(start) + "\r\nDTEND:" + st(end) + "\r\n" +
             "SUMMARY:TRAVEL Z — Private proposal call (demo)\r\n" +
             "DESCRIPTION:Demo booking from the TRAVEL Z prototype. No real meeting is scheduled.\r\n" +
             "END:VEVENT\r\nEND:VCALENDAR\r\n";
    }
    function renderSlots(d) {
      dateLabel.textContent = fmtDate(d);
      var sd = seed(d);
      var rot = sd % HOSTS.length;             // rotate hosts per date
      slotList.innerHTML = "";
      BASES.forEach(function (base, i) {
        var mins = base + ((sd + i * 13) % 5) * 15;   // per-slot shift, per date
        var t = pad(Math.floor(mins / 60)) + ":" + pad(mins % 60);
        var row = document.createElement("div");
        row.className = "slot";
        row.innerHTML = '<span class="time">' + t + '</span>' +
          '<span class="info utility">Private video call · 20 min · ' + HOSTS[(i + rot) % HOSTS.length] + '</span>';
        var btn = document.createElement("button");
        btn.className = "add"; btn.textContent = "Add to calendar";
        btn.addEventListener("click", function () {
          var blob = new Blob([icsFor(d, mins)], { type: "text/calendar" });
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "travelz-meeting-demo.ics";
          document.body.appendChild(a); a.click(); a.remove();
          btn.classList.add("added"); btn.textContent = "Added ✓"; btn.disabled = true;
          announce("Demo calendar file downloaded for " + fmtDate(d) + " at " + t);
        });
        row.appendChild(btn);
        slotList.appendChild(row);
      });
    }

    var today = new Date();
    var current = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    dateInput.min = today.toISOString().slice(0, 10);
    dateInput.value = current.toISOString().slice(0, 10);
    renderSlots(current);

    calBtn.addEventListener("click", function () {
      if (dateInput.showPicker) { try { dateInput.showPicker(); return; } catch (e) {} }
      dateInput.style.pointerEvents = "auto"; dateInput.focus(); dateInput.click();
    });
    dateInput.addEventListener("change", function () {
      if (!dateInput.value) return;
      var parts = dateInput.value.split("-");
      current = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      renderSlots(current);
    });
  }

  /* ---------- scroll cue: half-circle of short lines, eroding as you scroll ---------- */
  function buildScrollCue(trackEl) {
    var NS = "http://www.w3.org/2000/svg";
    var N = 21, R = 68, LEN = 10, CX = 100, CY = 12;
    var wrap = document.createElement("div");
    wrap.className = "scroll-cue";
    wrap.setAttribute("aria-hidden", "true");
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 200 100");
    var ticks = [], mid = (N - 1) / 2;
    for (var i = 0; i < N; i++) {
      var a = (10 + 160 * i / (N - 1)) * Math.PI / 180;   // 10°→170°, arc opening downward
      var ln = document.createElementNS(NS, "line");
      ln.setAttribute("x1", (CX + R * Math.cos(a)).toFixed(2));
      ln.setAttribute("y1", (CY + R * Math.sin(a)).toFixed(2));
      ln.setAttribute("x2", (CX + (R + LEN) * Math.cos(a)).toFixed(2));
      ln.setAttribute("y2", (CY + (R + LEN) * Math.sin(a)).toFixed(2));
      ln.style.animationDelay = (Math.abs(i - mid) * 110) + "ms";
      svg.appendChild(ln);
      var d = Math.abs(i - mid) / mid;                     // 0 centre → 1 ends
      // erosion measured in scrolled PIXELS so it reads the same on a
      // 3-viewport film and a 10-viewport one: ends go at ~200px,
      // centre at ~580px, each over a 140px fade.
      ticks.push({ el: ln, px: 200 + (1 - d) * 380 });
    }
    wrap.appendChild(svg);
    document.body.appendChild(wrap);
    return {
      el: wrap,
      update: function (p) {
        var total = trackEl ? trackEl.offsetHeight - innerHeight : 1000;
        var scrolled = p * total;
        for (var i = 0; i < ticks.length; i++) {
          var o = (ticks[i].px - scrolled) / 140;
          ticks[i].el.style.opacity = o < 0 ? 0 : (o > 1 ? 1 : o);
        }
      }
    };
  }

  /* ---------- form (mock submit) ---------- */
  var form = document.getElementById("proposal-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("input[required]").forEach(function (inp) {
        var bad = !inp.checkValidity();
        inp.closest(".field").classList.toggle("invalid", bad);
        inp.setAttribute("aria-invalid", bad ? "true" : "false");
        if (bad) ok = false;
      });
      if (!ok) return;
      // prototype: no backend — payload logged for CRM wiring (roadmap step 9)
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      console.log("TRAVEL Z proposal request:", data);
      form.classList.add("sent");
      announce("Received. We reply within 24 hours.");
    });
  }

  /* ---------- a11y live region ---------- */
  var live = document.createElement("div");
  live.setAttribute("aria-live", "polite");
  live.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)";
  document.body.appendChild(live);
  function announce(msg) { live.textContent = msg; }

  addEventListener("scroll", updateLine, { passive: true });
  updateLine();
})();
