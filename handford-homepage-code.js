alert("sefes");
function throttle(callback, limit) {
  var waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(function () {
        waiting = false;
      }, limit);
    }
  };
}
const setSectionHeaderOffset = () => {
  const sectionHeaders = document.querySelectorAll(".section-header");
  const gutter = parseInt(
    window.getComputedStyle(sectionHeaders[0]).marginLeft.replace(/\D/g, "")
  );
  for (let header of sectionHeaders) {
    header.style.transform = `translateX(${
      (header.getBoundingClientRect().width + gutter + 30) * -1
    }px)`;
    header.style.opacity = "1";
  }
};
const setSectionHeaderTransitions = () => {
  const sectionHeaders = document.querySelectorAll(".section-header");
  for (let header of sectionHeaders) {
    header.style.transition = "transform ease 1s, opacity ease .5s";
  }
};
const processItemShow = (i) => {
  const processItems = document
    .getElementById("desktop-content-process-container")
    .getElementsByClassName("content-process");
  for (let item of processItems) {
    if (!item.classList.contains(`_${i + 1}`)) {
      item.style.display = "none";
    } else {
      item.style.display = "block";
    }
  }
};

const processItemEventListenerSetup = () => {
  document.querySelectorAll(".web-process-number.light").forEach((e, i) => {
    e.addEventListener("mouseenter", () => {
      processItemShow(i);
    });
  });
};

const setMobileHeights = () => {
  const windowInnerHeight = window.innerHeight;
  const elements = document.querySelectorAll(
    ".mobile-menu,.hero__image--mobile,.hero__image--tablet,.hero-section"
  );
  elements.forEach((el) => {
    el.style.height = `${windowInnerHeight}px`;
  });
};
const workButtonEventListenerSetup = () => {
  document.querySelectorAll(".work__button").forEach((e) => {
    e.addEventListener("click", () => {
      filterWorkImages(e.attributes["filter-by"].value);
    });
  });
};
const toggleMenu = () => {
  document.querySelector(".mobile-menu").classList.toggle("--in-view");
};
const toggleMenuEventListenerSetup = () => {
  const toggleButtons = document.querySelectorAll(
    ".hamburger-menu, .close-btn-wrap, .nav-item"
  );
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleMenu();
    });
  });
};

const headerEventListenerSetup = () => {
  window.addEventListener(
    "scroll",
    throttle(() => {
      const windowHeight = window.innerHeight;
      const sectionHeaders = document.querySelectorAll(".section-header");
      const sections = document.querySelectorAll(".section:not(.hero-section)");
      const headerFadeStartPosition = -20;

      const headerSlideStartPosition = 0.7;
      for (let header of sectionHeaders) {
        const headerCurrentPosition =
          header.getBoundingClientRect().y / windowHeight;
        if (
          headerCurrentPosition < headerSlideStartPosition &&
          !header.classList.contains("--in-view")
        ) {
          header.classList.add("--in-view");
        } else if (
          headerCurrentPosition > headerSlideStartPosition &&
          header.classList.contains("--in-view")
        ) {
          header.classList.remove("--in-view");
        }
      }
      for (let section of sections) {
        const sectionCurrentPosition = section.getBoundingClientRect().y;
        const sectionHeader = section.querySelector(".section-header");
        if (
          sectionCurrentPosition < headerFadeStartPosition &&
          !sectionHeader.classList.contains("--faded")
        ) {
          sectionHeader.classList.add("--faded");
        } else if (
          sectionCurrentPosition > headerFadeStartPosition &&
          sectionHeader.classList.contains("--faded")
        ) {
          sectionHeader.classList.remove("--faded");
        }
      }
    }, 300)
  );
};
setSectionHeaderOffset();

window.onload = () => {
  processItemEventListenerSetup();
  headerEventListenerSetup();
  setSectionHeaderTransitions();
  workButtonEventListenerSetup();
  setMobileHeights();
  toggleMenuEventListenerSetup();
};
