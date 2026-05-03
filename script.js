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
let droneGain;
let noiseNode;

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

  decryptText.textContent =
    messages[Math.floor(Math.random() * messages.length)];
  decryptScreen.classList.add("active");

  setTimeout(() => {
    decryptScreen.classList.remove("active");
    callback();
  }, 950);
}

function buildModalPreview(scene) {
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
    const title = card.dataset.title;
    const type = card.dataset.type;
    const date = card.dataset.date;
    const desc = card.dataset.desc;
    const scene = card.dataset.scene;

    fileName.textContent = title;
    modalFile.textContent = title;
    modalDate.textContent = date;
    modalDesc.textContent = desc;

    modalTitle.textContent = title;
    modalType.textContent = type;
    modalDateLarge.textContent = date;
    modalLargeDesc.textContent = desc;

    buildModalPreview(scene);

    showDecrypt(() => {
      modal.classList.add("active");
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
  modal.classList.remove("active");
}

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

function startCreepyAudio() {
  stopForbiddenAudio();

  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  droneOscillator = audioContext.createOscillator();
  tremoloOscillator = audioContext.createOscillator();
  droneGain = audioContext.createGain();

  droneOscillator.type = "sawtooth";
  droneOscillator.frequency.value = 57;

  tremoloOscillator.type = "sine";
  tremoloOscillator.frequency.value = 6.2;

  const tremoloGain = audioContext.createGain();
  tremoloGain.gain.value = 0.07;

  droneGain.gain.value = 0.035;

  tremoloOscillator.connect(tremoloGain);
  tremoloGain.connect(droneGain.gain);
  droneOscillator.connect(droneGain);
  droneGain.connect(audioContext.destination);

  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate,
  );
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = (Math.random() * 2 - 1) * 0.04;
  }

  noiseNode = audioContext.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;

  const noiseGain = audioContext.createGain();
  noiseGain.gain.value = 0.035;

  noiseNode.connect(noiseGain);
  noiseGain.connect(audioContext.destination);

  droneOscillator.start();
  tremoloOscillator.start();
  noiseNode.start();
}

function stopForbiddenAudio() {
  try {
    if (droneOscillator) droneOscillator.stop();
    if (tremoloOscillator) tremoloOscillator.stop();
    if (noiseNode) noiseNode.stop();
    if (audioContext) audioContext.close();
  } catch (error) {
    // Audio may already be stopped.
  }

  droneOscillator = null;
  tremoloOscillator = null;
  noiseNode = null;
  audioContext = null;
}

function playForbiddenAudio() {
  triggerGlitch();
  startCreepyAudio();

  transcript.innerHTML = "";

  let index = 0;

  const interval = setInterval(() => {
    if (index >= transcriptLines.length) {
      clearInterval(interval);
      return;
    }

    const line = document.createElement("p");
    line.textContent = transcriptLines[index];

    if (line.textContent.includes("VOICE")) {
      line.classList.add("voice");
    }

    transcript.appendChild(line);
    transcript.scrollTop = transcript.scrollHeight;

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

setTimeout(() => {
  breachAlert.classList.add("active");
  triggerGlitch();

  setTimeout(() => {
    breachAlert.classList.remove("active");
  }, 3200);
}, 24000);

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
