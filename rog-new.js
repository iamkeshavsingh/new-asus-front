console.log("Vivobook.js loaded!");

// <!-- banner -->
document.addEventListener("DOMContentLoaded", function () {
  const slides = [
    {
      image: "assets/rog-hero-section.png",
      title: "ROG FLOW z13",
      subtitle: "Compact is the new impact",
      buttonText: "Buy Now",
    },
    {
      image: "assets/rog-hero-section.png",
      title: "ROG FLOW z13",
      subtitle: "Compact is the new impact",
      buttonText: "Buy Now",
    },
    {
      image: "assets/rog-hero-section.png",
      title: "ROG FLOW z13",
      subtitle: "Compact is the new impact",
      buttonText: "Buy Now",
    },
    {
      image: "assets/rog-hero-section.png",
      title: "ROG FLOW z13",
      subtitle: "Compact is the new impact",
      buttonText: "Buy Now",
    },
  ];

  let currentSlide = 0;
  let timerInterval;
  let progress = 0;
  const timerDuration = 4000;
  const timerStep = 50;

  // Select Elements
  const heroSection = document.querySelector(".hero-section");
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtitle = document.getElementById("heroSubtitle");
  const heroButtonText = document.querySelector(".btn-text");
  const leftBtn = document.querySelector(
    ".slider-controls .slider-btn:first-child",
  );
  const rightBtn = document.querySelector(
    ".slider-controls .slider-btn:nth-child(2)",
  );
  const slideCounter = document.querySelector(".slider-controls h6");

  // ===== SVG Timer =====
  const svgTimer = `
    <svg width="40" height="40" viewBox="0 0 40 40"
      style="position:absolute;top:0;left:0;pointer-events:none;">
      <circle cx="20" cy="20" r="19" fill="none"
        stroke="#4c5968" stroke-width="2"/>
      <circle class="timer-circle"
        cx="20" cy="20" r="19"
        fill="none"
        stroke="#F51928"
        stroke-width="2"
        stroke-dasharray="119.38"
        stroke-dashoffset="119.38"
        transform="rotate(-90 20 20)"
        stroke-linecap="round"/>
    </svg>
  `;

  rightBtn.style.position = "relative";
  rightBtn.insertAdjacentHTML("afterbegin", svgTimer);
  const timerCircle = rightBtn.querySelector(".timer-circle");

  // ===== Functions =====

  function updateTimerProgress() {
    const circumference = 119.38;
    const offset = circumference - (progress / 100) * circumference;
    timerCircle.style.strokeDashoffset = offset;
  }

  function updateSlide() {
    const slide = slides[currentSlide];

    heroSection.style.backgroundImage = `url('${slide.image}')`;
    heroSection.style.backgroundSize = "cover";
    heroSection.style.backgroundPosition = "center";

    heroTitle.textContent = slide.title;
    heroSubtitle.textContent = slide.subtitle;
    heroButtonText.textContent = slide.buttonText;

    slideCounter.textContent = `${currentSlide + 1}/${slides.length}`;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
    resetTimer();
  }

  function previousSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide();
    resetTimer();
  }

  function resetTimer() {
    progress = 0;
    updateTimerProgress();
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      progress += (timerStep / timerDuration) * 100;

      if (progress >= 100) {
        progress = 0;
        nextSlide();
      }

      updateTimerProgress();
    }, timerStep);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  // ===== Events =====
  leftBtn.addEventListener("click", () => {
    stopTimer();
    previousSlide();
    startTimer();
  });

  rightBtn.addEventListener("click", () => {
    stopTimer();
    nextSlide();
    startTimer();
  });

  // ===== Init =====
  updateSlide();
  startTimer();
});

// Shared by every mobile carousel that pads its real slide count so
// Swiper's loop mode has enough material to cycle through smoothly (see
// dealsSwiper below). Handles the two problems that padding otherwise
// causes:
//  1. After rebuilding slides, Swiper doesn't reliably land back on the
//     first real slide on its own — without an explicit reset, the active
//     slide/pagination can end up pointing at whichever duplicate happened
//     to be closest when the loop was recreated.
//  2. Swiper's pagination would otherwise render one bullet per real slide,
//     i.e. double (or triple) the actual number of distinct products, and
//     it has no idea two of those slides are duplicates of the same
//     product — so its automatic "active bullet" bookkeeping doesn't
//     track the logical (pre-padding) index either.
// `pagination.renderBullet` (passed in the swiper's own config) must
// truncate to `originalCount` bullets for part of this to work; this
// helper handles resetting position and keeping the active bullet in sync.
function setupMobileLoopPadding(swiper, originalSlidesHTML, repeatCount) {
  const originalCount = originalSlidesHTML.length;
  if (!originalCount) return;
  repeatCount = repeatCount || 2;
  // Tracks how many copies of the real slide set are currently in the DOM
  // (1 = untouched). Starts at 1 because that's the natural pre-sync state.
  let duplicated = 1;

  function syncActiveBullet() {
    const paginationParam = swiper.params.pagination;
    const el = paginationParam && paginationParam.el;
    const container = typeof el === "string" ? document.querySelector(el) : el;
    if (!container) return;
    const bullets = container.querySelectorAll(".swiper-pagination-bullet");
    const activeClass =
      (paginationParam && paginationParam.bulletActiveClass) ||
      "swiper-pagination-bullet-active";
    const logicalIndex = swiper.realIndex % originalCount;
    bullets.forEach((bullet, i) => {
      bullet.classList.toggle(activeClass, i === logicalIndex);
    });
  }

  function sync() {
    const isLoop = !!swiper.params.loop;
    // Swiper's loop mode needs roughly slidesPerView * 2 real slides to
    // cycle without a visible gap at the wrap-around point. If the current
    // breakpoint's slidesPerView (e.g. a wide-screen 3.4-up view) needs more
    // real slides than we have, pad up to a whole multiple of the original
    // set — on top of the existing centered-mobile padding, which some
    // sliders still rely on independently of this.
    // slidesPerView: "auto" (fixed-width cards, e.g. productSliderSwiper)
    // has no fixed number to read from params — ask Swiper how many
    // actually fit right now instead.
    let spv;
    if (swiper.params.slidesPerView === "auto") {
      spv =
        typeof swiper.slidesPerViewDynamic === "function"
          ? swiper.slidesPerViewDynamic("current", true)
          : 1;
    } else {
      spv =
        typeof swiper.params.slidesPerView === "number"
          ? swiper.params.slidesPerView
          : 1;
    }
    const neededForLoop = isLoop ? Math.ceil(spv) * 2 : 0;
    const loopTimes = neededForLoop
      ? Math.ceil(neededForLoop / originalCount)
      : 1;
    const centeredTimes = swiper.params.centeredSlides ? repeatCount : 1;
    const times = isLoop ? Math.max(loopTimes, centeredTimes) : 1;

    if (times !== duplicated) {
      if (swiper.params.loop) swiper.loopDestroy();
      swiper.removeAllSlides();
      const html = [];
      for (let i = 0; i < times; i++) html.push(...originalSlidesHTML);
      swiper.appendSlide(html);
      duplicated = times;
      if (swiper.params.loop) swiper.loopCreate();
      swiper.update();
    }
    // Always land back on the first real slide after any rebuild (or on
    // initial call) so the active card and pagination start in sync.
    if (swiper.params.loop) swiper.slideToLoop(0, 0);
    else swiper.slideTo(0, 0);
    syncActiveBullet();
  }

  swiper.on("breakpoint", sync);
  swiper.on("slideChange", syncActiveBullet);
  swiper.on("transitionEnd", syncActiveBullet);
  sync();
}

// Deals Swiper

