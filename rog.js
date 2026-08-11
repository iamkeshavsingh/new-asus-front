console.log("ROG.js loaded!");

// Array of background images
const heroImages = [
  // 'assets/Hero-section-image-2.png',
  // 'assets/Hero-section-image.png',
  // 'assets/Hero-section-image-2.png',
  // 'assets/Hero-section-image-2.png'
  "assets/rog-hero-section.png",
  "assets/rog-hero-section.png",
  "assets/rog-hero-section.png",
  "assets/rog-hero-section.png",
];

// Current slide index
let currentSlide = 0;
let timerInterval;
let progress = 0;
const timerDuration = 4000; // 4 seconds per slide
const timerStep = 50; // Update every 50ms

// Get elements
const heroSection = document.querySelector(".hero-section");
const leftBtn = document.querySelector(
  ".slider-controls .slider-btn:first-child",
);
const rightBtn = document.querySelector(
  ".slider-controls .slider-btn:nth-child(2)",
);
const slideCounter = document.querySelector(".slider-controls h6");

// Add SVG circular timer to next button (on the border)
const svgTimer = `
  <svg width="40" height="40" viewBox="0 0 40 40" style="position: absolute; top: 0; left: 0; pointer-events: none;">
    <circle cx="20" cy="20" r="19" fill="none" stroke="#4c5968" stroke-width="2"/>
    <circle class="timer-circle" cx="20" cy="20" r="19" fill="none" stroke="#F51928" stroke-width="2" 
            stroke-dasharray="119.38" stroke-dashoffset="119.38" 
            transform="rotate(-90 20 20)" stroke-linecap="round"/>
  </svg>
`;

// Add styles for timer
const style = document.createElement("style");
style.textContent = `
  .slider-btn {
    position: relative;
  }
  
  .timer-circle {
    transition: stroke-dashoffset 0.05s linear;
  }
  
  .slider-btn img {
    position: relative;
    z-index: 1;
  }
`;
document.head.appendChild(style);

// Add timer SVG to right button
rightBtn.style.position = "relative";
rightBtn.insertAdjacentHTML("afterbegin", svgTimer);
const timerCircle = rightBtn.querySelector(".timer-circle");

// Function to update timer progress
function updateTimerProgress() {
  const circumference = 119.38;
  const offset = circumference - (progress / 100) * circumference;
  timerCircle.style.strokeDashoffset = offset;
}

// Function to update the background image
function updateSlide() {
  heroSection.style.backgroundImage = `url('${heroImages[currentSlide]}')`;
  slideCounter.textContent = `${currentSlide + 1}/${heroImages.length}`;
}

// Function to go to next slide
function nextSlide() {
  currentSlide = (currentSlide + 1) % heroImages.length;
  updateSlide();
  resetTimer();
}

// Function to go to previous slide
function previousSlide() {
  currentSlide = (currentSlide - 1 + heroImages.length) % heroImages.length;
  updateSlide();
  resetTimer();
}

// Function to reset timer
function resetTimer() {
  progress = 0;
  updateTimerProgress();
}

// Start timer
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

// Stop timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Left button click - previous slide
leftBtn.addEventListener("click", () => {
  stopTimer();
  previousSlide();
  startTimer();
});

// Right button click - next slide
rightBtn.addEventListener("click", () => {
  stopTimer();
  nextSlide();
  startTimer();
});

// Initialize with first image and start timer
updateSlide();
startTimer();

