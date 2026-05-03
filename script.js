const trail = document.querySelector(".cursor-trail");
const modal = document.getElementById("evidenceModal");
const dizzyLayers = document.querySelectorAll(".dizzy-layer");
const motionTexts = document.querySelectorAll(".motion-text");

const modalTitle = document.getElementById("modalTitle");
const modalType = document.getElementById("modalType");
const modalDateLarge = document.getElementById("modalDateLarge");
const modalLargeDesc = document.getElementById("modalLargeDesc");

const fileName = document.getElementById("fileName");
const modalFile = document.getElementById("modalFile");
const modalDate = document.getElementById("modalDate");
const modalDesc = document.getElementById("modalDesc");

const transcript = document.getElementById("transcript");

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

document.querySelectorAll(".evidence-card").forEach((card) => {
  card.setAttribute("tabindex", "0");

  function openCard() {
    const title = card.dataset.title;
    const type = card.dataset.type;
    const date = card.dataset.date;
    const desc = card.dataset.desc;

    fileName.textContent = title;
    modalFile.textContent = title;
    modalDate.textContent = date;
    modalDesc.textContent = desc;

    modalTitle.textContent = title;
    modalType.textContent = type;
    modalDateLarge.textContent = date;
    modalLargeDesc.textContent = desc;

    modal.classList.add("active");
    triggerGlitch();
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

function playForbiddenAudio() {
  triggerGlitch();

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