// Captured before Swiper touches the DOM, so this is the real (non-cloned)
// slide markup — used to pad the mobile loop with duplicate cards without
// changing how many real slides desktop pages through, and without
// touching the .deal-card CSS at all.
const dealsTrack = document.querySelector(".dealsSwiper .swiper-wrapper");
const dealsOriginalSlidesHTML = dealsTrack
  ? Array.from(dealsTrack.children).map((el) => el.outerHTML)
  : [];

var dealsSwiper = new Swiper(".dealsSwiper", {
  slidesPerView: 4,
  spaceBetween: 12,
  watchOverflow: true,
  observer: true,
  observeParents: true,
  pagination: {
    el: ".dealSlider-pagination",
    clickable: true,
    renderBullet: (index, className) =>
      index < dealsOriginalSlidesHTML.length
        ? `<span class="${className}"></span>`
        : "",
  },
  navigation: {
    nextEl: ".carousel-arrow-right",
    prevEl: ".carousel-arrow-left",
  },

  breakpoints: {
    0: {
      // Same "active card centered" behaviour as index.html's deals
      // slider (see vivobook.js) — centeredSlides + loop, with the
      // padding helper below duplicating slides so the loop has enough
      // material to cycle through smoothly.
      slidesPerView: 1.2,
      spaceBetween: 16,
      centeredSlides: true,
      loop: true,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
    },
    400: {
      slidesPerView: 1.3,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    425: {
      slidesPerView: 1.4,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    450: {
      slidesPerView: 1.5,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    490: {
      slidesPerView: 1.6,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    520: {
      slidesPerView: 1.7,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    550: {
      slidesPerView: 1.8,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    582: {
      slidesPerView: 1.9,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    630: {
      slidesPerView: 2,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    666: {
      slidesPerView: 2.1,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    700: {
      slidesPerView: 2.2,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    800: {
      slidesPerView: 2.2,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    860: {
      slidesPerView: 2.4,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    930: {
      slidesPerView: 2.6,
      spaceBetween: 12,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    1060: {
      slidesPerView: 3,
      spaceBetween: 12,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 20,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
    },
    1400: {
      slidesPerView: 4,
      spaceBetween: 20,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
    },
  },
});
setupMobileLoopPadding(dealsSwiper, dealsOriginalSlidesHTML, 2);

// Compare Product checkbox — reliable select/deselect in deals swiper
document.querySelectorAll(".deals-section .form-check").forEach((formCheck) => {
  formCheck.classList.add("swiper-no-swiping");

  const checkbox = formCheck.querySelector(".compare-product-checkbox");
  if (!checkbox) return;

  formCheck.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  checkbox.addEventListener("change", () => {
    if (!checkbox.checked) {
      checkbox.removeAttribute("checked");
    }
  });
});

// ===== SHOP BY BUDGET SECTION - Carousel Script =====
const budgetCarousel = document.querySelector(".budget-products-track");
// [data-clone] excluded: those are the mobile-only peek-carousel loop
// fillers (duplicates of card 1/card 6, see rog-new.html) — they must not
// count towards the real card total, the indicator dots, or budgetCards[0]'s
// measured width (they're display:none on desktop/tablet, so measuring one
// there would read 0 and break every width calculation below).
const budgetCards = document.querySelectorAll(
  ".shop-by-budget-section .deal-card:not([data-clone])",
);
const budgetStartSpacer = document.querySelector(".budget-start-spacer");
const budgetLeftArrow = document.querySelector(".budget-carousel-arrow-left");
const budgetRightArrow = document.querySelector(".budget-carousel-arrow-right");
const budgetIndicatorsWrapper = document.querySelector(
  ".budget-indicators-wrapper",
);
const budgetProductsContainer = document.querySelector(
  ".budget-products-container",
);

function isBudgetMobilePeekView() {
  return window.matchMedia("(max-width: 767.98px)").matches;
}

let budgetCurrentIndex = 0;
const budgetTotalCards = budgetCards.length;
// Recomputed per breakpoint — mobile's CSS shrinks each card to 30-50% width
// so more of them peek into view at once than the desktop's fixed 4, and
// the indicator dots (one per scrollable page) have to track that or you
// either get stray dots that never light up or can't scroll far enough.
let budgetCardsToShow = 4;
let budgetMaxIndex = Math.max(0, budgetTotalCards - budgetCardsToShow);
let budgetIndicators = [];

// How many cards actually fit in the visible track right now.
function computeBudgetCardsToShow() {
  if (!budgetCarousel || !budgetCards.length) return budgetCardsToShow;
  const containerWidth = budgetCarousel.parentElement.clientWidth;
  const cardWidth = budgetCards[0].offsetWidth;
  if (!cardWidth) return budgetCardsToShow;
  const trackGapRaw = window.getComputedStyle(budgetCarousel).columnGap;
  const gap = parseFloat(trackGapRaw) || 0;
  const fit = Math.floor((containerWidth + gap) / (cardWidth + gap));
  return Math.min(Math.max(fit, 1), budgetTotalCards);
}

// Rebuilds the dots to match the current budgetMaxIndex (one dot per
// scrollable page, not one per card) and re-attaches their click handlers.
function buildBudgetIndicators() {
  if (!budgetIndicatorsWrapper) return;
  budgetIndicatorsWrapper.innerHTML = "";
  budgetIndicators = [];
  for (let i = 0; i <= budgetMaxIndex; i++) {
    const dot = document.createElement("span");
    dot.className =
      "budget-indicator" + (i === budgetCurrentIndex ? " active" : "");
    dot.addEventListener("click", () => {
      budgetCurrentIndex = Math.min(i, budgetMaxIndex);
      updateBudgetCarousel();
    });
    budgetIndicatorsWrapper.appendChild(dot);
    budgetIndicators.push(dot);
  }
}

// Re-measures cards-per-view and rebuilds the dots to match — call this
// before updateBudgetCarousel() on init and on every resize/breakpoint change.
function recomputeBudgetLayout() {
  budgetCardsToShow = computeBudgetCardsToShow();
  budgetMaxIndex = Math.max(0, budgetTotalCards - budgetCardsToShow);
  if (budgetCurrentIndex > budgetMaxIndex) {
    budgetCurrentIndex = budgetMaxIndex;
  }
  buildBudgetIndicators();
}

function updateBudgetCarousel() {
  const cardWidth = budgetCards[0].offsetWidth;
  const trackGapRaw = budgetCarousel
    ? window.getComputedStyle(budgetCarousel).columnGap
    : null;
  const gap = trackGapRaw ? parseFloat(trackGapRaw) || 12 : 12;
  // .budget-start-spacer sits before card 1 in the track, so once we've
  // scrolled past card 1 (index > 0) its width has to be added on top of
  // the normal per-card step, or every card after the first would land
  // exactly `spacerWidth` short of flush against the left edge.
  const spacerWidth = budgetStartSpacer
    ? budgetStartSpacer.getBoundingClientRect().width
    : 0;

  // Mobile shows one card at a time with a peek of its neighbours on both
  // sides, so it needs the active card actually centered — the desktop
  // "page by one, land flush against the left edge" math above collapses
  // the left peek to just the track's flex `gap` once index > 0.
  const isMobilePeekView = isBudgetMobilePeekView();
  let moveAmount;
  if (isMobilePeekView && budgetProductsContainer) {
    const containerWidth =
      budgetProductsContainer.getBoundingClientRect().width;
    // The mobile track is [clone-5][clone-6][card 1]...[card N][clone-1][clone-2]
    // (spacers are display:none here) — two clones on each end, not one, so
    // that whichever clone the loop wraps onto in loopBudgetCarousel() still
    // has a real peek on both its sides instead of blank space. A real
    // card's own position is always two steps in from the start — no
    // spacerWidth term needed, unlike the desktop branch below which still
    // has real spacers in its flow.
    const trackPosition = budgetCurrentIndex + 2;
    const leftEdge = trackPosition * (cardWidth + gap);
    moveAmount = leftEdge - (containerWidth - cardWidth) / 2;
  } else {
    moveAmount =
      budgetCurrentIndex === 0
        ? 0
        : spacerWidth + (cardWidth + gap) * budgetCurrentIndex;
  }

  budgetCarousel.style.transform = `translateX(-${moveAmount}px)`;

  // Update indicators
  budgetIndicators.forEach((indicator, idx) => {
    if (idx === budgetCurrentIndex) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });
}

// Mobile-only infinite loop: swiping past the last/first real card animates
// onto the matching clone card, then — once that animation finishes —
// silently (transition disabled for one frame) snaps the track onto the
// real card the clone was standing in for. The clone and the real card look
// identical, so the snap itself is invisible; the swipe just appears to
// wrap around forever. Same technique as index.html's Shop by Budget
// slider (see vivobook.js's loopBudgetCarousel).
function loopBudgetCarousel(direction) {
  if (!budgetCarousel || !budgetProductsContainer) return;

  const cardWidth = budgetCards[0].offsetWidth;
  const trackGapRaw = window.getComputedStyle(budgetCarousel).columnGap;
  const gap = trackGapRaw ? parseFloat(trackGapRaw) || 12 : 12;
  const containerWidth = budgetProductsContainer.getBoundingClientRect().width;

  // Track order is [clone-5(0)][clone-6(1)][card 1(2)]...[card N(N+1)][clone-1(N+2)][clone-2(N+3)].
  // Landing on clone-6 (prev) or clone-1 (next) — one step in from each end,
  // not the outermost clone — means there's always a real peek on BOTH
  // sides of whatever's centered: clone-6 peeks at clone-5 on its left and
  // card 1 on its right; clone-1 peeks at card N on its left and clone-2 on
  // its right. The outermost clones (clone-5, clone-2) exist purely to be
  // that peek — the loop never centers on them directly. `-${rawMoveAmount}`
  // isn't used unconditionally here in case rawMoveAmount ever comes out
  // negative (it stringifies as the invalid double-negative "--54.6px",
  // which CSS silently drops) — the sign is flipped explicitly first.
  const cloneTrackPosition = direction === "next" ? budgetTotalCards + 2 : 1;
  const rawMoveAmount =
    cloneTrackPosition * (cardWidth + gap) - (containerWidth - cardWidth) / 2;

  budgetCurrentIndex = direction === "next" ? 0 : budgetTotalCards - 1;
  budgetCarousel.style.transform =
    rawMoveAmount >= 0
      ? `translateX(-${rawMoveAmount}px)`
      : `translateX(${-rawMoveAmount}px)`;
  budgetIndicators.forEach((indicator, idx) => {
    indicator.classList.toggle("active", idx === budgetCurrentIndex);
  });

  function onTransitionEnd(event) {
    if (event.propertyName !== "transform") return;
    budgetCarousel.removeEventListener("transitionend", onTransitionEnd);
    budgetCarousel.classList.add("budget-no-transition");
    updateBudgetCarousel();
    // Force layout so the snap above lands before transitions come back on
    // (otherwise the "instant" jump would animate too).
    void budgetCarousel.offsetHeight;
    budgetCarousel.classList.remove("budget-no-transition");
  }
  budgetCarousel.addEventListener("transitionend", onTransitionEnd);
}

// Touch/Swipe support for mobile
let budgetTouchStartX = 0;
let budgetTouchEndX = 0;

if (budgetProductsContainer) {
  budgetProductsContainer.addEventListener(
    "touchstart",
    (e) => {
      budgetTouchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  budgetProductsContainer.addEventListener(
    "touchend",
    (e) => {
      budgetTouchEndX = e.changedTouches[0].screenX;
      handleBudgetSwipe();
    },
    { passive: true },
  );
}

function handleBudgetSwipe() {
  const swipeThreshold = 50; // Minimum distance for a swipe
  const diff = budgetTouchStartX - budgetTouchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swiped left - show next card
      // (bounded by budgetMaxIndex, same as the arrow buttons — budgetTotalCards - 1
      // let this run 3 pages past the last valid position, translating the
      // track past the final card and revealing empty trailing space, and
      // leaving budgetCurrentIndex out of range so no indicator matched it)
      if (budgetCurrentIndex < budgetMaxIndex) {
        budgetCurrentIndex++;
        updateBudgetCarousel();
      } else if (isBudgetMobilePeekView()) {
        loopBudgetCarousel("next");
      }
    } else {
      // Swiped right - show previous card
      if (budgetCurrentIndex > 0) {
        budgetCurrentIndex--;
        updateBudgetCarousel();
      } else if (isBudgetMobilePeekView()) {
        loopBudgetCarousel("prev");
      }
    }
  }

  // Keep arrow states in sync after a swipe, same as click/resize handlers
  budgetLeftArrow.style.opacity = budgetCurrentIndex === 0 ? "0.5" : "1";
  budgetLeftArrow.style.cursor =
    budgetCurrentIndex === 0 ? "not-allowed" : "pointer";
  budgetRightArrow.style.opacity =
    budgetCurrentIndex === budgetMaxIndex ? "0.5" : "1";
  budgetRightArrow.style.cursor =
    budgetCurrentIndex === budgetMaxIndex ? "not-allowed" : "pointer";
}

budgetLeftArrow.addEventListener("click", () => {
  // Move left (show previous cards) - only if not at start
  if (budgetCurrentIndex > 0) {
    budgetCurrentIndex--;
    updateBudgetCarousel();
  }
  // Disable arrow if at leftmost position
  budgetLeftArrow.style.opacity = budgetCurrentIndex === 0 ? "0.5" : "1";
  budgetLeftArrow.style.cursor =
    budgetCurrentIndex === 0 ? "not-allowed" : "pointer";
});

budgetRightArrow.addEventListener("click", () => {
  // Move right (show next cards) - only if not at end
  if (budgetCurrentIndex < budgetMaxIndex) {
    budgetCurrentIndex++;
    updateBudgetCarousel();
  }
  // Disable arrow if at rightmost position
  budgetRightArrow.style.opacity =
    budgetCurrentIndex === budgetMaxIndex ? "0.5" : "1";
  budgetRightArrow.style.cursor =
    budgetCurrentIndex === budgetMaxIndex ? "not-allowed" : "pointer";
});

// Initialize — measure cards-per-view for the current breakpoint, build the
// matching dots (their click handlers are attached inside buildBudgetIndicators),
// then position the track.
recomputeBudgetLayout();
updateBudgetCarousel();
// Set initial arrow states
budgetLeftArrow.style.opacity = "0.5";
budgetLeftArrow.style.cursor = "not-allowed";

// Handle window resize — a breakpoint change can change how many cards fit
// per view, so re-measure and rebuild the dots, not just reposition the track.
let budgetResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(budgetResizeTimer);
  budgetResizeTimer = setTimeout(() => {
    recomputeBudgetLayout();
    updateBudgetCarousel();
    // Update arrow states after resize
    budgetLeftArrow.style.opacity = budgetCurrentIndex === 0 ? "0.5" : "1";
    budgetLeftArrow.style.cursor =
      budgetCurrentIndex === 0 ? "not-allowed" : "pointer";
    budgetRightArrow.style.opacity =
      budgetCurrentIndex === budgetMaxIndex ? "0.5" : "1";
    budgetRightArrow.style.cursor =
      budgetCurrentIndex === budgetMaxIndex ? "not-allowed" : "pointer";
  }, 250);
});

// ===== SHOP BY BUDGET SECTION - Price Range Slider and Card Filtering =====
const priceRangeWrapper = document.querySelector(".price-range-wrapper");
const priceProgress = document.querySelector(".price-range-progress");
const minHandle = document.querySelector(".price-handle-min");
const maxHandle = document.querySelector(".price-handle-max");
const minTooltip = minHandle.querySelector(".price-tooltip");
const maxTooltip = maxHandle.querySelector(".price-tooltip");
const priceLabels = document.querySelectorAll(".price-label");

// Price range configuration
const MIN_PRICE = 20000;
const MAX_PRICE = 220000;
let minPrice = 40000;
let maxPrice = 80000;

// Extract price from each card and add data-price attribute. [data-clone]
// excluded — those are the mobile loop-filler duplicates (see rog-new.html)
// and must never have their own inline display style toggled by the price
// filter below, or it'd permanently override the CSS that hides them on
// desktop / shows them on mobile.
const allBudgetCards = document.querySelectorAll(
  ".shop-by-budget-section .deal-card:not([data-clone])",
);
allBudgetCards.forEach((card) => {
  // Find the price element (fs-5 fw-bold text-dark)
  const priceElement = card.querySelector(".fs-5.fw-bold.text-black");
  if (priceElement) {
    // Extract numeric price from text like "₹59,300*"
    const priceText = priceElement.textContent.trim();
    const priceNumber = parseInt(priceText.replace(/[₹,*\s]/g, ""));
    card.setAttribute("data-price", priceNumber);
  }
});

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function priceToPercent(price) {
  return ((price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
}

function percentToPrice(percent) {
  return Math.round(MIN_PRICE + (percent / 100) * (MAX_PRICE - MIN_PRICE));
}

function updatePriceRange() {
  const minPercent = priceToPercent(minPrice);
  const maxPercent = priceToPercent(maxPrice);

  // Update handle positions
  minHandle.style.left = `${minPercent}%`;
  maxHandle.style.left = `${maxPercent}%`;

  // Update progress bar
  priceProgress.style.left = `${minPercent}%`;
  priceProgress.style.width = `${maxPercent - minPercent}%`;

  // Update tooltips
  minTooltip.textContent = formatPrice(minPrice);
  maxTooltip.textContent = formatPrice(maxPrice);

  // Filter cards
  filterCardsByPrice();
}

function filterCardsByPrice() {
  let visibleCards = [];

  allBudgetCards.forEach((card) => {
    const cardPrice = parseInt(card.getAttribute("data-price"));

    if (cardPrice >= minPrice && cardPrice <= maxPrice) {
      card.style.display = "block";
      visibleCards.push(card);
    } else {
      card.style.display = "none";
    }
  });

  // Reset carousel to first position
  budgetCurrentIndex = 0;

  // Recalculate max index based on visible cards
  const visibleCount = visibleCards.length;
  const newMaxIndex = Math.max(0, visibleCount - budgetCardsToShow);

  // Update carousel — routed through updateBudgetCarousel() rather than a
  // hardcoded translateX(0px) so mobile's centered-peek math (which needs
  // to account for the leading clone card) still applies after a filter.
  if (budgetCarousel) {
    updateBudgetCarousel();
  }

  // Update arrow states
  if (budgetLeftArrow) {
    budgetLeftArrow.style.opacity = "0.5";
    budgetLeftArrow.style.cursor = "not-allowed";
  }

  if (budgetRightArrow) {
    budgetRightArrow.style.opacity = newMaxIndex > 0 ? "1" : "0.5";
    budgetRightArrow.style.cursor = newMaxIndex > 0 ? "pointer" : "not-allowed";
  }
}

// Dragging functionality for handles
let isDragging = false;
let currentHandle = null;

function startDrag(e, handle) {
  isDragging = true;
  currentHandle = handle;
  e.preventDefault();
}

function onDrag(e) {
  if (!isDragging || !currentHandle) return;

  const rect = priceRangeWrapper.getBoundingClientRect();
  const x =
    (e.type.includes("mouse") ? e.clientX : e.touches[0].clientX) - rect.left;
  let percent = (x / rect.width) * 100;
  percent = Math.max(0, Math.min(100, percent));

  const price = percentToPrice(percent);

  if (currentHandle === minHandle) {
    // Ensure min doesn't exceed max
    if (price < maxPrice - 5000) {
      minPrice = price;
    }
  } else if (currentHandle === maxHandle) {
    // Ensure max doesn't go below min
    if (price > minPrice + 5000) {
      maxPrice = price;
    }
  }

  updatePriceRange();
}

function stopDrag() {
  isDragging = false;
  currentHandle = null;
}

// Event listeners for dragging
minHandle.addEventListener("mousedown", (e) => startDrag(e, minHandle));
maxHandle.addEventListener("mousedown", (e) => startDrag(e, maxHandle));
minHandle.addEventListener("touchstart", (e) => startDrag(e, minHandle));
maxHandle.addEventListener("touchstart", (e) => startDrag(e, maxHandle));

document.addEventListener("mousemove", onDrag);
document.addEventListener("touchmove", onDrag);
document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);

// Initialize price range
updatePriceRange();

// ===== OFFERS CURATED FOR YOU SECTION - Carousel Script =====
const offersTrack = document.querySelector(".offers-carousel-track");
const offersSlides = Array.from(document.querySelectorAll(".offers-slide"));
const offersLeftArrow = document.querySelector(".offers-arrow-left");
const offersRightArrow = document.querySelector(".offers-arrow-right");
const offersIndicators = document.querySelectorAll(".offers-indicator");

let offersCurrentIndex = 1; // Start with center image (index 1)
const offersTotalSlides = offersSlides.length;

function updateOffersCarousel() {
  offersSlides.forEach((slide, index) => {
    slide.classList.remove("offers-slide-center");

    // Calculate position relative to current center (with wrapping)
    let position = index - offersCurrentIndex;

    // Handle wrapping for infinite loop
    if (position < -1) {
      position = position + offersTotalSlides;
    } else if (position > 1) {
      position = position - offersTotalSlides;
    }

    if (position === 0) {
      // Center slide
      slide.classList.add("offers-slide-center");
      slide.style.left = "50%";
      slide.style.right = "auto";
      slide.style.transform = "translateX(-50%) scale(1) translateZ(0)";
      slide.style.opacity = "1";
      slide.style.zIndex = "3";
    } else if (position === -1) {
      // Left slide
      slide.style.left = "5%";
      slide.style.right = "auto";
      slide.style.transform = "scale(0.7) translateZ(-100px)";
      slide.style.opacity = "0.6";
      slide.style.zIndex = "1";
    } else if (position === 1) {
      // Right slide
      slide.style.left = "auto";
      slide.style.right = "5%";
      slide.style.transform = "scale(0.7) translateZ(-100px)";
      slide.style.opacity = "0.6";
      slide.style.zIndex = "1";
    } else {
      // Hidden slides
      slide.style.opacity = "0";
      slide.style.zIndex = "0";
      slide.style.pointerEvents = "none";
    }
  });

  // Update indicators
  offersIndicators.forEach((indicator, idx) => {
    if (idx === offersCurrentIndex) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });
}

offersLeftArrow.addEventListener("click", () => {
  offersCurrentIndex =
    (offersCurrentIndex - 1 + offersTotalSlides) % offersTotalSlides;
  updateOffersCarousel();
});

offersRightArrow.addEventListener("click", () => {
  offersCurrentIndex = (offersCurrentIndex + 1) % offersTotalSlides;
  updateOffersCarousel();
});

// Indicator click handlers
offersIndicators.forEach((indicator, idx) => {
  indicator.addEventListener("click", () => {
    offersCurrentIndex = idx;
    updateOffersCarousel();
  });
});

// Initialize
updateOffersCarousel();

// ===== MOBILE: Offers Carousel Scroll-based Navigation =====
// if (window.innerWidth <= 991) {
//   const offersContainer = document.querySelector(".offers-carousel-container");

//   // Update indicators based on scroll position
//   offersContainer.addEventListener("scroll", () => {
//     const scrollLeft = offersContainer.scrollLeft;
//     const slideWidth = offersSlides[0].offsetWidth + 15; // width + gap
//     const currentIndex = Math.round(scrollLeft / slideWidth);

//     offersIndicators.forEach((indicator, idx) => {
//       if (idx === currentIndex) {
//         indicator.classList.add("active");
//       } else {
//         indicator.classList.remove("active");
//       }
//     });
//   });

//   // Make indicators clickable to scroll to specific card
//   offersIndicators.forEach((indicator, idx) => {
//     indicator.addEventListener("click", () => {
//       const slideWidth = offersSlides[0].offsetWidth + 15;
//       offersContainer.scrollTo({
//         left: slideWidth * idx,
//         behavior: "smooth",
//       });
//     });
//   });
// }

// ===== MOBILE SWIPER (below 991px only) =====
let offersSwiper = null;

if (window.innerWidth <= 991) {
  offersSwiper = new Swiper(".offersSwiper", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: -20,
    grabCursor: true,
    simulateTouch: true,
    loop: true,
    loopedSlides: 3,
    initialSlide: 0,
    pagination: {
      el: ".offers-swiper-pagination",
      clickable: true,
    },
    on: {
      beforeInit: function () {
        this.loopCreate(); // ← force clone creation before init
      },
    },
  });
}

// ===== DEALS FOR YOU SECTION - Toggle Buttons =====
// const dealsToggleBtns = document.querySelectorAll(".deals-toggle-btn");

// dealsToggleBtns.forEach((btn) => {
//   btn.addEventListener("click", function () {
//     // Remove active state from all buttons
//     dealsToggleBtns.forEach((b) => {
//       b.classList.remove("btn-primary", "active");
//       // b.classList.remove("btn-light");
//       b.classList.add("text-secondary");
//       b.style.backgroundColor = "transparent";
//     });

//     // Add active state to clicked button
//     this.classList.add("btn-primary", "active");
//     this.classList.remove("text-secondary");
//     this.style.backgroundColor = "";
//   });
// });

const dealsToggleBtns = document.querySelectorAll(".deals-toggle-btn");
dealsToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    dealsToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("text-secondary");
    this.style.backgroundColor = "";
  });
});

// ===== SHOP BY BUDGET SECTION - Toggle Buttons =====
const budgetToggleBtns = document.querySelectorAll(".budget-toggle-btn");
budgetToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    budgetToggleBtns.forEach((b) => {
      b.classList.remove("buget-btn-primary", "active");
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("buget-btn-primary", "active");
    this.classList.remove("text-secondary");
    this.style.backgroundColor = "";
  });
});

// ===== SHOP BY COLOR SECTION - Toggle Buttons =====
const colorToggleBtns = document.querySelectorAll(".color-toggle-btn");
colorToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    colorToggleBtns.forEach((b) => {
      b.classList.remove("buget-btn-primary", "active");
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("buget-btn-primary", "active");
    this.classList.remove("text-secondary");
    this.style.backgroundColor = "";
  });
});

// ===== Blog SECTION - Toggle Buttons =====
const blogToggleBtns = document.querySelectorAll(".blog-toggle-btn");
blogToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    blogToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("text-blog");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("text-blog");
    this.style.backgroundColor = "";
  });
});

