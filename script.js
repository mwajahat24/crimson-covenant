const trail = document.querySelector(".cursor-trail");
const modal = document.getElementById("evidenceModal");
const dizzyLayers = document.querySelectorAll(".dizzy-layer");
const motionTexts = document.querySelectorAll(".motion-text");
const evidenceCards = document.querySelectorAll(".evidence-card");

const modalTitle = document.getElementById("modalTitle");
const modalType = document.getElementById("modalType");
const modalDateLarge = document.getElementById("modalDateLarge");
const modalLargeDesc = document.getElementById("modalLargeDesc");
const modalPhoto = document.getElementById("modalPhoto");

const fileName = document.getElementById("fileName");
const modalFile = document.getElementById("modalFile");
const modalDate = document.getElementById("modalDate");
const modalDesc = document.getElementById("modalDesc");

const transcript = document.getElementById("transcript");
const searchInput = document.getElementById("archiveSearch");
const searchStatus = document.getElementById("searchStatus");
const decryptScreen = document.getElementById("decryptScreen");
const decryptText = document.getElementById("decryptText");
const breachAlert = document.getElementById("breachAlert");

const transcriptLines = [
  "[00:00:00] [breathing detected]",
  "[00:00:03] [whispering — unintelligible]",
  "[00:00:07] VOICE: ...behind you...",
  "[00:00:11] [static surge]",
  "[00:00:14] VOICE: ...don’t close your eyes...",
  "[00:00:18] [breathing intensifies]",
  "[00:00:22] VOICE: ...it knows you’re here...",
  "[00:00:27] [sound of something moving]",
  "[00:00:31] [audio corrupted]",
  "[00:00:35] VOICE: RUN.",
  "[00:00:37] [END OF RECORDING]",
];

const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

let audioContext;
let droneOscillator;
let tremoloOscillator;
let noiseNode;
let speechTimeouts = [];
let transcriptInterval = null;

document.addEventListener("mousemove", (event) => {
  if (trail) {
    trail.style.left = `${event.clientX}px`;
    trail.style.top = `${event.clientY}px`;
  }

  if (isTouchDevice) return;

  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;

  dizzyLayers.forEach((layer) => {
    const speed = Number(layer.dataset.speed || 4);
    layer.style.translate = `${x * speed}px ${y * speed}px`;
  });

  motionTexts.forEach((text) => {
    const speed = Number(text.dataset.speed || 4);
    text.style.translate = `${x * speed * 0.7}px ${y * speed * 0.7}px`;
  });
});

function triggerGlitch() {
  document.body.classList.add("glitching");

  setTimeout(() => {
    document.body.classList.remove("glitching");
  }, 750);
}

function scheduleRandomGlitch() {
  const delay = 3600 + Math.random() * 3600;

  setTimeout(() => {
    triggerGlitch();
    scheduleRandomGlitch();
  }, delay);
}

scheduleRandomGlitch();

function showDecrypt(callback) {
  const messages = [
    "Restoring corrupted frames...",
    "Removing unauthorized edits...",
    "Rebuilding missing timestamps...",
    "Entity trace detected...",
  ];

  if (!decryptScreen || !decryptText) {
    callback();
    return;
  }

  decryptText.textContent =
    messages[Math.floor(Math.random() * messages.length)];
  decryptScreen.classList.add("active");

  setTimeout(() => {
    decryptScreen.classList.remove("active");
    callback();
  }, 950);
}

function buildModalPreview(scene) {
  if (!modalPhoto) return;

  modalPhoto.innerHTML = "";

  const photo = document.createElement("div");
  photo.className = `photo ${scene}`;

  if (scene === "photo-hallway") {
    photo.innerHTML = `<span class="timestamp">03:17:42<br>CAM 07</span><div class="hall-figure"></div>`;
  }

  if (scene === "photo-door") {
    photo.innerHTML = `<div class="red-door"></div>`;
  }

  if (scene === "photo-ritual") {
    photo.innerHTML = `<div class="sigil"></div><div class="candle c1"></div><div class="candle c2"></div><div class="candle c3"></div>`;
  }

  if (scene === "photo-forest") {
    photo.innerHTML = `<div class="trees"></div><div class="forest-figure"></div>`;
  }

  if (scene === "photo-chapel") {
    photo.innerHTML = `<div class="chapel-window"></div><div class="pews"></div>`;
  }

  if (scene === "photo-tape") {
    photo.innerHTML = `<div class="tape"><div class="reel r1"></div><div class="reel r2"></div><span>DON'T LISTEN</span></div>`;
  }

  modalPhoto.appendChild(photo);
}

