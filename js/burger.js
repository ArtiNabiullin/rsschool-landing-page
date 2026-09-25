export function initBurger() {
  const nav = document.querySelector(".header__list");
  const hamburger = document.querySelector(".hamburger");
  const navItem = document.querySelectorAll(".header__item");
  const body = document.body;

  if (!nav || !hamburger || !navItem) return;

  const closeMenu = () => {
    nav.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    body.classList.remove("lock");
  };

  const openMenu = () => {
    nav.classList.add("active");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    body.classList.add("lock");
  };

  hamburger.addEventListener("click", () => {
    if (nav.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navItem.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  let resizeTimer;

  window.addEventListener("resize", () => {
    body.classList.add("is-resizing");

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      body.classList.remove("is-resizing");

      if (window.innerWidth > 860) {
        closeMenu();
      }
    }, 150);
  });

  nav.addEventListener("click", (event) => {
    if (event.target === nav) {
      closeMenu();
    }
  });
}