// ===== OFFER SECTION - Toggle Buttons =====
const offerToggleBtns = document.querySelectorAll(".offer-toggle-btn");
offerToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    offerToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("text-blog");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("text-blog");
    this.style.backgroundColor = "";
  });
});

// ===== VIDEO SECTION - Toggle Buttons =====
const videoToggleBtns = document.querySelectorAll(".video-toggle-btn");
videoToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    videoToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("text-blog");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("text-blog");
    this.style.backgroundColor = "";
  });
});
// ===== FAQ SECTION - Toggle Buttons =====
const faqToggleBtns = document.querySelectorAll(".faq-toggle-btn");

faqToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    faqToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("btn-outline-secondary");
    });

    this.classList.add("btn-primary", "active");
    this.classList.remove("btn-outline-secondary");
  });
});

// ===== TESTIMONIALS SECTION - Toggle Buttons =====
const testimonialsToggleBtns = document.querySelectorAll(
  ".testimonials-toggle-btn",
);
testimonialsToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    testimonialsToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("text-blog");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("text-blog");
    this.style.backgroundColor = "";
  });
});

// Best Selling

// Captured before Swiper touches the DOM, so this is the real (non-cloned)
// slide markup — used to pad the mobile loop with duplicate cards without
// changing how many real slides desktop pages through.
const bestSellingTrack = document.querySelector(
  ".bestSellingSwiper .swiper-wrapper",
);
const bestSellingOriginalSlidesHTML = bestSellingTrack
  ? Array.from(bestSellingTrack.children).map((el) => el.outerHTML)
  : [];

