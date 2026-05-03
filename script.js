const navLinks = document.getElementById("navLinks");
const trail = document.querySelector(".cursor-trail");
const pupils = document.querySelectorAll(".pupil");
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

  pupils.forEach((pupil) => {
    const parent = pupil.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (event.clientX - centerX) / rect.width;
    const distanceY = (event.clientY - centerY) / rect.height;

    const moveX = distanceX * 22;
    const moveY = distanceY * 13;

    pupil.style.transform = `
      translate(
        calc(-50% + ${moveX}px),
        calc(-50% + ${moveY}px)
      )
    `;
  });

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

function randomStrongGlitch() {
  document.body.classList.add("glitching");

  setTimeout(() => {
    document.body.classList.remove("glitching");
  }, 520);
}

function scheduleRandomGlitch() {
  const delay = 4200 + Math.random() * 2600;

  setTimeout(() => {
    randomStrongGlitch();
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
  { threshold: 0.16 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

function submitForm(event) {
  event.preventDefault();

  randomStrongGlitch();

  alert(
    "Your name has been accepted. Something beneath the city has turned toward you.",
  );

  event.target.reset();
}
