// Thumbnail Swiper
var thumbsSwiper = new Swiper(".mySwiper", {
  spaceBetween: 10,
  slidesPerView: 3,

  watchSlidesProgress: true,
  pagination: { el: ".swiper-pagination", clickable: true },
});

// Main Image Swiper
var mainSwiper = new Swiper(".mySwiper2", {
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next-new",
    prevEl: ".swiper-button-prev-new",
  },
  thumbs: {
    swiper: thumbsSwiper,
  },
});

// Content Swiper (sync with mainSwiper)
var contentSwiper = new Swiper(".mySwiperContent", {
  spaceBetween: 10,
  allowTouchMove: false,
});

// Sync both ways
mainSwiper.controller.control = contentSwiper;
contentSwiper.controller.control = mainSwiper;

// ⭐ IMPORTANT FIX — update content slider when thumbnail is clicked
mainSwiper.on("slideChange", function () {
  contentSwiper.slideTo(mainSwiper.activeIndex);
});

var swiper = new Swiper(".myPopularSwiper", {
  slidesPerView: 4,
  spaceBetween: 30,
  loop: true,
  watchOverflow: true,
  observer: true,
  observeParents: true,

  pagination: {
    el: ".swiper-pagination-pop",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next-pop",
    prevEl: ".swiper-button-prev-pop",
  },

  breakpoints: {
    0: {
      slidesPerView: 1.2,
      spaceBetween: 20,
      centeredSlides: true,
    },
    576: {
      slidesPerView: 2.2,
      centeredSlides: false,
    },
    800: {
      slidesPerView: 2.5,
      centeredSlides: false,
    },
    1000: {
      slidesPerView: 3,
      centeredSlides: false,
    },
    1200: {
      slidesPerView: 4,
      centeredSlides: false,
    },
  },
});
window.addEventListener("resize", () => {
  if (swiper && swiper.loopedSlides) {
    swiper.loopDestroy();
    swiper.loopCreate();
    swiper.update();
  }
});
var productSlider = new Swiper(".productSliderSwiper", {
  slidesPerView: 2,
  spaceBetween: 20,
  loop: true,
  pagination: {
    el: ".product-slider-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".product-slider-next-top",
    prevEl: ".product-slider-prev-top",
  },

  // Responsive Breakpoints
  breakpoints: {
    0: {
      slidesPerView: 1.2,
      spaceBetween: 15,
      centeredSlides: false,
    },
    768: {
      slidesPerView: 1.5,
      spaceBetween: 15,
    },
    992: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
  },
});

var processorSwiper = new Swiper(".myProcessorSwiper", {
  slidesPerView: 4,
  spaceBetween: 30,
  loop: false,

  observer: true,
  observeParents: true,
  watchOverflow: true,
  watchSlidesProgress: true,

  pagination: {
    el: ".swiper-pagination-processor",
    clickable: true,
  },

  breakpoints: {
    0: {
      slidesPerView: 2,
      spaceBetween: 8,
      allowTouchMove: true,
    },
    576: {
      slidesPerView: 2.5,
      spaceBetween: 20,
      allowTouchMove: true,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 25,
      allowTouchMove: true,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 62.42,
      allowTouchMove: false,
    },
  },
});
let processorTimer;

window.addEventListener("resize", () => {
  clearTimeout(processorTimer);

  processorTimer = setTimeout(() => {
    if (processorSwiper) {
      processorSwiper.update();
      processorSwiper.slideTo(0, 0); // reset position
    }
  }, 300);
});

var gpuSwiper = new Swiper(".myGpuSwiper", {
  slidesPerView: 8,
  spaceBetween: 20,
  loop: false,

  // observer: true,
  // observeParents: true,
  // watchOverflow: true,
  // watchSlidesProgress: true,

  pagination: {
    el: ".swiper-pagination-gpu",
    clickable: true,
  },

  breakpoints: {
    0: {
      slidesPerView: 4,
      spaceBetween: 15,
    },
    576: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 25,
    },
    900: {
      slidesPerView: 4,
      spaceBetween: 25,
    },
    1024: {
      slidesPerView: 5.5,
      spaceBetween: 25,
    },
    1200: {
      slidesPerView: 7,
      spaceBetween: 20,
      allowTouchMove: false,
    },
    1400: {
      slidesPerView: 8,
      spaceBetween: 20,
    },
  },
});
let gpuResizeTimer;

document.querySelectorAll(".myGpuSwiper .swiper-slide").forEach((slide) => {
  slide.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });
});

window.addEventListener("resize", () => {
  clearTimeout(gpuResizeTimer);

  gpuResizeTimer = setTimeout(() => {
    if (gpuSwiper) {
      gpuSwiper.update();
      gpuSwiper.slideTo(0, 0);
    }
  }, 300);
});

var smartChoicesSwiper = new Swiper(".mySmartChoicesSwiper", {
  slidesPerView: 5,
  spaceBetween: 12,
  loop: false,
  pagination: {
    el: ".swiper-pagination-smart-choices",
    clickable: true,
  },

  // Responsive Breakpoints
  breakpoints: {
    0: {
      slidesPerView: 1.2,
      spaceBetween: 20,
      centeredSlides: true,
      pagination: {
        el: ".swiper-pagination-smart-choices",
        clickable: true,
      },
    },
    576: {
      slidesPerView: 2.2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    992: {
      slidesPerView: 5,
      spaceBetween: 12,
      pagination: false,
      allowTouchMove: false,
      simulateTouch: false,
    },
  },
});