const bestSellingSwiper = new Swiper(".bestSellingSwiper", {
  slidesPerView: 4,
  spaceBetween: 12,
  loop: false,
  watchOverflow: true,
  observer: true,
  observeParents: true,

  pagination: {
    el: ".bestSellingswiper-pagination",
    clickable: true,
    // Padding duplicates real slides for the mobile loop — without this,
    // pagination would render one bullet per duplicate too.
    renderBullet: (index, className) =>
      index < bestSellingOriginalSlidesHTML.length
        ? `<span class="${className}"></span>`
        : "",
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: {
      // Same "active card centered" behaviour as index.html's Best
      // Selling slider (see vivobook.js) — centeredSlides + loop, with
      // the padding helper below duplicating slides so the loop has
      // enough material to cycle through smoothly.
      slidesPerView: 1.3,
      spaceBetween: 16,
      centeredSlides: true,
      loop: true,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
    },
    576: {
      slidesPerView: 2,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    768: {
      slidesPerView: 2.5,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    1008: {
      slidesPerView: 3,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    1200: {
      slidesPerView: 3.2,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
    },
    1350: {
      slidesPerView: 4,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
    },
  },
});
setupMobileLoopPadding(bestSellingSwiper, bestSellingOriginalSlidesHTML, 2);

// ===== BEST SELLING SECTION - Toggle Buttons =====
const sellingToggleBtns = document.querySelectorAll(".selling-toggle-btn");
sellingToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    sellingToggleBtns.forEach((b) => {
      b.classList.remove("buget-btn-primary", "active");
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("buget-btn-primary", "active");
    this.classList.remove("text-secondary");
    this.style.backgroundColor = "";
  });
});

// ===== SHOP BY COLOR SECTION - Color Dots Radio Button Functionality =====
const colorDots = document.querySelectorAll(".color-dot");

colorDots.forEach((dot) => {
  dot.addEventListener("click", function () {
    // Remove selected class from all dots
    colorDots.forEach((d) => d.classList.remove("selected"));

    // Add selected class to clicked dot
    this.classList.add("selected");
  });
});

// Set first color dot as selected by default
if (colorDots.length > 0) {
  colorDots[4].classList.add("selected"); // Select the "Resolute Red" dot (5th one)
}

// ===== SMART CHOICES SECTION - Carousel Script (Drag + Indicator navigation) =====
const smartChoicesTrack = document.querySelector(".smart-choices-track");
const smartChoiceCards = document.querySelectorAll(".smart-choice-card");
const smartIndicators = document.querySelectorAll(
  "#smartChoicesIndicators .smart-indicator",
);
// There is no ".smart-choices-wrapper" element in the markup - the actual
// clipping container is this track's direct parent
// (".mx-auto.px-md-5.overflow-hidden"). Relying on the missing class made
// this fall back to `cardWidth`, so the carousel always thought only 1 card
// fit on screen - it slid one card at a time all the way to the end and
// left several empty card-widths of blank space after the last real card.
const smartChoicesWrapper = smartChoicesTrack
  ? smartChoicesTrack.parentElement
  : null;

let smartCurrentIndex = 0;
const smartTotalCards = smartChoiceCards.length;
const smartIndicatorsContainer = document.getElementById(
  "smartChoicesIndicators",
);

// Cached on every render so the drag handlers below know the current pixel
// offset, the furthest it's allowed to go, and whether there's anything to
// drag at all.
let smartMoveAmount = 0;
let smartMaxMoveAmount = 0;
let smartMaxIndex = 0;
let smartCanDrag = false;

function updateSmartChoicesCarousel(instant = false) {
  if (!smartChoicesTrack || !smartChoiceCards.length) return;

  const isMobile = window.innerWidth <= 991;
  const cardWidth = smartChoiceCards[0].offsetWidth;
  const gap = isMobile ? 20 : 12;
  const wrapperWidth = smartChoicesWrapper
    ? smartChoicesWrapper.offsetWidth
    : cardWidth;

  // How many cards actually fit in the wrapper at once (desktop can fit
  // more or fewer than a hardcoded number depending on screen width)
  const visibleCards = isMobile
    ? 1
    : Math.max(1, Math.floor((wrapperWidth + gap) / (cardWidth + gap)));
  const maxIndex = Math.max(0, smartTotalCards - visibleCards);
  const fitsWithoutSliding = maxIndex === 0;

  // 🔁 AUTO LOOP - wrap the index around instead of stopping at either end
  if (smartCurrentIndex > maxIndex) {
    smartCurrentIndex = 0;
    instant = true;
  }

  if (smartCurrentIndex < 0) {
    smartCurrentIndex = maxIndex;
    instant = true;
  }

  smartChoicesTrack.style.transition = instant ? "none" : "transform 0.4s ease";

  let moveAmount = 0;
  let maxMoveAmount = 0;

  if (fitsWithoutSliding) {
    // All cards fit on screen at once - no need to move, just center them
    smartChoicesTrack.style.justifyContent = "center";
  } else {
    smartChoicesTrack.style.justifyContent = "";

    if (isMobile) {
      // Center the active card in the wrapper so neighbors peek on both
      // sides, but clamp at the ends so there's no empty space to the
      // left of the first card or the right of the last card
      const trackWidth = smartChoicesTrack.scrollWidth;
      const maxScroll = Math.max(0, trackWidth - wrapperWidth);
      const rawMove =
        (cardWidth + gap) * smartCurrentIndex +
        cardWidth / 2 -
        wrapperWidth / 2;
      moveAmount = Math.min(maxScroll, Math.max(0, rawMove));
      maxMoveAmount = maxScroll;
    } else {
      moveAmount = (cardWidth + gap) * smartCurrentIndex;
      maxMoveAmount = (cardWidth + gap) * maxIndex;
    }
  }

  smartChoicesTrack.style.transform = `translateX(${-moveAmount}px)`;

  // Re-enable animation after instant jump
  if (instant) {
    requestAnimationFrame(() => {
      smartChoicesTrack.style.transition = "transform 0.4s ease";
    });
  }

  // Mobile active card
  smartChoiceCards.forEach((card, idx) => {
    card.classList.toggle("active", isMobile && idx === smartCurrentIndex);
  });

  // Indicators - only needed when there are more cards than fit on screen
  if (smartIndicatorsContainer) {
    smartIndicatorsContainer.style.display = fitsWithoutSliding ? "none" : "";
  }

  smartIndicators.forEach((indicator, idx) => {
    // There are always 6 dots in the markup, but when multiple cards are
    // visible at once (desktop) fewer than 6 index positions are actually
    // reachable. Hide the unreachable trailing dots so every visible dot
    // maps to exactly one real position - same 1:1 behavior mobile has.
    indicator.style.display = idx > maxIndex ? "none" : "";
    indicator.classList.toggle("active", idx === smartCurrentIndex);
  });

  smartMoveAmount = moveAmount;
  smartMaxMoveAmount = maxMoveAmount;
  smartMaxIndex = maxIndex;
  smartCanDrag = !fitsWithoutSliding;
}

// ---- Drag support (mouse + touch + pen, unified via Pointer Events) ----
// Previously only "touchstart"/"touchend" were wired up, so nothing ever
// listened for a mouse drag, and even on touch the card only reacted after
// release instead of following the finger while dragging.
let smartIsDragging = false;
let smartDragStartX = 0;
let smartDragStartMove = 0;
let smartDragDeltaX = 0;

function smartDragStart(e) {
  if (!smartCanDrag) return;
  smartIsDragging = true;
  smartDragStartX = e.clientX;
  smartDragStartMove = smartMoveAmount;
  smartDragDeltaX = 0;
  smartChoicesTrack.style.transition = "none";
  smartChoicesTrack.style.cursor = "grabbing";
  smartChoicesTrack.setPointerCapture?.(e.pointerId);
}

function smartDragMove(e) {
  if (!smartIsDragging) return;
  smartDragDeltaX = e.clientX - smartDragStartX;
  // Clamp so overdragging past the first/last card can't pull the track
  // past its own content and expose empty space behind it.
  const target = Math.min(
    smartMaxMoveAmount,
    Math.max(0, smartDragStartMove - smartDragDeltaX),
  );
  smartChoicesTrack.style.transform = `translateX(${-target}px)`;
}

function smartDragEnd() {
  if (!smartIsDragging) return;
  smartIsDragging = false;
  smartChoicesTrack.style.cursor = "grab";

  const isMobile = window.innerWidth <= 991;
  const cardWidth = smartChoiceCards[0].offsetWidth;
  const gap = isMobile ? 20 : 12;
  const threshold = (cardWidth + gap) / 4;

  if (smartDragDeltaX <= -threshold) {
    // Dragged left - show next card (wraps past the last card via AUTO LOOP)
    smartCurrentIndex++;
  } else if (smartDragDeltaX >= threshold) {
    // Dragged right - show previous card (wraps past the first card via AUTO LOOP)
    smartCurrentIndex--;
  }
  updateSmartChoicesCarousel();
  smartDragDeltaX = 0;
}

if (smartChoicesTrack) {
  smartChoicesTrack.style.touchAction = "pan-y";
  smartChoicesTrack.style.cursor = "grab";
  smartChoicesTrack.addEventListener("pointerdown", smartDragStart);
  smartChoicesTrack.addEventListener("pointermove", smartDragMove);
  smartChoicesTrack.addEventListener("pointerup", smartDragEnd);
  smartChoicesTrack.addEventListener("pointercancel", smartDragEnd);
  smartChoicesTrack.addEventListener("dragstart", (e) => e.preventDefault());
}

// Indicator click handlers - clamp to the furthest reachable position so
// clicking a trailing dot shows the last window of cards instead of
// tripping the AUTO LOOP reset and snapping straight back to slide 1
smartIndicators.forEach((indicator) => {
  indicator.addEventListener("click", () => {
    const index = parseInt(indicator.getAttribute("data-index"));
    smartCurrentIndex = Math.min(index, smartMaxIndex);
    updateSmartChoicesCarousel();
  });
});

// Initialize
updateSmartChoicesCarousel();

// Handle window resize
let smartResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(smartResizeTimer);
  smartResizeTimer = setTimeout(() => {
    updateSmartChoicesCarousel();
  }, 250);
});