evidenceCards.forEach((card) => {
  card.setAttribute("tabindex", "0");

  function openCard() {
    const title = card.dataset.title || "";
    const type = card.dataset.type || "";
    const date = card.dataset.date || "";
    const desc = card.dataset.desc || "";
    const scene = card.dataset.scene || "";

    if (fileName) fileName.textContent = title;
    if (modalFile) modalFile.textContent = title;
    if (modalDate) modalDate.textContent = date;
    if (modalDesc) modalDesc.textContent = desc;

    if (modalTitle) modalTitle.textContent = title;
    if (modalType) modalType.textContent = type;
    if (modalDateLarge) modalDateLarge.textContent = date;
    if (modalLargeDesc) modalLargeDesc.textContent = desc;

    buildModalPreview(scene);

    showDecrypt(() => {
      if (modal) modal.classList.add("active");
      triggerGlitch();
    });
  }

  card.addEventListener("click", openCard);

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCard();
    }
  });
});

function closeModal() {
  if (modal) modal.classList.remove("active");
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && modal.classList.contains("active")) {
    closeModal();
  }
});

function ensureAudioContext() {
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  return audioContext;
}

function startCreepyAudio() {
  stopForbiddenAudio(false);

  const ctx = ensureAudioContext();

  droneOscillator = ctx.createOscillator();
  tremoloOscillator = ctx.createOscillator();

  const droneGain = ctx.createGain();
  const tremoloGain = ctx.createGain();

  droneOscillator.type = "sawtooth";
  droneOscillator.frequency.value = 57;

  tremoloOscillator.type = "sine";
  tremoloOscillator.frequency.value = 6.2;

  tremoloGain.gain.value = 0.07;
  droneGain.gain.value = 0.035;

  tremoloOscillator.connect(tremoloGain);
  tremoloGain.connect(droneGain.gain);
  droneOscillator.connect(droneGain);
  droneGain.connect(ctx.destination);

  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = (Math.random() * 2 - 1) * 0.04;
  }

  noiseNode = ctx.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.035;

  noiseNode.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  droneOscillator.start();
  tremoloOscillator.start();
  noiseNode.start();
}

function stopForbiddenAudio(closeContext = true) {
  speechTimeouts.forEach(clearTimeout);
  speechTimeouts = [];

  if (transcriptInterval) {
    clearInterval(transcriptInterval);
    transcriptInterval = null;
  }

  try {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }

    if (droneOscillator) droneOscillator.stop();
    if (tremoloOscillator) tremoloOscillator.stop();
    if (noiseNode) noiseNode.stop();

    if (audioContext && closeContext) {
      audioContext.close();
    }
  } catch (error) {
    // Audio may already be stopped.
  }

  droneOscillator = null;
  tremoloOscillator = null;
  noiseNode = null;

  if (closeContext) {
    audioContext = null;
  }
}

async function playDemonicToneLayer() {
  if (typeof Tone === "undefined") {
    console.warn("Tone.js is not loaded.");
    return;
  }

  await Tone.start();

  const distortion = new Tone.Distortion(0.9);
  const pitchShift = new Tone.PitchShift(-12);

  const reverb = new Tone.Reverb({
    decay: 8,
    wet: 0.58,
  });

  const delay = new Tone.FeedbackDelay({
    delayTime: 0.22,
    feedback: 0.48,
    wet: 0.38,
  });

  const bitCrusher = new Tone.BitCrusher(4);

  const filter = new Tone.Filter({
    frequency: 580,
    type: "lowpass",
    rolloff: -24,
  });

  const synth = new Tone.MonoSynth({
    oscillator: {
      type: "sawtooth",
    },
    envelope: {
      attack: 0.18,
      decay: 0.45,
      sustain: 0.28,
      release: 1.9,
    },
  });

  synth.chain(
    distortion,
    bitCrusher,
    pitchShift,
    delay,
    reverb,
    filter,
    Tone.Destination,
  );

  const now = Tone.now();

  synth.triggerAttackRelease("C2", "1n", now);
  synth.triggerAttackRelease("G1", "1n", now + 0.35);
  synth.triggerAttackRelease("F1", "1n", now + 0.7);
  synth.triggerAttackRelease("C1", "1n", now + 1.1);

  setTimeout(() => {
    synth.dispose();
    distortion.dispose();
    bitCrusher.dispose();
    pitchShift.dispose();
    reverb.dispose();
    delay.dispose();
    filter.dispose();
  }, 5500);
}

