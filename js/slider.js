export function initSlider() {
  const sliderRow = document.querySelector(".favorite-coffee__slider--row");
  const slider = document.querySelectorAll(".favorite-coffee__slider");
  const nextButton = document.querySelector(".favorite-coffee__arrow--right");
  const prevButton = document.querySelector(".favorite-coffee__arrow--left");
  const sliderControl = document.querySelectorAll(".favorite-coffee__control");
  let current = 0;

  if (!sliderRow) return;

  function changeSlider() {
    sliderControl.forEach((control, indx) => {
      if (indx === current) {
        control.classList.add("control_active");
      } else {
        control.classList.remove("control_active");
      }
    });
  }

  sliderControl.forEach((control, indx) => {
    control.addEventListener("click", () => {
      current = indx;
      openSlide();
    });
  });

  if (sliderRow) {
    nextButton.addEventListener("click", () => {
      current++;

      if (current >= slider.length) {
        current = 0;
      }

      openSlide();
    });
  }

  prevButton.addEventListener("click", () => {
    current--;

    if (current < 0) {
      current = slider.length - 1;
    }
    openSlide();
  });

  function openSlide() {
    sliderRow.style.transform = `translateX(-${current * 100}%)`;
    changeSlider();
  }

  openSlide();
}
