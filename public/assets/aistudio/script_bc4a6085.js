(() => {
  "use strict";

  const $  = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const KEY = "klinik-puisi-grade4-v4";
  const MISSIONS = ["lab", "simulation", "operation", "diagnosis"];
  const TOTAL_MISSIONS = MISSIONS.length;
  const SCREENS = ["home", "register", "orientation", "map", "lab", "simulation", "operation", "diagnosis", "result"];

  const POEM = {
    1: "Di sini dahulu ada lapangan,",
    2: "tempat kami bermain layangan.",
    3: "Layangan kami membubung ke angkasa,",
    4: "melenggak-lenggok dengan cantiknya.",
    5: "Di sungai itu dahulu kami mandi,",
    6: "berenang setiap petang dan pagi,",
    7: "tak peduli dingin memagut tulang.",
    8: "Demikian kakekku bercerita",
    9: "dan aku hanya dapat membayangkan",
    10: "sambil menatap satu kompleks perumahan",
    11: "dan sebuah kali kecil berair dangkal."
  };

  /* Data Game 1: Kaca Pembesar Kata Kunci */
  const LAB_ROUNDS = [
    {
      title: "Pohon di Halaman",
      lines: [
        [
          { text: "Di halaman depan,", isClue: false, hint: "Ini hanya memberi tahu tempatnya. Cari kata ajakan merawat pohon!" },
          { text: "mari kita menjaganya", isClue: true, hint: "Tepat! Frasa ini menunjukkan ajakan merawat pohon." }
        ],
        [
          { text: "agar tumbuh", isClue: false, hint: "Sudah dekat! Ketuk kata yang menjelaskan manfaat pohon bagi kita." },
          { text: "teduh sepanjang musim.", isClue: true, hint: "Hebat! Ini menunjukkan tujuan dan manfaat pohon." }
        ]
      ],
      explain: "Dengan Kaca Pembesar, kamu menemukan petunjuk 'mari kita menjaganya' dan 'teduh sepanjang musim'. Artinya penulis mengajak kita merawat pohon agar selalu memberi keteduhan."
    },
    {
      title: "Sungai di Desa",
      lines: [
        [
          { text: "Di tepi desa,", isClue: false, hint: "Ini hanya keterangan tempat. Cari kata yang menunjukkan perubahan waktu!" },
          { text: "dahulu airnya jernih,", isClue: true, hint: "Betul! Kata 'dahulu' dan 'jernih' menunjukkan keadaan baik di masa lalu." }
        ],
        [
          { text: "mengalir pelan", isClue: false, hint: "Ini menggambarkan gerak air. Sekarang cari keadaan yang berubah saat ini!" },
          { text: "kini tinggal sampah dan lumpur.", isClue: true, hint: "Tepat! Frasa ini menunjukkan keadaan sungai yang berubah menjadi kotor sekarang." }
        ]
      ],
      explain: "Kata 'dahulu' dan 'kini' sangat penting! Kedua petunjuk itu memperlihatkan perubahan keadaan sungai dari jernih menjadi kotor."
    }
  ];

  /* Data Game 2: Racik Resep Makna (Cocokkan Kartu) */
  const MATCH_PAIRS = [
    { id: "a", clue: "“Mari kita menjaganya”", meaning: "Ajakan untuk merawat lingkungan" },
    { id: "b", clue: "“Agar teduh sepanjang musim”", meaning: "Harapan agar pohon terus bermanfaat" },
    { id: "c", clue: "“Kini tinggal sampah dan lumpur”", meaning: "Keadaan alam yang rusak saat ini" }
  ];
  const MATCH_MEANINGS_ORDER = ["b", "c", "a"];

  /* Kata kunci alasan untuk Meteran Bukti (tidak mengunci jawaban) */
  const REASON_WORDS = [
    "karena", "sebab", "sehingga", "akibat", "berubah", "hilang",
    "tidak ada", "diganti", "dibangun", "dulu", "dahulu", "sekarang", "kini", "agar", "supaya"
  ];

  const initial = () => ({
    name: "",
    avatar: "🧑‍⚕️",
    muted: false,
    musicOn: false, /* TAMBAHAN MUSIK */
    stars: 0,
    done: { lab: false, simulation: false, operation: false, diagnosis: false },
    labStep: 0,
    labFound: [[], []],
    matchedIds: [],
    xray: {},
    diagnosis: { clue: "", meaning: "", evidence: "", reason: "" },
    reflection: ""
  });

  function loadState() {
    const base = initial();
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { raw = null; }
    if (!raw || typeof raw !== "object") return base;

    const done = { ...base.done };
    if (raw.done && typeof raw.done === "object") {
      MISSIONS.forEach(k => { done[k] = Boolean(raw.done[k]); });
    }

    const labFound = LAB_ROUNDS.map((_, rIdx) => {
      const arr = Array.isArray(raw.labFound?.[rIdx]) ? raw.labFound[rIdx] : [];
      return [...new Set(arr.filter(s => typeof s === "string"))];
    });

    const matchedIds = Array.isArray(raw.matchedIds)
      ? [...new Set(raw.matchedIds.filter(id => MATCH_PAIRS.some(p => p.id === id)))]
      : [];

    const xray = {};
    if (raw.xray && typeof raw.xray === "object") {
      Object.entries(raw.xray).forEach(([k, v]) => {
        const n = Number(k);
        if (Number.isInteger(n) && n >= 1 && n <= 11 && (v === "past" || v === "now")) {
          xray[String(n)] = v;
        }
      });
    }

    const diag = { ...base.diagnosis };
    if (raw.diagnosis && typeof raw.diagnosis === "object") {
      Object.keys(diag).forEach(k => {
        if (typeof raw.diagnosis[k] === "string") diag[k] = raw.diagnosis[k];
      });
    }

    return {
      name: typeof raw.name === "string" ? raw.name : base.name,
      avatar: typeof raw.avatar === "string" ? raw.avatar : base.avatar,
      muted: Boolean(raw.muted),
      musicOn: Boolean(raw.musicOn), /* TAMBAHAN MUSIK */
      stars: MISSIONS.filter(k => done[k]).length,
      done,
      labStep: Number.isInteger(raw.labStep) && raw.labStep >= 0 && raw.labStep < LAB_ROUNDS.length ? raw.labStep : 0,
      labFound,
      matchedIds,
      xray,
      diagnosis: diag,
      reflection: typeof raw.reflection === "string" ? raw.reflection : ""
    };
  }

  let state = loadState();
  let chosenAvatar = state.avatar;
  let activeScanner = "past";
  let selectedMatchClue = null;
  let isSpeaking = false;

  /* ============================ EFEK SUARA & KONFETI ============================ */
  let audioCtx = null;
  function playSound(type) {
    if (state.muted) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
/* ============================ SUARA KLIK GLOBAL (SOFT & CUTE) ============================ */
let clickAudioCtx = null;

function playClickSound() {
  if (state.muted) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  try {
    if (!clickAudioCtx) clickAudioCtx = new Ctx();
    if (clickAudioCtx.state === "suspended") clickAudioCtx.resume();

    const now = clickAudioCtx.currentTime;

    // --- Nada 1: "Bubble pop" utama (naik cepat, lembut) ---
    const osc1 = clickAudioCtx.createOscillator();
    const gain1 = clickAudioCtx.createGain();
    osc1.type = "sine";
    // Frekuensi naik dari 900 Hz ke 1500 Hz dalam 40ms (efek "pop" lucu)
    osc1.frequency.setValueAtTime(900, now);
    osc1.frequency.exponentialRampToValueAtTime(1500, now + 0.04);
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.exponentialRampToValueAtTime(0.05, now + 0.008);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc1.connect(gain1);
    gain1.connect(clickAudioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.07);

    // --- Nada 2: Harmonik kecil (sangat pelan) untuk kesan "gemas" ---
    const osc2 = clickAudioCtx.createOscillator();
    const gain2 = clickAudioCtx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1800, now + 0.01);
    osc2.frequency.exponentialRampToValueAtTime(2400, now + 0.05);
    gain2.gain.setValueAtTime(0.0001, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.012, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc2.connect(gain2);
    gain2.connect(clickAudioCtx.destination);
    osc2.start(now + 0.01);
    osc2.stop(now + 0.07);
  } catch { /* abaikan jika browser memblokir audio */ }
}

// Deteksi klik pada elemen interaktif (tombol, link, kartu, chip, dll.)
document.addEventListener("click", (e) => {
  const interactive = e.target.closest(
    "button, a, [role='button'], .route-card, .avatar-choice, .mag-chip, .match-card, .poem-line, .tool-btn, .btn-chip, .starter-chip, .sound-btn, #music-toggle"
  );
  if (interactive) {
    playClickSound();
  }
  const baseFreq = 900 + Math.random() * 200; // 900 - 1100 Hz
osc1.frequency.setValueAtTime(baseFreq, now);
osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.04);
}, true); // useCapture: true agar tetap terdeteksi meski ada event.stopPropagation()
/* ============================ AKHIR SUARA KLIK GLOBAL ============================ */
      const now = audioCtx.currentTime;
      const seq = {
        tap: [[523.25, 0, 0.06]],
        good: [[523.25, 0, 0.09], [659.25, 0.08, 0.14]],
        win: [[523.25, 0, 0.09], [659.25, 0.09, 0.09], [783.99, 0.18, 0.2]],
        oops: [[260, 0, 0.12]]
      }[type] || [];

      seq.forEach(([freq, offset, dur]) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type === "oops" ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.08, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + dur);
      });
    } catch { /* abaikan jika browser memblokir audio */ }
  }

  /* ============================ TAMBAHAN MUSIK ============================ */
  const bgMusic = $("#bg-music");

  function updateMusicButton() {
    const btn = $("#music-toggle");
    if (!btn) return;
    btn.textContent = state.musicOn ? "🎵" : "🎶";
    btn.setAttribute("aria-pressed", String(state.musicOn));
    btn.setAttribute("aria-label", state.musicOn ? "Matikan musik latar" : "Nyalakan musik latar");
    btn.title = state.musicOn ? "Musik latar menyala" : "Musik latar mati";
  }

  function tryPlayMusic() {
    if (!bgMusic || !state.musicOn) return;
    bgMusic.volume = 0.35; // atur volume (0.0 - 1.0)
    bgMusic.play().catch(() => {
      // Browser memblokir autoplay. Matikan state agar tombol sinkron.
      state.musicOn = false;
      save();
      updateMusicButton();
    });
  }

  $("#music-toggle")?.addEventListener("click", () => {
    state.musicOn = !state.musicOn;
    save();
    updateMusicButton();
    if (state.musicOn) {
      tryPlayMusic();
    } else {
      bgMusic?.pause();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (!bgMusic) return;
    if (document.hidden) {
      bgMusic.pause();
    } else if (state.musicOn) {
      tryPlayMusic();
    }
  });
  /* ============================ AKHIR TAMBAHAN MUSIK ============================ */

  function burstConfetti(count = 20) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#278069", "#f59e0b", "#38bdf8", "#34d399", "#fb7185"];
    const nodes = [];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "confetti-piece";
      el.style.left = `${Math.random() * 100}vw`;
      el.style.background = colors[i % colors.length];
      el.style.animationDelay = `${Math.random() * 0.35}s`;
      document.body.appendChild(el);
      nodes.push(el);
    }
    setTimeout(() => nodes.forEach(n => n.remove()), 2400);
  }

  function popStarBadge() {
    const starEl = $("#star-count");
    if (!starEl) return;
    starEl.classList.remove("pop");
    void starEl.offsetWidth;
    starEl.classList.add("pop");
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* abaikan jika storage penuh */ }
    updateHUD();
  }

  function stopSpeech() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    isSpeaking = false;
    const btn = $("#read-poem-btn");
    if (btn) {
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = "🔊 Dengarkan puisi";
    }
  }

  function focusScreenHeading(id) {
    const heading = $(`#screen-${id} h1`);
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }
  }

  function hasValidXray() {
    const vals = Object.values(state.xray);
    return vals.filter(v => v === "past").length >= 2 && vals.filter(v => v === "now").length >= 2;
  }

  function show(id) {
    if (!SCREENS.includes(id)) return;
    if (id !== "operation") stopSpeech();

    if (id === "diagnosis" && !state.done.operation) {
      toast("Pindai dulu minimal 2 baris Dahulu dan 2 baris Kini di Rontgen Puisi, ya.");
      id = "operation";
    } else if (id === "result" && !state.done.diagnosis) {
      toast("Selesaikan Lembar Diagnosis dulu, ya.");
      id = state.done.operation ? "diagnosis" : "map";
    }

    $$(".screen").forEach(s => s.classList.toggle("active", s.id === `screen-${id}`));

    const hideNav = ["home", "register", "result"].includes(id);
    $("#bottom-nav").hidden = hideNav;
    document.body.classList.toggle("has-bottom-nav", !hideNav);

    $$("#bottom-nav button").forEach(btn => {
      const active = btn.dataset.go === id;
      btn.classList.toggle("active", active);
      if (active) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });

    if (id === "lab") renderLab();
    if (id === "simulation") renderSimulation();
    if (id === "operation") renderOperation();
    if (id === "diagnosis") {
      renderDiagnosisXray();
      updateProofMeter();
    }
    if (id === "result") {
      renderResult();
      burstConfetti(28);
    }

    updateHUD();
    focusScreenHeading(id);
    window.scrollTo({ top: 0, behavior: "smooth" });

    /* TAMBAHAN MUSIK: Coba putar musik saat pindah halaman (memanfaatkan interaksi pengguna) */
    if (state.musicOn) tryPlayMusic();
  }

  function updateHUD() {
    state.stars = MISSIONS.filter(k => state.done[k]).length;
    $("#star-count").textContent = state.stars;
    $("#mini-name").textContent = state.name || "Dokter Muda";
    $("#mini-avatar").textContent = state.avatar || "🧑‍⚕️";

    const soundBtn = $("#sound-toggle");
    if (soundBtn) {
      soundBtn.textContent = state.muted ? "🔇" : "🔊";
      soundBtn.setAttribute("aria-pressed", String(state.muted));
      soundBtn.setAttribute("aria-label", state.muted ? "Aktifkan efek suara" : "Matikan efek suara");
    }

    /* TAMBAHAN MUSIK: Sinkronkan tombol musik */
    updateMusicButton();

    $("#progress-label").textContent = `Misi ${state.stars} dari ${TOTAL_MISSIONS}`;
    $("#progress-fill").style.width = `${(state.stars / TOTAL_MISSIONS) * 100}%`;
    $("#progress-bar").setAttribute("aria-valuenow", String(state.stars));

    const homePrimary = $("#home-primary-btn");
    const homeResult = $("#home-result-btn");
    if (homePrimary) {
      if (state.name) {
        homePrimary.dataset.go = "map";
        homePrimary.innerHTML = 'Lanjutkan pemeriksaan <span aria-hidden="true">→</span>';
      } else {
        homePrimary.dataset.go = "register";
        homePrimary.innerHTML = 'Mulai pemeriksaan <span aria-hidden="true">→</span>';
      }
    }
    if (homeResult) homeResult.hidden = !state.done.diagnosis;

    const oriBack = $("#orientation-back");
    const oriNext = $("#orientation-next");
    if (oriBack) oriBack.dataset.go = state.name ? "map" : "home";
    if (oriNext) {
      oriNext.dataset.go = state.name ? "lab" : "register";
      oriNext.textContent = state.name ? "Lanjut ke laboratorium →" : "Daftar sebagai dokter muda →";
    }

    const nextMission = MISSIONS.find(k => !state.done[k]) || (state.done.diagnosis ? "result" : null);
    MISSIONS.forEach(k => {
      const el = $(`#status-${k}`);
      const card = $(`#route-${k}`);
      if (el) el.textContent = state.done[k] ? "✓ Selesai" : (nextMission === k ? "▶ Berikutnya" : "Belum diperiksa");
      if (card) card.classList.toggle("is-next", nextMission === k);
    });

    const statusResult = $("#status-result");
    const routeResult = $("#route-result");
    if (statusResult) statusResult.textContent = state.done.diagnosis ? "Siap dibuka" : "Menunggu";
    if (routeResult) routeResult.classList.toggle("is-next", nextMission === "result");
  }

  function complete(key, stars = 1) {
    if (state.done[key]) return;
    state.done[key] = true;
    save();
    playSound("win");
    popStarBadge();
    burstConfetti(16);
    toast(`⭐ +${stars} bintang!`);
  }

  let toastTimer = null;
  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  $("#sound-toggle").addEventListener("click", () => {
    state.muted = !state.muted;
    save();
    if (!state.muted) playSound("tap");
  });

  /* ============================ MODAL KONFIRMASI ============================ */
  let modalOnConfirm = null;
  function openConfirmModal(title, message, onConfirm) {
    $("#modal-title").textContent = title;
    $("#modal-message").textContent = message;
    modalOnConfirm = onConfirm;
    $("#confirm-modal").hidden = false;
    $("#modal-cancel").focus();
  }
  function closeConfirmModal() {
    $("#confirm-modal").hidden = true;
    modalOnConfirm = null;
  }
  $("#modal-cancel").addEventListener("click", closeConfirmModal);
  $("#modal-confirm").addEventListener("click", () => {
    const fn = modalOnConfirm;
    closeConfirmModal();
    if (typeof fn === "function") fn();
  });
  $("#confirm-modal").addEventListener("click", e => {
    if (e.target.id === "confirm-modal") closeConfirmModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !$("#confirm-modal").hidden) closeConfirmModal();
  });

  /* ============================ NAVIGASI ============================ */
  document.addEventListener("click", e => {
    const nav = e.target.closest("[data-go]");
    if (nav) {
      e.preventDefault();
      show(nav.dataset.go);
    }
  });

  /* ============================ REGISTRASI ============================ */
  function setAvatarSelection(avatar) {
    chosenAvatar = avatar;
    $$(".avatar-choice").forEach(btn => {
      const active = btn.dataset.avatar === avatar;
      btn.classList.toggle("selected", active);
      btn.setAttribute("aria-checked", String(active));
    });
  }
  $("#avatar-picker").addEventListener("click", e => {
    const btn = e.target.closest("[data-avatar]");
    if (btn) {
      playSound("tap");
      setAvatarSelection(btn.dataset.avatar);
    }
  });
  $("#register-form").addEventListener("submit", e => {
    e.preventDefault();
    const nameInput = $("#student-name");
    const name = nameInput.value.trim();
    if (!name) {
      playSound("oops");
      $("#register-feedback").textContent = "Tulis namamu terlebih dahulu, ya.";
      nameInput.focus();
      return;
    }
    state.name = name;
    state.avatar = chosenAvatar;
    save();
    playSound("good");
    $("#register-feedback").textContent = "";
    show("map");
    toast(`Selamat bertugas, ${name}!`);
  });
  $("#student-name").value = state.name || "";
  setAvatarSelection(chosenAvatar);

  /* ============================ GAME 1: KACA PEMBESAR KATA KUNCI ============================ */
  function renderLab() {
    const step = state.labStep;
    const round = LAB_ROUNDS[step];
    const found = state.labFound[step];

    $("#lab-eyebrow").textContent = `🔎 MISI 1 • KACA PEMBESAR (RONDE ${step + 1} DARI ${LAB_ROUNDS.length})`;
    $("#lab-poem-title").textContent = round.title;
    $("#lab-found-count").textContent = `Petunjuk ditemukan: ${found.length} / 2`;

    const board = $("#lab-poem-interactive");
    board.innerHTML = round.lines.map((line, lIdx) => {
      const chips = line.map((seg, sIdx) => {
        const key = `${lIdx}-${sIdx}`;
        const isFound = found.includes(key);
        return `<button type="button" class="mag-chip${isFound ? " found" : ""}" data-key="${key}" ${isFound ? "disabled" : ""}>${seg.text}</button>`;
      }).join("");
      return `<div class="mag-line">${chips}</div>`;
    }).join("");

    const allFound = found.length >= 2;
    const fb = $("#lab-feedback");
    fb.classList.toggle("ok", allFound);
    fb.textContent = allFound ? "Semua kata kunci pada puisi ini sudah kamu temukan!" : "";

    $("#lab-explain-body").textContent = round.explain;
    $("#lab-explain").hidden = !allFound;

    const btn = $("#finish-lab");
    btn.disabled = !allFound;
    btn.textContent = step < LAB_ROUNDS.length - 1 ? "Lanjut ronde berikutnya →" : "Selesai Misi 1 →";
  }

  $("#lab-poem-interactive").addEventListener("click", e => {
    const chip = e.target.closest(".mag-chip");
    if (!chip || chip.disabled) return;

    const step = state.labStep;
    const round = LAB_ROUNDS[step];
    const key = chip.dataset.key;
    const [lIdx, sIdx] = key.split("-").map(Number);
    const seg = round.lines[lIdx][sIdx];
    const fb = $("#lab-feedback");

    if (seg.isClue) {
      if (!state.labFound[step].includes(key)) {
        state.labFound[step].push(key);
        save();
      }
      playSound("good");
      fb.classList.add("ok");
      fb.textContent = seg.hint;
      renderLab();
    } else {
      playSound("oops");
      chip.classList.remove("nudge");
      void chip.offsetWidth;
      chip.classList.add("nudge");
      fb.classList.remove("ok");
      fb.textContent = seg.hint;
    }
  });

  $("#finish-lab").addEventListener("click", () => {
    if (state.labStep < LAB_ROUNDS.length - 1) {
      state.labStep += 1;
      save();
      renderLab();
      focusScreenHeading("lab");
      return;
    }
    complete("lab");
    show("simulation");
  });

  /* ============================ GAME 2: RACIK RESEP MAKNA ============================ */
  function renderSimulation() {
    const matched = state.matchedIds;
    $("#sim-counter").textContent = `Pasangan cocok: ${matched.length} / ${MATCH_PAIRS.length}`;

    $("#match-clues").innerHTML = MATCH_PAIRS.map(p => {
      const isMatched = matched.includes(p.id);
      const isActive = selectedMatchClue === p.id;
      return `<button type="button" class="match-card${isMatched ? " matched" : ""}${isActive ? " active" : ""}" data-clue-id="${p.id}" ${isMatched ? "disabled" : ""}>${isMatched ? "✓ " : ""}${p.clue}</button>`;
    }).join("");

    $("#match-meanings").innerHTML = MATCH_MEANINGS_ORDER.map(id => {
      const p = MATCH_PAIRS.find(item => item.id === id);
      const isMatched = matched.includes(p.id);
      return `<button type="button" class="match-card${isMatched ? " matched" : ""}" data-meaning-id="${p.id}" ${isMatched ? "disabled" : ""}>${isMatched ? "✓ " : ""}${p.meaning}</button>`;
    }).join("");

    const allDone = matched.length === MATCH_PAIRS.length;
    const fb = $("#sim-feedback");
    if (allDone) {
      fb.classList.add("ok");
      fb.textContent = "Hebat! Semua resep makna berhasil kamu racik dengan tepat.";
    }
    $("#finish-simulation").disabled = !allDone && !state.done.simulation;
  }

  $("#match-clues").addEventListener("click", e => {
    const btn = e.target.closest("[data-clue-id]");
    if (!btn || btn.disabled) return;
    playSound("tap");
    selectedMatchClue = selectedMatchClue === btn.dataset.clueId ? null : btn.dataset.clueId;
    renderSimulation();
  });

  $("#match-meanings").addEventListener("click", e => {
    const btn = e.target.closest("[data-meaning-id]");
    if (!btn || btn.disabled) return;
    const fb = $("#sim-feedback");

    if (!selectedMatchClue) {
      playSound("oops");
      fb.classList.remove("ok");
      fb.textContent = "Pilih dulu 1 Kartu Petunjuk di sebelah kiri, ya.";
      return;
    }

    if (selectedMatchClue === btn.dataset.meaningId) {
      state.matchedIds.push(selectedMatchClue);
      selectedMatchClue = null;
      save();
      playSound("good");
      fb.classList.add("ok");
      fb.textContent = "Cocok! Petunjuk dan maksudnya saling terhubung.";
      renderSimulation();
    } else {
      playSound("oops");
      btn.classList.add("wrong");
      setTimeout(() => btn.classList.remove("wrong"), 350);
      fb.classList.remove("ok");
      fb.textContent = "Belum cocok. Coba baca lagi isi baris puisinya!";
    }
  });

  $("#finish-simulation").addEventListener("click", () => {
    complete("simulation");
    show("operation");
  });

  /* ============================ GAME 3: RONTGEN DAHULU VS KINI ============================ */
  function setScannerTool(mode) {
    activeScanner = mode;
    $("#tool-past").classList.toggle("active", mode === "past");
    $("#tool-past").setAttribute("aria-pressed", String(mode === "past"));
    $("#tool-now").classList.toggle("active", mode === "now");
    $("#tool-now").setAttribute("aria-pressed", String(mode === "now"));

    const poemLinesEl = $("#poem-lines");
    if (poemLinesEl) poemLinesEl.dataset.tool = mode;
  }

  $("#tool-past").addEventListener("click", () => { playSound("tap"); setScannerTool("past"); });
  $("#tool-now").addEventListener("click", () => { playSound("tap"); setScannerTool("now"); });

  function getXrayLists() {
    const past = [];
    const now = [];
    Object.entries(state.xray)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .forEach(([lineNum, kind]) => {
        const item = { line: Number(lineNum), text: POEM[Number(lineNum)] };
        if (kind === "past") past.push(item);
        else now.push(item);
      });
    return { past, now };
  }

  function renderXrayColumns(pastEl, nowEl, emptyText) {
    const { past, now } = getXrayLists();
    pastEl.innerHTML = past.length
      ? past.map(i => `<p class="xray-item">${i.line}. ${i.text}</p>`).join("")
      : `<p class="muted">${emptyText}</p>`;
    nowEl.innerHTML = now.length
      ? now.map(i => `<p class="xray-item">${i.line}. ${i.text}</p>`).join("")
      : `<p class="muted">${emptyText}</p>`;
  }

  function renderOperation() {
    $$("#poem-lines .poem-line").forEach(btn => {
      const tag = state.xray[btn.dataset.line];
      btn.classList.toggle("tag-past", tag === "past");
      btn.classList.toggle("tag-now", tag === "now");
      const badge = $(".line-tag", btn);
      if (badge) badge.textContent = tag === "past" ? "🟡 Dahulu" : (tag === "now" ? "🔵 Kini" : "");
    });

    renderXrayColumns($("#xray-past-list"), $("#xray-now-list"), "Belum ditandai");
    const ready = hasValidXray();
    $("#xray-insight").hidden = !ready;
    $("#confirm-clues").disabled = !ready;
  }

  $("#poem-lines").addEventListener("click", e => {
    const btn = e.target.closest(".poem-line");
    if (!btn) return;

    const lineStr = btn.dataset.line;
    const lineNum = Number(lineStr);
    const fb = $("#operation-feedback");

    if (state.xray[lineStr] === activeScanner) {
      delete state.xray[lineStr];
      playSound("tap");
      fb.textContent = "";
      save();
      renderOperation();
      return;
    }

    if (activeScanner === "now" && (lineNum === 1 || lineNum === 5)) {
      playSound("oops");
      fb.classList.remove("ok");
      fb.textContent = "Perhatikan kata 'dahulu' di baris itu — bagian tersebut menceritakan masa lalu kakek (🟡 Dahulu).";
      return;
    }
    if (activeScanner === "past" && (lineNum === 9 || lineNum === 10 || lineNum === 11)) {
      playSound("oops");
      fb.classList.remove("ok");
      fb.textContent = "Perhatikan! Baris itu menceritakan hal yang dilihat dan dirasakan tokoh sekarang (🔵 Kini).";
      return;
    }

    state.xray[lineStr] = activeScanner;
    playSound("good");
    fb.textContent = "";
    save();
    renderOperation();
  });

  $("#read-poem-btn").addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      toast("Maaf, browser ini belum mendukung pembacaan suara.");
      return;
    }
    if (isSpeaking) {
      stopSpeech();
      return;
    }
    const fullPoem = "Dahulu dan Kini, karya Eva Y. Nukman. " + Object.values(POEM).join(" ");
    const utter = new SpeechSynthesisUtterance(fullPoem);
    utter.lang = "id-ID";
    utter.rate = 0.88;
    utter.onend = () => stopSpeech();
    utter.onerror = () => stopSpeech();

    isSpeaking = true;
    $("#read-poem-btn").setAttribute("aria-pressed", "true");
    $("#read-poem-btn").textContent = "⏹️ Hentikan suara";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  });

  $("#confirm-clues").addEventListener("click", () => {
    if (!hasValidXray()) {
      $("#operation-feedback").textContent = "Tandai minimal 2 baris 🟡 Dahulu dan 2 baris 🔵 Kini, ya.";
      return;
    }
    $("#operation-feedback").textContent = "";
    complete("operation");
    show("diagnosis");
  });

  /* ============================ DIAGNOSIS & METERAN BUKTI ============================ */
  const diagnosisFields = {
    clue: "#answer-clue",
    meaning: "#answer-meaning",
    evidence: "#answer-evidence",
    reason: "#answer-reason"
  };

  function syncDiagnosisInputsFromState() {
    Object.entries(diagnosisFields).forEach(([key, sel]) => {
      const el = $(sel);
      if (el) el.value = state.diagnosis[key] || "";
    });
  }

  function formatXrayPlain(filterKind) {
    const { past, now } = getXrayLists();
    if (filterKind === "now") {
      return now.map(i => `Baris ${i.line}: "${i.text}"`).join("; ");
    }
    const parts = [];
    if (past.length) parts.push("Dahulu: " + past.map(i => `Baris ${i.line} ("${i.text}")`).join(", "));
    if (now.length) parts.push("Kini: " + now.map(i => `Baris ${i.line} ("${i.text}")`).join(", "));
    return parts.join(" | ");
  }

  function renderDiagnosisXray() {
    renderXrayColumns($("#diag-past-list"), $("#diag-now-list"), "Belum ditandai");
    const { past, now } = getXrayLists();
    $("#fill-clue-btn").disabled = past.length + now.length === 0;
    $("#fill-evidence-btn").disabled = now.length === 0;
  }

  function getMeterStatus() {
    const clue = ($("#answer-clue")?.value || "").trim();
    const meaning = ($("#answer-meaning")?.value || "").trim();
    const evidence = ($("#answer-evidence")?.value || "").trim();
    const reason = ($("#answer-reason")?.value || "").trim();

    const combined = `${meaning} ${reason}`.toLowerCase();
    return {
      clueLit: clue.length >= 8 && evidence.length >= 8,
      reasonLit: REASON_WORDS.some(w => combined.includes(w)),
      completeLit: clue.length >= 10 && meaning.length >= 15 && evidence.length >= 10 && reason.length >= 12
    };
  }

  function updateProofMeter() {
    const { clueLit, reasonLit, completeLit } = getMeterStatus();
    $("#meter-clue")?.classList.toggle("lit", clueLit);
    $("#meter-reason")?.classList.toggle("lit", reasonLit);
    $("#meter-complete")?.classList.toggle("lit", completeLit);
  }

  Object.entries(diagnosisFields).forEach(([key, sel]) => {
    const el = $(sel);
    if (!el) return;
    el.addEventListener("input", () => {
      state.diagnosis[key] = el.value;
      save();
      updateProofMeter();
    });
  });

  $("#fill-clue-btn").addEventListener("click", () => {
    const text = formatXrayPlain("all");
    if (!text) return;
    $("#answer-clue").value = text;
    state.diagnosis.clue = text;
    playSound("tap");
    save();
    updateProofMeter();
    toast("Hasil Rontgen disalin ke jawaban no. 1!");
  });

  $("#fill-evidence-btn").addEventListener("click", () => {
    const text = formatXrayPlain("now");
    if (!text) return;
    $("#answer-evidence").value = text;
    state.diagnosis.evidence = text;
    playSound("tap");
    save();
    updateProofMeter();
    toast("Baris Kini disalin ke jawaban no. 3!");
  });

  $$(".starter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const target = $(`#${chip.dataset.target}`);
      if (!target) return;
      const starter = chip.dataset.text;
      if (!target.value.trim()) {
        target.value = starter;
      } else if (!target.value.includes(starter.trim())) {
        target.value = `${target.value.trim()} ${starter}`;
      }
      playSound("tap");
      target.dispatchEvent(new Event("input"));
      target.focus();
    });
  });

  $("#diagnosis-form").addEventListener("submit", e => {
    e.preventDefault();
    const feedback = $("#diagnosis-feedback");
    const data = {};
    let missing = null;

    Object.entries(diagnosisFields).forEach(([key, sel]) => {
      const el = $(sel);
      const val = el.value.trim();
      data[key] = val;
      if (!val && !missing) missing = el;
    });

    if (missing) {
      playSound("oops");
      feedback.textContent = "Lengkapi semua jawaban dulu, ya, dokter muda.";
      missing.focus();
      return;
    }

    state.diagnosis = data;
    complete("diagnosis");
    feedback.textContent = "";
    show("result");
  });

  /* ============================ HASIL & LENCANA ============================ */
  function getEarnedBadges() {
    const badges = [];
    if (state.done.lab) badges.push("🔎 Detektif Kata Kunci");
    if (state.done.simulation) badges.push("🧪 Peracik Resep Makna");
    if (state.done.operation) badges.push("🩻 Ahli Rontgen Puisi");
    if (state.done.diagnosis) badges.push("📋 Penulis Bukti Teliti");
    const m = getMeterStatus();
    if (state.done.diagnosis && m.clueLit && m.reasonLit && m.completeLit) {
      badges.push("🌟 Spesialis Penjelas Hebat");
    }
    return badges;
  }

  function renderResult() {
    const nama = state.name || "Dokter Muda";
    $("#result-name").textContent = nama;
    $("#result-stars").textContent = state.stars;
    $("#print-name").textContent = nama;
    $("#print-stars").textContent = state.stars;

    const badges = getEarnedBadges();
    $("#result-badges").innerHTML = badges.map(b => `<span class="badge-item">${b}</span>`).join("");

    $("#summary-selected").textContent = formatXrayPlain("all") || "—";
    $("#summary-clue").textContent = state.diagnosis.clue || "—";
    $("#summary-meaning").textContent = state.diagnosis.meaning || "—";
    $("#summary-evidence").textContent = state.diagnosis.evidence || "—";
    $("#summary-reason").textContent = state.diagnosis.reason || "—";
    $("#summary-reflection").textContent = state.reflection || "Belum diisi";

    const reflectionEl = $("#reflection-answer");
    if (reflectionEl) reflectionEl.value = state.reflection || "";
  }

  $("#reflection-answer").addEventListener("input", e => {
    state.reflection = e.target.value;
    save();
    $("#summary-reflection").textContent = state.reflection.trim() || "Belum diisi";
  });

  $("#save-reflection").addEventListener("click", () => {
    const val = $("#reflection-answer").value.trim();
    state.reflection = val;
    save();
    const fb = $("#reflection-feedback");
    fb.classList.toggle("ok", Boolean(val));
    fb.textContent = val
      ? "Refleksimu sudah tersimpan. Terima kasih, dokter muda! 💚"
      : "Tulis refleksimu dulu, ya.";
    if (val) playSound("good");
    $("#summary-reflection").textContent = val || "Belum diisi";
  });

  $("#copy-result").addEventListener("click", async () => {
    const report = [
      `HASIL PEMERIKSAAN KLINIK PUISI`,
      `Dokter Muda: ${state.name || "Dokter Muda"} (${state.stars} Bintang)`,
      `Lencana: ${getEarnedBadges().join(", ") || "-"}`,
      `Puisi: "Dahulu dan Kini" karya Eva Y. Nukman`,
      ``,
      `Hasil Rontgen: ${formatXrayPlain("all") || "-"}`,
      `1. Petunjuk: ${state.diagnosis.clue || "-"}`,
      `2. Maksud Puisi: ${state.diagnosis.meaning || "-"}`,
      `3. Bukti: ${state.diagnosis.evidence || "-"}`,
      `4. Alasan: ${state.diagnosis.reason || "-"}`,
      `Refleksi: ${state.reflection || "-"}`
    ].join("\n");

    try {
      await navigator.clipboard.writeText(report);
      playSound("good");
      toast("Hasil diagnosis disalin! Siap ditempel untuk guru.");
    } catch {
      toast("Gagal menyalin otomatis. Gunakan tombol Cetak hasil, ya.");
    }
  });

  $("#print-result").addEventListener("click", () => window.print());

  /* ============================ RESET BERSIH ============================ */
  function resetAll(toastMsg) {
    const name = state.name;
    const avatar = state.avatar;
    const muted = state.muted;
    const musicOn = state.musicOn; /* TAMBAHAN MUSIK: pertahankan preferensi musik */
    state = initial();
    state.name = name;
    state.avatar = avatar;
    state.muted = muted;
    state.musicOn = musicOn; /* TAMBAHAN MUSIK */
    chosenAvatar = avatar;
    selectedMatchClue = null;
    setScannerTool("past");
    stopSpeech();
    save();

    syncDiagnosisInputsFromState();
    $("#diagnosis-feedback").textContent = "";
    $("#operation-feedback").textContent = "";
    $("#sim-feedback").textContent = "";
    $("#reflection-feedback").textContent = "";
    $("#reflection-feedback").classList.remove("ok");
    $("#reflection-answer").value = "";

    renderLab();
    renderSimulation();
    renderOperation();
    renderDiagnosisXray();
    updateProofMeter();
    renderResult();
    show("map");
    toast(toastMsg);
  }

  $("#replay-button").addEventListener("click", () => {
    openConfirmModal(
      "Ulangi seluruh pemeriksaan?",
      "Bintang, hasil permainan, dan jawaban diagnosismu akan direset agar bisa mencoba lagi.",
      () => resetAll("Pemeriksaan direset. Semangat lagi!")
    );
  });

  $("#reset-progress").addEventListener("click", () => {
    openConfirmModal(
      "Mulai ulang pemeriksaan?",
      "Semua kemajuan misi dan jawabanmu akan dihapus dari awal.",
      () => resetAll("Progres direset. Ayo mulai dari awal!")
    );
  });

  $("#finish-button").addEventListener("click", () => {
    show("home");
    toast("Terima kasih sudah bertugas di Klinik Puisi! 🩺");
  });

  /* ============================ INIT ============================ */
  syncDiagnosisInputsFromState();
  setScannerTool("past");
  renderLab();
  renderSimulation();
  renderOperation();
  renderDiagnosisXray();
  updateProofMeter();
  updateHUD();
  updateMusicButton(); /* TAMBAHAN MUSIK */
  show("home");
})();