// ===== DEALS FOR YOU SECTION - Carousel Script =====
var swiper = new Swiper(".dealsSwiper", {
  slidesPerView: 4,
  spaceBetween: 12,
  pagination: {
    el: ".dealSlider-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".carousel-arrow-right",
    prevEl: ".carousel-arrow-left",
  },

  breakpoints: {
    0: {
      slidesPerView: 1.1,
      spaceBetween: 10,
    },
    379: {
      slidesPerView: 1.3,
      spaceBetween: 10,
    },
    460: {
      slidesPerView: 1.5,
      spaceBetween: 12,
    },
    560: {
      slidesPerView: 1.8,
      spaceBetween: 12,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 12,
    },
    760: {
      slidesPerView: 2.4,
      spaceBetween: 12,
    },
    910: {
      slidesPerView: 2.8,
      spaceBetween: 12,
    },
    992: {
      slidesPerView: 2.6,
      spaceBetween: 12,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1400: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
});
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
const budgetCards = document.querySelectorAll(
  ".shop-by-budget-section .deal-card",
);
const budgetLeftArrow = document.querySelector(".budget-carousel-arrow-left");
const budgetRightArrow = document.querySelector(".budget-carousel-arrow-right");
const budgetIndicators = document.querySelectorAll(".budget-indicator");

let budgetCurrentIndex = 0;
const budgetTotalCards = budgetCards.length;
const budgetCardsToShow = 4; // Number of cards visible at once
const budgetMaxIndex = budgetTotalCards - budgetCardsToShow;

function updateBudgetCarousel() {
  const cardWidth = budgetCards[0].offsetWidth;
  const gap = 12;
  const moveAmount = (cardWidth + gap) * budgetCurrentIndex;

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

// Touch/Swipe support for mobile
let budgetTouchStartX = 0;
let budgetTouchEndX = 0;

const budgetProductsContainer = document.querySelector(
  ".budget-products-container",
);

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
      if (budgetCurrentIndex < budgetTotalCards - 1) {
        budgetCurrentIndex++;
        updateBudgetCarousel();
      }
    } else {
      // Swiped right - show previous card
      if (budgetCurrentIndex > 0) {
        budgetCurrentIndex--;
        updateBudgetCarousel();
      }
    }
  }
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

// Indicator click handlers
budgetIndicators.forEach((indicator, idx) => {
  indicator.addEventListener("click", () => {
    budgetCurrentIndex = idx;
    updateBudgetCarousel();
  });
});

// Initialize
updateBudgetCarousel();
// Set initial arrow states
budgetLeftArrow.style.opacity = "0.5";
budgetLeftArrow.style.cursor = "not-allowed";

// Handle window resize
let budgetResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(budgetResizeTimer);
  budgetResizeTimer = setTimeout(() => {
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

// Extract price from each card and add data-price attribute
const allBudgetCards = document.querySelectorAll(
  ".shop-by-budget-section .deal-card",
);
allBudgetCards.forEach((card) => {
  // Find the price element (fs-5 fw-bold text-dark)
  const priceElement = card.querySelector(".fs-5.fw-bold.text-dark");
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

  // Update carousel
  if (budgetCarousel) {
    budgetCarousel.style.transform = "translateX(0px)";
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
if (window.innerWidth <= 991) {
  const offersContainer = document.querySelector(".offers-carousel-container");

  // Update indicators based on scroll position
  offersContainer.addEventListener("scroll", () => {
    const scrollLeft = offersContainer.scrollLeft;
    const slideWidth = offersSlides[0].offsetWidth + 15; // width + gap
    const currentIndex = Math.round(scrollLeft / slideWidth);

    offersIndicators.forEach((indicator, idx) => {
      if (idx === currentIndex) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  });

  // Make indicators clickable to scroll to specific card
  offersIndicators.forEach((indicator, idx) => {
    indicator.addEventListener("click", () => {
      const slideWidth = offersSlides[0].offsetWidth + 15;
      offersContainer.scrollTo({
        left: slideWidth * idx,
        behavior: "smooth",
      });
    });
  });
}

// ===== DEALS FOR YOU SECTION - Toggle Buttons =====
const dealsToggleBtns = document.querySelectorAll(".deals-toggle-btn");

dealsToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    // Remove active state from all buttons
    dealsToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      // b.classList.remove("btn-light");
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });

    // Add active state to clicked button
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
      b.classList.remove("btn-primary", "active");
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("text-secondary");
    this.style.backgroundColor = "";
  });
});

// ===== SHOP BY COLOR SECTION - Toggle Buttons =====
const colorToggleBtns = document.querySelectorAll(".color-toggle-btn");
colorToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    colorToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
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
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("text-secondary");
    this.style.backgroundColor = "";
  });
});

// ===== OFFER SECTION - Toggle Buttons =====
const offerToggleBtns = document.querySelectorAll(".offer-toggle-btn");
offerToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    offerToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("text-secondary");
    this.style.backgroundColor = "";
  });
});

// ===== VIDEO SECTION - Toggle Buttons =====
const videoToggleBtns = document.querySelectorAll(".video-toggle-btn");
videoToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    videoToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("text-secondary");
    this.style.backgroundColor = "";
  });
});
// ===== FAQ SECTION - Toggle Buttons =====
const faqToggleBtns = document.querySelectorAll(".faq-toggle-btn");
faqToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    faqToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("text-secondary");
    this.style.backgroundColor = "";
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
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
    this.classList.remove("text-secondary");
    this.style.backgroundColor = "";
  });
});