// ===== VIDEOS & MEDIA SECTION - Toggle Buttons =====
const videosToggleBtns = document.querySelectorAll(".videos-toggle-btn");
videosToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    videosToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("btn-light");
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("btn-light");
  });
});

// ===== BLOGS & UPDATES SECTION - Carousel Script =====
const blogsTrack = document.querySelector(".blogs-track");
const blogCards = document.querySelectorAll(".blog-card");
const blogsPrevBtn = document.getElementById("blogsPrev");
const blogsNextBtn = document.getElementById("blogsNext");
const blogIndicators = document.querySelectorAll(".blog-indicator");

let blogsCurrentIndex = 0;
const blogsTotalCards = blogCards.length;
const blogsCardsToShow = 4; // Number of cards visible at once
const blogsMaxIndex = Math.max(0, blogsTotalCards - blogsCardsToShow);

function updateBlogsCarousel() {
  const cardWidth = blogCards[0].offsetWidth;
  const gap = 24; // Updated gap
  const moveAmount = (cardWidth + gap) * blogsCurrentIndex;

  blogsTrack.style.transform = `translateX(-${moveAmount}px)`;

  // Update indicators
  blogIndicators.forEach((indicator, idx) => {
    if (idx === blogsCurrentIndex) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });

  // Update arrow states
  blogsPrevBtn.style.opacity = blogsCurrentIndex === 0 ? "0.5" : "1";
  blogsPrevBtn.style.cursor =
    blogsCurrentIndex === 0 ? "not-allowed" : "pointer";
  blogsPrevBtn.disabled = blogsCurrentIndex === 0;

  blogsNextBtn.style.opacity =
    blogsCurrentIndex === blogsMaxIndex ? "0.5" : "1";
  blogsNextBtn.style.cursor =
    blogsCurrentIndex === blogsMaxIndex ? "not-allowed" : "pointer";
  blogsNextBtn.disabled = blogsCurrentIndex === blogsMaxIndex;
}

