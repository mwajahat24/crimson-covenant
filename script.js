const navLinks = document.getElementById("navLinks");
const trail = document.querySelector(".cursor-trail");
const parallaxZone = document.querySelector(".parallax-zone");
const parallaxItems = document.querySelectorAll(".parallax");

function toggleMenu() {
  if (navLinks) {
    navLinks.classList.toggle("active");
  }
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks) {
      navLinks.classList.remove("active");
    }
  });
});

document.addEventListener("mousemove", (event) => {
  if (trail) {
    trail.style.left = `${event.clientX}px`;
    trail.style.top = `${event.clientY}px`;
  }

  if (parallaxZone) {
    const rect = parallaxZone.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.speed || 8);
      item.style.translate = `${x * speed}px ${y * speed}px`;
    });
  }
});

function triggerManualGlitch() {
  document.body.classList.add("glitching");

  setTimeout(() => {
    document.body.classList.remove("glitching");
  }, 650);
}

function scheduleRandomGlitch() {
  const delay = 3600 + Math.random() * 2800;

  setTimeout(() => {
    triggerManualGlitch();
    scheduleRandomGlitch();
  }, delay);
}

scheduleRandomGlitch();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.16,
  },
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

function submitForm(event) {
  event.preventDefault();

  triggerManualGlitch();

  alert(
    "Report accepted. Archive entry created. Do not discuss this incident again.",
  );

  event.target.reset();
}