// ===== BEST SELLING SECTION - Carousel Script =====
const sellingCarousel = document.querySelector(".selling-carousel");
const sellingCards = document.querySelectorAll(
  ".best-selling-section .deal-card",
);
const sellingLeftArrow = document.querySelector(".selling-carousel-arrow-left");
const sellingRightArrow = document.querySelector(
  ".selling-carousel-arrow-right",
);
const sellingIndicators = document.querySelectorAll(".selling-indicator");

let sellingCurrentIndex = 0;
const sellingTotalCards = sellingCards.length;
const sellingCardsToShow = 4;
const sellingMaxIndex = sellingTotalCards - sellingCardsToShow;

function updateSellingCarousel() {
  const cardWidth = sellingCards[0].offsetWidth;
  const gap = 12;
  const moveAmount = (cardWidth + gap) * sellingCurrentIndex;

  sellingCarousel.style.transform = `translateX(-${moveAmount}px)`;

  // Update indicators
  sellingIndicators.forEach((indicator, idx) => {
    if (idx === sellingCurrentIndex) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });

  // Update arrow states
  if (sellingLeftArrow) {
    sellingLeftArrow.style.opacity = sellingCurrentIndex === 0 ? "0.5" : "1";
    sellingLeftArrow.style.cursor =
      sellingCurrentIndex === 0 ? "not-allowed" : "pointer";
  }

  if (sellingRightArrow) {
    sellingRightArrow.style.opacity =
      sellingCurrentIndex === sellingMaxIndex ? "0.5" : "1";
    sellingRightArrow.style.cursor =
      sellingCurrentIndex === sellingMaxIndex ? "not-allowed" : "pointer";
  }
}

if (sellingLeftArrow) {
  sellingLeftArrow.addEventListener("click", () => {
    if (sellingCurrentIndex > 0) {
      sellingCurrentIndex--;
      updateSellingCarousel();
    }
  });
}

if (sellingRightArrow) {
  sellingRightArrow.addEventListener("click", () => {
    if (sellingCurrentIndex < sellingMaxIndex) {
      sellingCurrentIndex++;
      updateSellingCarousel();
    }
  });
}

// Indicator click handlers
sellingIndicators.forEach((indicator, idx) => {
  indicator.addEventListener("click", () => {
    sellingCurrentIndex = idx;
    updateSellingCarousel();
  });
});

// Initialize
updateSellingCarousel();

// Handle window resize
let sellingResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(sellingResizeTimer);
  sellingResizeTimer = setTimeout(() => {
    updateSellingCarousel();
  }, 250);
});

// ===== BEST SELLING SECTION - Toggle Buttons =====
const sellingToggleBtns = document.querySelectorAll(".selling-toggle-btn");
sellingToggleBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    sellingToggleBtns.forEach((b) => {
      b.classList.remove("btn-primary", "active");
      b.classList.add("text-secondary");
      b.style.backgroundColor = "transparent";
    });
    this.classList.add("btn-primary", "active");
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

// ===== TESTIMONIALS SECTION - Carousel Script =====
const testimonialsTrack = document.querySelector(".testimonials-track");
const testimonialCards = document.querySelectorAll(".testimonial-card");
const testimonialLeftArrow = document.querySelector(".testimonial-arrow-left");
const testimonialRightArrow = document.querySelector(
  ".testimonial-arrow-right",
);
const testimonialIndicators = document.querySelectorAll(
  ".testimonial-indicator",
);

let testimonialCurrentIndex = 0;
const testimonialTotalCards = testimonialCards.length;
const testimonialCardsToShow = 2;
const testimonialMaxIndex = testimonialTotalCards - testimonialCardsToShow;

function updateTestimonialCarousel() {
  const cardWidth = testimonialCards[0].offsetWidth;
  const gap = 16;
  const moveAmount = (cardWidth + gap) * testimonialCurrentIndex;

  testimonialsTrack.style.transform = `translateX(-${moveAmount}px)`;

  // Update indicators
  testimonialIndicators.forEach((indicator, idx) => {
    if (idx === testimonialCurrentIndex) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });
}

