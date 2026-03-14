const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px"
  }
);

revealItems.forEach((item) => observer.observe(item));

const menuSlides = document.querySelectorAll(".menu-slide");
const menuDots = document.querySelectorAll(".menu-dot");
const prevButton = document.querySelector(".menu-nav-prev");
const nextButton = document.querySelector(".menu-nav-next");
const menuStage = document.querySelector(".menu-stage");

if (menuSlides.length && menuDots.length && prevButton && nextButton && menuStage) {
  let activeIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  const lightbox = document.querySelector(".menu-lightbox");
  const lightboxImage = document.querySelector(".menu-lightbox-image");
  const lightboxCaption = document.querySelector(".menu-lightbox-caption");
  const lightboxClose = document.querySelector(".menu-lightbox-close");
  const lightboxPrev = document.querySelector(".menu-lightbox-prev");
  const lightboxNext = document.querySelector(".menu-lightbox-next");

  let lightboxTouchStartX = 0;
  let lightboxTouchEndX = 0;

  const renderSlides = (index) => {
    activeIndex = (index + menuSlides.length) % menuSlides.length;

    menuSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    menuDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  };

  const syncLightbox = () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) {
      return;
    }

    const activeSlide = menuSlides[activeIndex];
    const activeImage = activeSlide.querySelector("img");
    const activeCaption = activeSlide.querySelector("figcaption");

    lightboxImage.src = activeImage.src;
    lightboxImage.alt = activeImage.alt;
    lightboxCaption.textContent = activeCaption ? activeCaption.textContent : "";
  };

  const openLightbox = (index) => {
    if (!lightbox) {
      return;
    }

    renderSlides(index);
    syncLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox) {
      return;
    }

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  prevButton.addEventListener("click", () => renderSlides(activeIndex - 1));
  nextButton.addEventListener("click", () => renderSlides(activeIndex + 1));

  menuDots.forEach((dot, index) => {
    dot.addEventListener("click", () => renderSlides(index));
  });

  menuSlides.forEach((slide, index) => {
    const image = slide.querySelector("img");

    image.addEventListener("click", () => openLightbox(index));
  });

  menuStage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      renderSlides(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      renderSlides(activeIndex + 1);
    }
  });

  menuStage.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  menuStage.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX > 0) {
      renderSlides(activeIndex - 1);
    } else {
      renderSlides(activeIndex + 1);
    }
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    const tagName = document.activeElement ? document.activeElement.tagName : "";
    const isTyping =
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      document.activeElement?.isContentEditable;

    if (isTyping) {
      return;
    }

    const lightboxOpen = lightbox?.classList.contains("is-open");

    if (event.key === "Escape" && lightboxOpen) {
      closeLightbox();
      return;
    }

    if (event.key === "ArrowLeft") {
      renderSlides(activeIndex - 1);
      if (lightboxOpen) {
        syncLightbox();
      }
    }

    if (event.key === "ArrowRight") {
      renderSlides(activeIndex + 1);
      if (lightboxOpen) {
        syncLightbox();
      }
    }
  });

  if (lightbox && lightboxClose && lightboxPrev && lightboxNext) {
    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", () => {
      renderSlides(activeIndex - 1);
      syncLightbox();
    });
    lightboxNext.addEventListener("click", () => {
      renderSlides(activeIndex + 1);
      syncLightbox();
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener("touchstart", (event) => {
      lightboxTouchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener("touchend", (event) => {
      lightboxTouchEndX = event.changedTouches[0].clientX;
      const deltaX = lightboxTouchEndX - lightboxTouchStartX;

      if (Math.abs(deltaX) < 40) {
        return;
      }

      if (deltaX > 0) {
        renderSlides(activeIndex - 1);
      } else {
        renderSlides(activeIndex + 1);
      }

      syncLightbox();
    }, { passive: true });
  }

  renderSlides(0);
}