blogsPrevBtn.addEventListener("click", () => {
  if (blogsCurrentIndex > 0) {
    blogsCurrentIndex--;
    updateBlogsCarousel();
  }
});

blogsNextBtn.addEventListener("click", () => {
  if (blogsCurrentIndex < blogsMaxIndex) {
    blogsCurrentIndex++;
    updateBlogsCarousel();
  }
});

// Indicator click handlers
blogIndicators.forEach((indicator, idx) => {
  indicator.addEventListener("click", () => {
    const index = parseInt(indicator.getAttribute("data-index"));
    if (index <= blogsMaxIndex) {
      blogsCurrentIndex = index;
      updateBlogsCarousel();
    }
  });
});

// Initialize
updateBlogsCarousel();

// Handle window resize
let blogsResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(blogsResizeTimer);
  blogsResizeTimer = setTimeout(() => {
    updateBlogsCarousel();
  }, 250);
});

// ===== BLOGS & UPDATES SECTION - Toggle Buttons =====
const blogsToggleBtns = document.querySelectorAll(".blogs-toggle-btn");
blogsToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    // Remove active state from all buttons
    blogsToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.style.backgroundColor = "transparent";
      b.style.color = "#6c757d";
    });

    // Add active state to clicked button
    this.classList.add("btn-primary", "active");
    this.style.backgroundColor = "";
    this.style.color = "";
  });
});