testimonialLeftArrow.addEventListener("click", () => {
  if (testimonialCurrentIndex > 0) {
    testimonialCurrentIndex--;
    updateTestimonialCarousel();
  }
});

testimonialRightArrow.addEventListener("click", () => {
  if (testimonialCurrentIndex < testimonialMaxIndex) {
    testimonialCurrentIndex++;
    updateTestimonialCarousel();
  }
});

// Indicator click handlers
testimonialIndicators.forEach((indicator, idx) => {
  indicator.addEventListener("click", () => {
    testimonialCurrentIndex = idx;
    updateTestimonialCarousel();
  });
});

// Initialize
updateTestimonialCarousel();

// Handle window resize
let testimonialResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(testimonialResizeTimer);
  testimonialResizeTimer = setTimeout(() => {
    updateTestimonialCarousel();
  }, 250);
});

// ===== SMART CHOICES SECTION - Carousel Script (Drag + Indicator navigation) =====
const smartChoicesTrack = document.querySelector(".smart-choices-track");
const smartChoiceCards = document.querySelectorAll(".smart-choice-card");
const smartIndicators = document.querySelectorAll(
  "#smartChoicesIndicators .smart-indicator",
);
const smartChoicesWrapper = document.querySelector(".smart-choices-wrapper");

let smartCurrentIndex = 0;
const smartTotalCards = smartChoiceCards.length;
const smartIndicatorsContainer = document.getElementById(
  "smartChoicesIndicators",
);

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

  const visibleCards = isMobile
    ? 1
    : Math.max(1, Math.floor((wrapperWidth + gap) / (cardWidth + gap)));
  const maxIndex = Math.max(0, smartTotalCards - visibleCards);
  const fitsWithoutSliding = maxIndex === 0;

  // Wrap the index around instead of stopping at either end
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
    smartChoicesTrack.style.justifyContent = "center";
  } else {
    smartChoicesTrack.style.justifyContent = "";

    if (isMobile) {
      const trackWidth = smartChoicesTrack.scrollWidth;
      const maxScroll = Math.max(0, trackWidth - wrapperWidth);
      const rawMove =
        (cardWidth + gap) * smartCurrentIndex + cardWidth / 2 - wrapperWidth / 2;
      moveAmount = Math.min(maxScroll, Math.max(0, rawMove));
      maxMoveAmount = maxScroll;
    } else {
      moveAmount = (cardWidth + gap) * smartCurrentIndex;
      maxMoveAmount = (cardWidth + gap) * maxIndex;
    }
  }

  smartChoicesTrack.style.transform = `translateX(${-moveAmount}px)`;

  if (instant) {
    requestAnimationFrame(() => {
      smartChoicesTrack.style.transition = "transform 0.4s ease";
    });
  }

  smartChoiceCards.forEach((card, idx) => {
    card.classList.toggle("active", isMobile && idx === smartCurrentIndex);
  });

  if (smartIndicatorsContainer) {
    smartIndicatorsContainer.style.display = fitsWithoutSliding ? "none" : "";
  }

  smartIndicators.forEach((indicator, idx) => {
    indicator.style.display = idx > maxIndex ? "none" : "";
    indicator.classList.toggle("active", idx === smartCurrentIndex);
  });

  smartMoveAmount = moveAmount;
  smartMaxMoveAmount = maxMoveAmount;
  smartMaxIndex = maxIndex;
  smartCanDrag = !fitsWithoutSliding;
}

