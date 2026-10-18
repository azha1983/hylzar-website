const header = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const menuToggleLabel = document.querySelector(".menu-toggle-label");
const navigation = document.querySelector("#primary-nav");
const navLinks = [...document.querySelectorAll('.nav-route a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];
const headerProgress = document.querySelector(".header-progress span");

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  headerProgress.style.transform = `scaleX(${progress})`;
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggleLabel.textContent = "Menu";
  navigation.classList.remove("open");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  menuToggleLabel.textContent = isOpen ? "Menu" : "Close";
  navigation.classList.toggle("open", !isOpen);
  header.classList.toggle("menu-active", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760 && navigation.classList.contains("open")) closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.13 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const activeNavObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const target = link.getAttribute("href");
        const isProductSection = target === "#products" && ["products", "talent"].includes(entry.target.id);
        link.classList.toggle("active", target === `#${entry.target.id}` || isProductSection);
      });
    });
  },
  { rootMargin: "-35% 0px -58%", threshold: 0 }
);

sections.forEach((section) => activeNavObserver.observe(section));
document.querySelector("#current-year").textContent = new Date().getFullYear();