function playWhisperBurst() {
  const ctx = ensureAudioContext();

  const bufferSize = ctx.sampleRate * 0.8;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.08;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 4;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start();
}

function speakDemonicLine(text, delay = 0) {
  if (!("speechSynthesis" in window)) return;

  const timeoutId = setTimeout(() => {
    const main = new SpeechSynthesisUtterance(text);
    main.rate = 0.42;
    main.pitch = 0.08;
    main.volume = 0.42;

    const lowEcho = new SpeechSynthesisUtterance(text);
    lowEcho.rate = 0.32;
    lowEcho.pitch = 0.01;
    lowEcho.volume = 0.22;

    const highGhost = new SpeechSynthesisUtterance(text);
    highGhost.rate = 0.7;
    highGhost.pitch = 0.55;
    highGhost.volume = 0.11;

    triggerGlitch();
    playWhisperBurst();
    playDemonicToneLayer();

    speechSynthesis.speak(main);

    const echoTimeout = setTimeout(() => {
      playWhisperBurst();
      speechSynthesis.speak(lowEcho);
    }, 240);

    const ghostTimeout = setTimeout(() => {
      speechSynthesis.speak(highGhost);
    }, 470);

    const extraToneTimeout = setTimeout(() => {
      playDemonicToneLayer();
    }, 760);

    speechTimeouts.push(echoTimeout, ghostTimeout, extraToneTimeout);
  }, delay);

  speechTimeouts.push(timeoutId);
}

async function playForbiddenAudio() {
  triggerGlitch();
  startCreepyAudio();

  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }

  if (transcript) {
    transcript.innerHTML = "";
  }

  const spokenLines = [
    "Momina .",
    "Momina .",
    "Momina .",
    "You opened the wrong file.",
    "It is behind the recording.",
    "Do not close your eyes.",
    "It knows you are here.",
    "Run.",
  ];

  spokenLines.forEach((line, index) => {
    speakDemonicLine(line, 1200 + index * 2300);
  });

  let index = 0;

  transcriptInterval = setInterval(() => {
    if (index >= transcriptLines.length) {
      clearInterval(transcriptInterval);
      transcriptInterval = null;
      return;
    }

    const line = document.createElement("p");
    line.textContent = transcriptLines[index];

    if (line.textContent.includes("VOICE")) {
      line.classList.add("voice");
      playWhisperBurst();
      playDemonicToneLayer();
      triggerGlitch();

      document.body.style.filter =
        "contrast(1.08) brightness(1.04) saturate(1.1)";

      setTimeout(() => {
        document.body.style.filter = "";
      }, 900);
    }

    if (transcript) {
      transcript.appendChild(line);
      transcript.scrollTop = transcript.scrollHeight;
    }

    index++;
  }, 520);
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    evidenceCards.forEach((card) => {
      const text =
        `${card.dataset.title} ${card.dataset.type} ${card.dataset.desc}`.toLowerCase();
      const match = text.includes(query);

      card.classList.toggle("hidden", query && !match);

      if (!query || match) visible++;
    });

    if (!query) {
      searchStatus.textContent = "Search index ready. 6 files available.";
      return;
    }

    if (visible === 0) {
      searchStatus.textContent =
        "No matching files. Corrupted result recovered: SUBJECT STILL PRESENT.";
      triggerGlitch();
    } else {
      searchStatus.textContent = `${visible} file(s) recovered. Some metadata may be false.`;
    }
  });
}

if (breachAlert) {
  setTimeout(() => {
    breachAlert.classList.add("active");
    triggerGlitch();

    setTimeout(() => {
      breachAlert.classList.remove("active");
    }, 3200);
  }, 24000);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

function submitReport(event) {
  event.preventDefault();
  triggerGlitch();
  alert(
    "Report accepted. Archive entry created. Do not discuss this incident again.",
  );
  event.target.reset();
}