// ---- Drag support (mouse + touch + pen, unified via Pointer Events) ----
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
    smartCurrentIndex++;
  } else if (smartDragDeltaX >= threshold) {
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

// Indicator click handlers - clamp to the furthest reachable position
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

// ===== VIDEOS & MEDIA SECTION - Carousel Script =====
const videosTrack = document.querySelector(".videos-track");
const videoCards = document.querySelectorAll(".video-card");
const videosPrevBtn = document.getElementById("videosPrev");
const videosNextBtn = document.getElementById("videosNext");
const videoIndicators = document.querySelectorAll(".video-indicator");

let videosCurrentIndex = 0;
const videosTotalCards = videoCards.length;
const videosCardsToShow = 4; // Number of cards visible at once
const videosMaxIndex = Math.max(0, videosTotalCards - videosCardsToShow);

function updateVideosCarousel() {
  const cardWidth = videoCards[0].offsetWidth;
  const gap = 16; // gap-4 in Bootstrap = 16px
  const moveAmount = (cardWidth + gap) * videosCurrentIndex;

  videosTrack.style.transform = `translateX(-${moveAmount}px)`;

  // Update indicators
  videoIndicators.forEach((indicator, idx) => {
    if (idx === videosCurrentIndex) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });

  // Update arrow states
  videosPrevBtn.style.opacity = videosCurrentIndex === 0 ? "0.5" : "1";
  videosPrevBtn.style.cursor =
    videosCurrentIndex === 0 ? "not-allowed" : "pointer";
  videosPrevBtn.disabled = videosCurrentIndex === 0;

  videosNextBtn.style.opacity =
    videosCurrentIndex === videosMaxIndex ? "0.5" : "1";
  videosNextBtn.style.cursor =
    videosCurrentIndex === videosMaxIndex ? "not-allowed" : "pointer";
  videosNextBtn.disabled = videosCurrentIndex === videosMaxIndex;
}

videosPrevBtn.addEventListener("click", () => {
  if (videosCurrentIndex > 0) {
    videosCurrentIndex--;
    updateVideosCarousel();
  }
});

videosNextBtn.addEventListener("click", () => {
  if (videosCurrentIndex < videosMaxIndex) {
    videosCurrentIndex++;
    updateVideosCarousel();
  }
});

// Indicator click handlers
videoIndicators.forEach((indicator, idx) => {
  indicator.addEventListener("click", () => {
    const index = parseInt(indicator.getAttribute("data-index"));
    if (index <= videosMaxIndex) {
      videosCurrentIndex = index;
      updateVideosCarousel();
    }
  });
});

// Initialize
updateVideosCarousel();

// Handle window resize
let videosResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(videosResizeTimer);
  videosResizeTimer = setTimeout(() => {
    updateVideosCarousel();
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

// ===== PROCESSOR SECTION - Swiper.js Configuration =====
var processorSwiperRog = new Swiper(".myProcessorSwiperRog", {
  slidesPerView: 4,
  spaceBetween: 30,
  loop: false,
  pagination: {
    el: ".swiper-pagination-processor-rog",
    clickable: true,
  },

  // Responsive Breakpoints
  breakpoints: {
    0: {
      slidesPerView: 2,
      spaceBetween: 15,
      centeredSlides: false,
      allowTouchMove: true,
      pagination: {
        el: ".swiper-pagination-processor-rog",
        clickable: true,
      },
    },
    576: {
      slidesPerView: 2.5,
      spaceBetween: 20,
      allowTouchMove: true,
      pagination: {
        el: ".swiper-pagination-processor-rog",
        clickable: true,
      },
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 25,
      allowTouchMove: true,
      pagination: {
        el: ".swiper-pagination-processor-rog",
        clickable: true,
      },
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 30,
      pagination: false,
      allowTouchMove: false,
      simulateTouch: false,
      allowSlideNext: false,
      allowSlidePrev: false,
    },
  },
});

// ===== GPU SECTION - Swiper.js Configuration =====
var gpuSwiperRog = new Swiper(".myGpuSwiperRog", {
  slidesPerView: 7,
  spaceBetween: 20,
  loop: false,
  slidesPerGroup: 2,
  pagination: {
    el: ".swiper-pagination-gpu-rog",
    clickable: true,
  },

  // Responsive Breakpoints
  breakpoints: {
    0: {
      slidesPerView: 3.5,
      spaceBetween: 10,
      slidesPerGroup: 2,
      centeredSlides: false,
      allowTouchMove: true,
      pagination: {
        el: ".swiper-pagination-gpu-rog",
        clickable: true,
      },
    },
    576: {
      slidesPerView: 4,
      spaceBetween: 15,
      slidesPerGroup: 2,
      allowTouchMove: true,
      pagination: {
        el: ".swiper-pagination-gpu-rog",
        clickable: true,
      },
    },
    768: {
      slidesPerView: 5,
      spaceBetween: 20,
      slidesPerGroup: 2,
      allowTouchMove: true,
      pagination: {
        el: ".swiper-pagination-gpu-rog",
        clickable: true,
      },
    },
    992: {
      slidesPerView: 7,
      spaceBetween: 20,
      pagination: false,
      allowTouchMove: false,
      simulateTouch: false,
      allowSlideNext: false,
      allowSlidePrev: false,
    },
  },
});

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
