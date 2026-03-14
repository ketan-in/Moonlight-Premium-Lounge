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

  const renderSlides = (index) => {
    activeIndex = (index + menuSlides.length) % menuSlides.length;

    menuSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    menuDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  };

  prevButton.addEventListener("click", () => renderSlides(activeIndex - 1));
  nextButton.addEventListener("click", () => renderSlides(activeIndex + 1));

  menuDots.forEach((dot, index) => {
    dot.addEventListener("click", () => renderSlides(index));
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

  document.addEventListener("keydown", (event) => {
    const tagName = document.activeElement ? document.activeElement.tagName : "";
    const isTyping =
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      document.activeElement?.isContentEditable;

    if (isTyping) {
      return;
    }

    if (event.key === "ArrowLeft") {
      renderSlides(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      renderSlides(activeIndex + 1);
    }
  });

  renderSlides(0);
}
