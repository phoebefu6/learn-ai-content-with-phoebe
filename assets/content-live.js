/* content-live.js - the one-idea-to-many-formats simulator (learn-ai-content-with-phoebe).
   Reusable "watch the number climb" pattern (finance/marketing/brand/leadership-live family).
   Deterministic, offline, no dependencies. Renders into #content-live.

   Teaching idea: one core idea is repurposed to four platforms. Toggling the levers (platform
   audience, format rules, brand voice, native hook, real specifics) turns four identical
   copy-pasted posts into four platform-native pieces - and a scorecard shows how many
   platforms come out native. The "model" is a scripted teaching simulation; the lesson (one
   idea, tailored per platform, beats the same post pasted everywhere) is real. */
(function () {
  var host = document.getElementById("content-live");
  if (!host) return;

  var LEVERS = [
    { id: "audience", label: "Set the platform audience", hint: "who is actually there", pts: 28 },
    { id: "format",   label: "Apply the format rules",    hint: "length + structure",     pts: 22 },
    { id: "voice",    label: "Keep the brand voice",      hint: "on brand, not generic",  pts: 15 },
    { id: "hook",     label: "Write a native hook",       hint: "a real opener + CTA",    pts: 15 },
    { id: "specifics",label: "Add real specifics",        hint: "concrete, anti-slop",    pts: 10 }
  ];

  var state = { audience: false, format: false, voice: false, hook: false, specifics: false, mode: "live" };

  function score() {
    var s = 10;
    LEVERS.forEach(function (l) { if (state[l.id]) s += l.pts; });
    return Math.min(100, s);
  }

  /* four platforms; each is "native" only with the levers it truly needs */
  var PLATFORMS = [
    { key: "li", name: "LinkedIn",   need: ["audience", "format", "voice"],
      native: "The hidden cost of back-to-back calls is not time - it is the decisions you lose in the scramble between them. Here is how we stopped losing them.",
      why: "audience + format + voice" },
    { key: "x", name: "X / Twitter", need: ["audience", "format", "hook"],
      native: "you don't have a memory problem. you have a back-to-back-meetings problem. a thread on fixing it ↓",
      why: "audience + format + hook" },
    { key: "ig", name: "Instagram",  need: ["audience", "hook", "specifics"],
      native: "POV: you walked out of every meeting today fully present - and the notes, decisions, and action items were already written.",
      why: "audience + hook + specifics" },
    { key: "nl", name: "Newsletter", need: ["audience", "voice", "specifics"],
      native: "This week: why we stopped taking meeting notes by hand, the one thing that changed, and the 3-step setup you can copy.",
      why: "audience + voice + specifics" }
  ];
  function platOk(p) { return p.need.every(function (k) { return state[k]; }); }
  function nativeCount() { return PLATFORMS.filter(platOk).length; }

  var GENERIC = "Check out Cadence - it writes your meeting notes automatically! Try it today.";

  host.innerHTML =
    '<div class="cl-shell">' +
      '<div class="cl-controls">' +
        '<div class="cl-ctitle">One idea, tailored to fit</div>' +
        '<div class="cl-idea">Core idea: <b>Cadence writes your meeting notes so you can be fully present.</b></div>' +
        '<div class="cl-levers"></div>' +
        '<div class="cl-modes">' +
          '<button type="button" class="cl-mode cl-on" data-mode="live">Live drafts</button>' +
          '<button type="button" class="cl-mode" data-mode="score">Platform scorecard</button>' +
        '</div>' +
      '</div>' +
      '<div class="cl-stage">' +
        '<div class="cl-meters">' +
          '<div class="cl-meter"><span class="cl-mlabel">Platform fit</span><span class="cl-mval" id="cl-score">10</span><div class="cl-bar"><i id="cl-bar"></i></div></div>' +
          '<div class="cl-meter"><span class="cl-mlabel">Platforms native</span><span class="cl-mval" id="cl-native">0 / 4</span></div>' +
        '</div>' +
        '<div id="cl-body"></div>' +
        '<p class="cl-rail">This model is a scripted teaching simulation - a real LLM words things differently. What is real is the lesson: the same post pasted to every platform reaches no one; one idea tailored per platform is what lands. A human still edits for voice and truth before it ships.</p>' +
      '</div>' +
    '</div>';

  var leverWrap = host.querySelector(".cl-levers");
  LEVERS.forEach(function (l) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "cl-lever";
    b.setAttribute("data-lever", l.id);
    b.innerHTML = '<span class="cl-sw"></span><span class="cl-ltext"><b>' + l.label + '</b><span>' + l.hint + '</span></span>';
    b.addEventListener("click", function () { state[l.id] = !state[l.id]; render(); });
    leverWrap.appendChild(b);
  });
  host.querySelectorAll(".cl-mode").forEach(function (m) {
    m.addEventListener("click", function () { state.mode = m.getAttribute("data-mode"); render(); });
  });

  function render() {
    host.querySelectorAll(".cl-lever").forEach(function (b) {
      b.classList.toggle("cl-active", !!state[b.getAttribute("data-lever")]);
    });
    host.querySelectorAll(".cl-mode").forEach(function (m) {
      m.classList.toggle("cl-on", m.getAttribute("data-mode") === state.mode);
    });
    var s = score();
    host.querySelector("#cl-score").textContent = s;
    host.querySelector("#cl-bar").style.width = s + "%";
    var nc = nativeCount();
    var nEl = host.querySelector("#cl-native");
    nEl.textContent = nc + " / 4";
    nEl.className = "cl-mval" + (nc === 4 ? " cl-good" : "");

    var body = host.querySelector("#cl-body");
    if (state.mode === "score") {
      var rows = PLATFORMS.map(function (p) {
        var ok = platOk(p);
        return '<tr class="' + (ok ? "cl-r-ok" : "cl-r-no") + '"><td>' + p.name + '</td><td>' + p.why +
          '</td><td class="cl-rmark">' + (ok ? "✓" : "✗") + '</td></tr>';
      }).join("");
      body.innerHTML =
        '<div class="cl-scorehead">' + nc + ' of 4 platforms come out native <b>(' + Math.round((nc / 4) * 100) + '%)</b></div>' +
        '<table class="cl-table"><thead><tr><th>Platform</th><th>Native when</th><th>OK?</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<p class="cl-note">Each platform needs a different tailoring. Turn the levers on and watch four copy-pasted posts become four native ones.</p>';
    } else {
      body.innerHTML = '<div class="cl-draftlabel">One idea, four platform drafts</div>' +
        PLATFORMS.map(function (p) {
          var ok = platOk(p);
          return '<div class="cl-card' + (ok ? "" : " cl-generic") + '"><span class="cl-plat">' + p.name +
            (ok ? '<span class="cl-badge">native</span>' : '<span class="cl-badge cl-bad">copy-paste</span>') +
            '</span><p>' + (ok ? p.native : GENERIC) + '</p></div>';
        }).join("") +
        (nativeCount() === 0 ? '<p class="cl-note">Everything off: the same generic post pasted to all four platforms. This is what AI content at scale looks like without tailoring - and why it gets ignored.</p>' : '');
    }
  }

  render();
})();
