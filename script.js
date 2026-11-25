// Dynamic Slide Data (JSON-style structure)
const SLIDES_DATA = [
  {
    badge: "Featured Project • AI & Web",
    title: "AI Analytics & Automation Dashboard",
    description:
      "Real-time business intelligence platform built with responsive charts, predictive insights, and clean dark-mode UI.",
    ctaPrimary: { label: "View Project", href: "#featured-work" },
    ctaSecondary: { label: "Explore Services", href: "#services" },
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    alt: "Modern analytics dashboard displayed on a widescreen monitor"
  },
  {
    badge: "Service Spotlight • Full-Stack UI",
    title: "Modern Web Development Services",
    description:
      "Custom, mobile-first websites engineered with semantic HTML5, scalable CSS systems, and interactive JavaScript.",
    ctaPrimary: { label: "Learn More", href: "#services" },
    ctaSecondary: { label: "Get in Touch", href: "#contact" },
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    alt: "Developer laptop displaying clean frontend code on a desk"
  },
  {
    badge: "Case Study • E-Commerce UX",
    title: "High-Conversion Storefront Experience",
    description:
      "Streamlined product discovery, instant filtering, and accessible checkout flows designed to boost customer retention.",
    ctaPrimary: { label: "View Case Study", href: "#featured-work" },
    ctaSecondary: { label: "Request Quote", href: "#contact" },
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    alt: "Clean e-commerce interface design wireframe and metrics"
  }
];

class HeroSlider {
  constructor(data) {
    this.slidesData = data;
    this.currentIndex = 0;
    this.autoPlayDelay = 4500; // 4.5 seconds
    this.timer = null;
    this.progressTimer = null;
    this.isPaused = false;

    this.sliderEl = document.getElementById("hero-slider");
    this.trackEl = document.getElementById("slidesTrack");
    this.dotsEl = document.getElementById("sliderDots");
    this.progressEl = document.getElementById("sliderProgress");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");

    this.init();
  }

  init() {
    this.renderSlides();
    this.renderDots();
    this.bindEvents();
    this.goToSlide(0);
    this.startAutoPlay();
  }

  renderSlides() {
    this.trackEl.innerHTML = this.slidesData
      .map((slide, index) => {
        // Use <h1> on the first slide for SEO, <h2> on subsequent slides
        const HeadingTag = index === 0 ? "h1" : "h2";
        return `
          <article class="slide" data-index="${index}" aria-hidden="${index !== 0}">
            <img
              class="slide-bg"
              src="${slide.image}"
              alt="${slide.alt}"
              loading="${index === 0 ? "eager" : "lazy"}"
            />
            <div class="container">
              <div class="slide-content">
                <span class="slide-badge">${slide.badge}</span>
                <${HeadingTag} class="slide-title">${slide.title}</${HeadingTag}>
                <p class="slide-desc">${slide.description}</p>
                <div class="slide-actions">
                  <a href="${slide.ctaPrimary.href}" class="btn-primary">${slide.ctaPrimary.label} &rarr;</a>
                  <a href="${slide.ctaSecondary.href}" class="btn-secondary">${slide.ctaSecondary.label}</a>
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  renderDots() {
    this.dotsEl.innerHTML = this.slidesData
      .map(
        (_, index) => `
        <button
          type="button"
          class="dot-btn"
          data-index="${index}"
          role="tab"
          aria-label="Go to slide ${index + 1}"
          aria-selected="${index === 0}"
        ></button>
      `
      )
      .join("");
  }

  goToSlide(index) {
    const total = this.slidesData.length;
    this.currentIndex = (index + total) % total;

    const slides = this.trackEl.querySelectorAll(".slide");
    const dots = this.dotsEl.querySelectorAll(".dot-btn");

    slides.forEach((slide, i) => {
      const active = i === this.currentIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });

    dots.forEach((dot, i) => {
      const active = i === this.currentIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", String(active));
    });

    this.resetProgressBar();
  }

  next() {
    this.goToSlide(this.currentIndex + 1);
  }

  prev() {
    this.goToSlide(this.currentIndex - 1);
  }

  resetProgressBar() {
    if (!this.progressEl) return;
    this.progressEl.style.transition = "none";
    this.progressEl.style.width = "0%";

    if (!this.isPaused) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.progressEl.style.transition = `width ${this.autoPlayDelay}ms linear`;
          this.progressEl.style.width = "100%";
        });
      });
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.isPaused = false;
    this.resetProgressBar();
    this.timer = setInterval(() => this.next(), this.autoPlayDelay);
  }

  stopAutoPlay() {
    this.isPaused = true;
    clearInterval(this.timer);
    if (this.progressEl) {
      this.progressEl.style.transition = "none";
      this.progressEl.style.width = "0%";
    }
  }

  bindEvents() {
    this.nextBtn.addEventListener("click", () => {
      this.next();
      if (!this.isPaused) this.startAutoPlay();
    });

    this.prevBtn.addEventListener("click", () => {
      this.prev();
      if (!this.isPaused) this.startAutoPlay();
    });

    this.dotsEl.addEventListener("click", (e) => {
      const dot = e.target.closest(".dot-btn");
      if (!dot) return;
      this.goToSlide(Number(dot.dataset.index));
      if (!this.isPaused) this.startAutoPlay();
    });

    // Pause on hover & focus for better UX
    this.sliderEl.addEventListener("mouseenter", () => this.stopAutoPlay());
    this.sliderEl.addEventListener("mouseleave", () => this.startAutoPlay());

    // Keyboard navigation (Left / Right arrows)
    this.sliderEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        this.next();
      } else if (e.key === "ArrowLeft") {
        this.prev();
      }
    });

    // Subtle Mouse Parallax on Active Slide Background
    this.sliderEl.addEventListener("mousemove", (e) => {
      const activeBg = this.trackEl.querySelector(".slide.is-active .slide-bg");
      if (!activeBg) return;
      const { width, height } = this.sliderEl.getBoundingClientRect();
      const offsetX = ((e.clientX / width) - 0.5) * -18;
      const offsetY = ((e.clientY / height) - 0.5) * -18;
      activeBg.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });

    this.sliderEl.addEventListener("mouseleave", () => {
      const activeBg = this.trackEl.querySelector(".slide.is-active .slide-bg");
      if (activeBg) activeBg.style.transform = "translate3d(0, 0, 0)";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new HeroSlider(SLIDES_DATA);
});