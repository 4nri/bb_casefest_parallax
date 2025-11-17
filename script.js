const sliderContainer = document.getElementById('sliderContainer');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const globalFrontLayer = document.getElementById('globalFrontLayer');

let currentSlide = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let offsetX = 0;

const SLIDE_WIDTH = 375;
const SWIPE_THRESHOLD = 50;

// Parallax speeds for different layers
const PARALLAX_SPEEDS = {
    back: 0.04,    // Задний слой движется медленнее
    middle: 1,    // Средний слой - базовая скорость
    front: 1.4    // Передний слой движется быстрее для эффекта глубины
};

function updateSlidePositions(animated = true) {
    const slideOffset = -currentSlide * SLIDE_WIDTH;
    const totalOffset = slideOffset + offsetX;

    slides.forEach((slide, index) => {
        const backLayer = slide.querySelector('.back-layer');
        const middleLayer = slide.querySelector('.middle-layer');

        if (animated) {
            backLayer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            middleLayer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            globalFrontLayer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            backLayer.style.transition = 'none';
            middleLayer.style.transition = 'none';
            globalFrontLayer.style.transition = 'none';
        }

        const slideSpecificOffset = (index - currentSlide) * SLIDE_WIDTH + offsetX;

        backLayer.style.transform = `translateX(${slideSpecificOffset * PARALLAX_SPEEDS.back}px)`;
        middleLayer.style.transform = `translateX(${slideSpecificOffset * PARALLAX_SPEEDS.middle}px)`;
    });

    // Update global front layer
    globalFrontLayer.style.transform = `translateX(${totalOffset * PARALLAX_SPEEDS.front}px)`;
}

function updateDots() {
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    currentSlide = index;
    offsetX = 0;
    updateSlidePositions(true);
    updateDots();
}

// Touch Events
sliderContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
});

sliderContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    offsetX = currentX - startX;
    updateSlidePositions(false);
});

sliderContainer.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;

    if (Math.abs(offsetX) > SWIPE_THRESHOLD) {
        if (offsetX > 0 && currentSlide > 0) {
            // Swipe right - previous slide
            currentSlide--;
        } else if (offsetX < 0 && currentSlide < slides.length - 1) {
            // Swipe left - next slide
            currentSlide++;
        }
    }

    offsetX = 0;
    updateSlidePositions(true);
    updateDots();
});

// Mouse Events (for desktop testing)
sliderContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
});

sliderContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    offsetX = currentX - startX;
    updateSlidePositions(false);
});

sliderContainer.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;

    if (Math.abs(offsetX) > SWIPE_THRESHOLD) {
        if (offsetX > 0 && currentSlide > 0) {
            currentSlide--;
        } else if (offsetX < 0 && currentSlide < slides.length - 1) {
            currentSlide++;
        }
    }

    offsetX = 0;
    updateSlidePositions(true);
    updateDots();
});

sliderContainer.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        offsetX = 0;
        updateSlidePositions(true);
    }
});

// Dot Navigation
dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        goToSlide(index);
    });
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        // Previous slide
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    } else if (e.key === 'ArrowRight') {
        // Next slide
        if (currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1);
        }
    }
});

// Initialize
updateSlidePositions(false);
updateDots();