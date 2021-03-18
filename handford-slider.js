class Slider {
  constructor() {
    this.filterButtons = document.querySelectorAll(".slider__filter-button");
    this.slideContainer = document.querySelector(
      ".slider__slide-inner-container"
    );
    this.slides = document.querySelectorAll(".slider__slide");
    this.positionDisplayContainer = document.querySelector(
      ".slider__nav-display-container"
    );
    this.navPrevious = document.querySelector(".slider__nav-button.previous");
    this.navNext = document.querySelector(".slider__nav-button.next");
    this.navDisableOverlays = document.querySelectorAll(
      ".slider__nav-disable-overlay"
    );
    this.currentSlideIndex = 1;
    this.currentScrollPosition = 0;
    this.slideMargin = 20;
    this.events();
    this.filterSlides("all");
    this.setupPositionDisplayDots(this.slides.length);
  }
  events() {
    for (let button of this.filterButtons) {
      const filterBy = button.getAttribute("filter-by");
      button.addEventListener("click", () => {
        this.filterSlides(filterBy);
      });
    }
    this.navDisableOverlays.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    });
    this.navPrevious.addEventListener("click", () => {
      this.changeSlide(-1);
    });
    this.navNext.addEventListener("click", () => {
      this.changeSlide(1);
    });
  }
  setupPositionDisplayDots() {
    const { positionDisplayContainer } = this;
    positionDisplayContainer.innerHTML = "";
    let atLeastOneSlide = false;
    for (let i = 0; i < this.visibleSlides.length; i++) {
      const displayDot = document.createElement("div");
      displayDot.classList.add("slider__nav-display-dot");
      positionDisplayContainer.appendChild(displayDot);
      atLeastOneSlide = true;
    }
    if (atLeastOneSlide)
      positionDisplayContainer.firstElementChild.classList.add("current");
  }
  resize() {
    this.scrollPosition =
      (this.currentSlide - 1) *
      (this.slideContainer.getBoundingClientRect().width + this.slideMargin) *
      -1;
    this.moveToPosition(this.scrollPosition);
    console.log(this.scrollPosition);
  }
  filterSlides(category) {
    this.highlightSelectedCategory(category);
    const { slides } = this;
    let visibleSlides = [];
    if (category == "all") {
      for (let slide of slides) {
        slide.classList.remove("hidden");
        visibleSlides.push(slide);
      }
    } else {
      for (let slide of slides) {
        if (
          !slide
            .querySelector(".slider__album-name")
            .innerText.toLowerCase()
            .split(",")
            .map((str) => str.trim())
            .includes(category)
        ) {
          slide.classList.add("hidden");
        } else {
          slide.classList.remove("hidden");
          visibleSlides.push(slide);
        }
      }
    }

    this.currentSlide = 1;
    this.visibleSlides = visibleSlides;
    this.setupPositionDisplayDots();
    this.disableNavButton(this.currentSlide, visibleSlides.length);
    this.scrollPosition = 0;
    this.moveToPosition(this.scrollPosition);
  }

  highlightSelectedCategory(category) {
    this.filterButtons.forEach((button) => {
      if (category === button.getAttribute("filter-by")) {
        button.querySelector(".hover-show").classList.add("click-show");
      } else {
        button.querySelector(".hover-show").classList.remove("click-show");
      }
    });
  }

  changeSlide(direction) {
    if (
      !(this.currentSlide + direction > this.visibleSlides.length) &&
      !(this.currentSlide + direction <= 0)
    ) {
      const { slideContainer } = this;
      this.currentSlide += direction;

      this.scrollPosition +=
        (this.visibleSlides[this.currentSlide - 1].getBoundingClientRect()
          .width +
          this.slideMargin) *
        direction *
        -1;
      this.moveToPosition(this.scrollPosition);
      this.updatePositionDisplay();
      this.disableNavButton();
    }
  }

  moveToPosition(position) {
    this.slideContainer.style.transform = `translateX(${position}px)`;
  }

  updatePositionDisplay() {
    const positionDisplayDots = this.positionDisplayContainer.querySelectorAll(
      ".slider__nav-display-dot"
    );
    positionDisplayDots.forEach((positionDisplayDot, i) => {
      this.currentSlide == i + 1
        ? positionDisplayDot.classList.add("current")
        : positionDisplayDot.classList.remove("current");
    });
  }
  disableNavButton() {
    if (this.currentSlide <= 1) {
      this.navDisableOverlays[0].classList.add("show");
    } else {
      this.navDisableOverlays[0].classList.remove("show");
    }
    if (this.currentSlide >= this.visibleSlides.length) {
      this.navDisableOverlays[1].classList.add("show");
    } else {
      this.navDisableOverlays[1].classList.remove("show");
    }
  }
  set currentSlide(i) {
    this.currentSlideIndex = i;
  }
  get currentSlide() {
    return this.currentSlideIndex;
  }
  set scrollPosition(pos) {
    this.currentScrollPosition = pos;
  }
  get scrollPosition() {
    return this.currentScrollPosition;
  }
  set visibleSlides(visibleSlidesArr) {
    this.visibleSlidesArray = visibleSlidesArr;
  }
  get visibleSlides() {
    return this.visibleSlidesArray;
  }
}

const workSlider = new Slider();
function debounce(a, b, c) {
  var d;
  return function () {
    var e = this,
      f = arguments;
    clearTimeout(d),
      (d = setTimeout(function () {
        (d = null), c || a.apply(e, f);
      }, b)),
      c && !d && a.apply(e, f);
  };
}

window.addEventListener(
  "resize",
  debounce(() => {
    workSlider.resize();
  }, 100)
);