// ===== FIXED NAVIGATION DOTS (6 dots, each tracking ~4 sections) =====
const navDots = document.querySelectorAll(".nav-dot");
const allSections = document.querySelectorAll("section");

// Group sections: each dot represents approximately 4 sections
const sectionsPerDot = 4;
const totalDots = 6;

function updateNavDots() {
  const scrollPosition = window.scrollY + window.innerHeight / 3;
  const totalSections = allSections.length;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Check if we're at the bottom of the page
  if (window.scrollY + windowHeight >= documentHeight - 50) {
    // Activate the last dot when at bottom
    navDots.forEach((dot, index) => {
      if (index === totalDots - 1) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
    return;
  }

  let activeIndex = 0;

  // Calculate which dot should be active based on scroll position
  allSections.forEach((section, sectionIndex) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      // Determine which dot group this section belongs to
      activeIndex = Math.floor(sectionIndex / sectionsPerDot);
      // Make sure we don't exceed the number of dots
      activeIndex = Math.min(activeIndex, totalDots - 1);
    }
  });

  // Update active dot
  navDots.forEach((dot, index) => {
    if (index === activeIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Update dots on scroll
window.addEventListener("scroll", updateNavDots);

// Click on dots to scroll to the first section of that group
navDots.forEach((dot, dotIndex) => {
  dot.addEventListener("click", () => {
    const targetSectionIndex = dotIndex * sectionsPerDot;
    if (allSections[targetSectionIndex]) {
      allSections[targetSectionIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Initialize
updateNavDots();
// Workspace section - Dot click functionality
document.addEventListener("DOMContentLoaded", function () {
  // Wait for workspace component to load
  setTimeout(() => {
    const dotBoxes = document.querySelectorAll(".dot-box");

    dotBoxes.forEach((dotBox) => {
      const dot = dotBox.querySelector(".dot");

      // Click functionality
      dotBox.addEventListener("click", function (e) {
        e.stopPropagation();

        // Toggle active state
        const isActive = dotBox.classList.contains("active");

        // Remove active from all dots
        dotBoxes.forEach((box) => box.classList.remove("active"));

        // Toggle current dot
        if (!isActive) {
          dotBox.classList.add("active");
        }
      });

      // Close card when clicking outside
      document.addEventListener("click", function (e) {
        if (!dotBox.contains(e.target)) {
          dotBox.classList.remove("active");
        }
      });
    });
  }, 500);
});

// ===== PRODUCT SLIDER SECTION - Toggle Buttons =====
const productToggleBtns = document.querySelectorAll(".product-toggle-btn");
productToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    // Remove active state from all buttons
    productToggleBtns.forEach((b) => {
      b.classList.remove("btn-light", "active");
      b.style.backgroundColor = "transparent";
      b.style.color = "#fff";
    });

    // Add active state to clicked button
    this.classList.add("btn-light", "active");
    this.style.backgroundColor = "";
    this.style.color = "";
  });
});

// ===== SHOP BY COLOR SECTION  =====

// Color dot click functionality
// document.addEventListener("DOMContentLoaded", function () {
//   const colorDotWrappers = document.querySelectorAll(".color-dot-wrapper");

//   colorDotWrappers.forEach((wrapper) => {
//     const colorDot = wrapper.querySelector(".color-dot");
//     const colorName = wrapper.querySelector(".color-name");

//     console.log(colorDot, colorName);

//     // if (colorDot && colorName) {
//     colorDot.addEventListener("click", function () {
//       // Remove active class from all color names
//       document.querySelectorAll(".color-name").forEach((name) => {
//         name.classList.remove("active");
//       });

//       // Add active class to clicked color name
//       colorName.classList.add("active");
//     });
//     // }
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const colorDotWrappers = document.querySelectorAll(".color-dot-wrapper");

//   colorDotWrappers.forEach((wrapper) => {
//     wrapper.addEventListener("mouseenter", function () {
//       // Remove active class from all
//       document.querySelectorAll(".color-name").forEach((name) => {
//         name.classList.remove("active");
//       });

//       // Add active to hovered wrapper text
//       wrapper.querySelector(".color-name").classList.add("active");
//     });
//   });
// });

// - Carousel Script

// ===== PROCESSOR SECTION - Now using Swiper.js =====
// See productSlider.js for the Swiper configuration (myProcessorSwiper)
// Old carousel code removed - now using Swiper for better mobile experience

// Placeholder for window resize (keeping structure)
let processorResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(processorResizeTimer);
  processorResizeTimer = setTimeout(() => {
    // Swiper handles resize automatically
  }, 250);
});

// ===== GPU SECTION - Now using Swiper.js =====
// See productSlider.js for the Swiper configuration (myGpuSwiper)

// ===== FOOTER ACCORDION FOR MOBILE =====
if (window.innerWidth <= 991) {
  const footerCategories = document.querySelectorAll(".footer-cat-title");

  footerCategories.forEach((category) => {
    category.addEventListener("click", function () {
      const links = this.nextElementSibling;

      // Toggle active class
      this.classList.toggle("active");

      // Toggle show class on links
      if (links && links.classList.contains("footer-links")) {
        links.classList.toggle("show");
      }
    });
  });
}

// Choose Offer slider

// Captured before Swiper touches the DOM, so this is the real (non-cloned)
// slide markup — used to pad the mobile loop with duplicate cards without
// changing how many real slides desktop pages through.
const chooseOffersTrack = document.querySelector(
  ".choose-offers-swiper .swiper-wrapper",
);
const chooseOffersOriginalSlidesHTML = chooseOffersTrack
  ? Array.from(chooseOffersTrack.children).map((el) => el.outerHTML)
  : [];

var chooseOffersSwiper = new Swiper(".choose-offers-swiper", {
  slidesPerView: 1.2,
  spaceBetween: 8,
  watchOverflow: true,
  observer: true,
  observeParents: true,

  pagination: {
    el: ".chooseofferSlider-pagination",
    clickable: true,
    renderBullet: (index, className) =>
      index < chooseOffersOriginalSlidesHTML.length
        ? `<span class="${className}"></span>`
        : "",
  },
  breakpoints: {
    320: {
      // Same "active card centered" behaviour as index.html's Choose
      // Offers slider (see vivobook.js) — centeredSlides + loop, with the
      // padding helper below duplicating slides so the loop has enough
      // material to cycle through smoothly.
      slidesPerView: 1.3,
      spaceBetween: 16,
      centeredSlides: true,
      loop: true,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
    },
    500: {
      slidesPerView: 2,
      spaceBetween: 8,
      centeredSlides: false,
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 8,
      centeredSlides: false,
    },

    1024: {
      slidesPerView: 3,
      spaceBetween: 8,
      centeredSlides: false,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 8,
      centeredSlides: false,
    },
  },
});

setupMobileLoopPadding(chooseOffersSwiper, chooseOffersOriginalSlidesHTML, 2);

// Shop by color

// Captured before Swiper touches the DOM, so this is the real (non-cloned)
// slide markup — used to pad the mobile loop with duplicate cards without
// changing how many real slides desktop pages through.
const colorTrack = document.querySelector(".colorSwiper .swiper-wrapper");
const colorOriginalSlidesHTML = colorTrack
  ? Array.from(colorTrack.children).map((el) => el.outerHTML)
  : [];

const colorSwiper = new Swiper(".colorSwiper", {
  slidesPerView: 4,
  spaceBetween: 10,
  speed: 600,
  watchOverflow: true,
  observer: true,
  observeParents: true,

  navigation: {
    nextEl: ".color-carousel-arrow-right",
    prevEl: ".color-carousel-arrow-left",
  },
  pagination: {
    el: ".color-pagination",
    clickable: true,
    renderBullet: (index, className) =>
      index < colorOriginalSlidesHTML.length
        ? `<span class="${className}"></span>`
        : "",
  },

  breakpoints: {
    320: {
      // Same "active card centered" behaviour as index.html's Shop by
      // Color slider (see vivobook.js) — centeredSlides + loop, with the
      // padding helper below duplicating slides so the loop has enough
      // material to cycle through smoothly.
      slidesPerView: 1.3,
      spaceBetween: 16,
      centeredSlides: true,
      loop: true,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
    },

    576: {
      slidesPerView: 2,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },

    768: {
      slidesPerView: 3,
      centeredSlides: false,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },

    1200: {
      slidesPerView: 4,
      spaceBetween: 10,
      centeredSlides: false,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
    },
  },
});
setupMobileLoopPadding(colorSwiper, colorOriginalSlidesHTML, 2);

// More Colloection

const collectionsSwiper = new Swiper(".collectionsSwiper", {
  slidesPerView: 6,
  spaceBetween: 20,
  speed: 600,
  initialSlide: 1,

  pagination: {
    el: ".collection-pagination",
    clickable: true,
  },

  breakpoints: {
    320: {
      slidesPerView: 3,
      spaceBetween: 1,
      centeredSlides: false,
    },

    576: {
      slidesPerView: 3,
      centeredSlides: false,
    },

    768: {
      slidesPerView: 5,
    },

    992: {
      slidesPerView: 5,
    },

    1200: {
      slidesPerView: 7,
      spaceBetween: 20,
    },
  },
});

// New Arrivals (mobile) - scale down side cards, keep centered card full
// size, and loop seamlessly using the [data-clone] slides in rog-new.html
// (duplicates of the real first/last slide): once the user scrolls onto a
// clone and settles there, silently jump (no smooth scroll) onto the real
// slide it duplicates — invisible since the two look identical. Same trick
// as index.html's new-arrivals slider (see vivobook.js).
(function () {
  const wrapper = document.querySelector(".new-arrivals-image-wrapper");
  if (!wrapper) return;

  const slides = wrapper.querySelectorAll(".arrival-slide");
  if (!slides.length) return;

  const realSlides = wrapper.querySelectorAll(
    ".arrival-slide:not([data-clone])",
  );

  // Scale + content reveal used to be driven by the "is-center" class alone,
  // which only flips once a slide crosses the exact center — the CSS
  // transition then had to catch up on its own fixed clock, independent of
  // however fast the user was actually scrolling. That's what made it feel
  // like it was waiting for the slide to land before reacting. Driving both
  // continuously off each slide's live distance-from-center (recomputed
  // every scroll frame) ties them directly to the scroll position instead,
  // so they move exactly in step with the finger/scroll — see the
  // `transition: none` on these properties in rog-new.css, which is what
  // makes inline style updates apply with zero lag instead of easing
  // behind each frame.
  const MIN_SCALE = 0.92;
  const MAX_SCALE = 1;
  // Below this, opacity is already ~0 (imperceptible), so flipping
  // pointer-events off here doesn't read as a pop.
  const VISIBLE_THRESHOLD = 0.05;

  let ticking = false;
  let settleTimer = null;

  function updateCenterSlide() {
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
    const gap = parseFloat(window.getComputedStyle(wrapper).columnGap) || 16;

    let closestSlide = null;
    let closestDistance = Infinity;

    slides.forEach((slide) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(slideCenter - wrapperCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSlide = slide;
      }

      // 1 right at the wrapper's center, fading linearly to 0 by the time
      // the slide is a full step (its own width + the gap) away — i.e. by
      // the point the neighbouring slide has taken over as centered.
      const step = rect.width + gap;
      const progress = Math.max(0, Math.min(1, 1 - distance / step));

      slide.style.transform = `scale(${MIN_SCALE + (MAX_SCALE - MIN_SCALE) * progress})`;

      const content = slide.querySelector(".content-div-arrival");
      if (content) {
        content.style.opacity = String(progress);
        content.style.pointerEvents =
          progress > VISIBLE_THRESHOLD ? "auto" : "none";
      }

      slide.classList.remove("is-center");
    });

    if (closestSlide) closestSlide.classList.add("is-center");
    ticking = false;
  }

  function jumpTo(slide) {
    const imageDiv = slide.querySelector(".image-div");
    if (!imageDiv) return;
    imageDiv.scrollIntoView({
      behavior: "instant",
      inline: "center",
      block: "nearest",
    });
    updateCenterSlide();
  }

  // Scroll-snap has no equivalent of a JS transform's transitionend, so
  // "settled" is detected with a quiet-period debounce instead: 150ms with
  // no further scroll events means the snap has finished.
  function scheduleSettleCheck() {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      const current = wrapper.querySelector(".arrival-slide.is-center");
      if (!current || !realSlides.length) return;

      if (current.dataset.clone === "last") {
        jumpTo(realSlides[realSlides.length - 1]);
      } else if (current.dataset.clone === "first") {
        jumpTo(realSlides[0]);
      }
    }, 150);
  }

  wrapper.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateCenterSlide);
      ticking = true;
    }
    scheduleSettleCheck();
  });

  window.addEventListener("resize", updateCenterSlide);

  // The leading clone is the first element in scroll order — without this,
  // the page would open centered on it instead of the real first slide.
  if (realSlides.length) jumpTo(realSlides[0]);
  updateCenterSlide();
})();
