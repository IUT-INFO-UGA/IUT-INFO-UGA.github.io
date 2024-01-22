const partnerBoxesTop = document.querySelectorAll(".trustBoxTop");
const partnerBoxesBottom = document.querySelectorAll(".trustBoxBottom");
const animationSpeed = 2;
let lastScrollTop = 0;
let scrollDown = true;

// element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
window.addEventListener(
  "scroll",
  function () {
    var st = document.documentElement.scrollTop;
    if (st > lastScrollTop) {
      scrollDown = true;
    } else if (st < lastScrollTop) {
      scrollDown = false;
    }
    lastScrollTop = st <= 0 ? 0 : st;
  },
  false
);

function moveToLeft(box) {
  let currentLeft = parseInt(box.style.left) || 0;
  currentLeft -= animationSpeed;
  if (currentLeft <= -365) {
    currentLeft = 2192;
  }
  box.style.left = currentLeft + "px";
}

function moveToRight(box) {
  let currentLeft = parseInt(box.style.left) || 0;
  currentLeft += animationSpeed;
  if (currentLeft >= 2192) {
    currentLeft = -365;
  }
  box.style.left = currentLeft + "px";
}

function moveElementsToLeft() {
  partnerBoxesTop.forEach(scrollDown ? moveToLeft : moveToRight);
  partnerBoxesBottom.forEach(scrollDown ? moveToRight : moveToLeft);
  requestAnimationFrame(moveElementsToLeft);
}

// Start the animation
moveElementsToLeft();
