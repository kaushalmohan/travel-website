const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.getElementById('closeModal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentImageIndex = 0;
let currentCarouselImages = [];
let carouselIntervals = new Map();

// Function to rotate carousel images
function rotateCarousel(container) {
  const images = container.querySelectorAll('.carousel-image-container');
  let currentIndex = 0;

  // Clear any existing interval for this container
  if (carouselIntervals.has(container)) {
    clearInterval(carouselIntervals.get(container));
  }

  // Set up new interval
  const interval = setInterval(() => {
    images[currentIndex].style.opacity = '0';
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].style.opacity = '1';
  }, 3000);

  // Store the interval
  carouselIntervals.set(container, interval);
}

// Initialize all carousels
document.querySelectorAll('.carousel-container').forEach(container => {
  rotateCarousel(container);
});

// Add click handlers to all images
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('click', () => {
    modal.style.display = "block";
    modalImg.src = img.src;
    
    // Find all images in the same carousel
    const carouselContainer = img.closest('.carousel-container');
    if (carouselContainer) {
      currentCarouselImages = Array.from(carouselContainer.querySelectorAll('img'));
      currentImageIndex = currentCarouselImages.indexOf(img);
      // Always show navigation buttons for carousel images
      prevBtn.style.display = 'block';
      nextBtn.style.display = 'block';
    } else {
      // If image is not in a carousel, hide navigation buttons
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  });
});

// Navigation functions
function showNextImage() {
  if (currentCarouselImages.length > 0) {
    currentImageIndex = (currentImageIndex + 1) % currentCarouselImages.length;
    modalImg.src = currentCarouselImages[currentImageIndex].src;
  }
}

function showPrevImage() {
  if (currentCarouselImages.length > 0) {
    currentImageIndex = (currentImageIndex - 1 + currentCarouselImages.length) % currentCarouselImages.length;
    modalImg.src = currentCarouselImages[currentImageIndex].src;
  }
}

// Add navigation event listeners
nextBtn.addEventListener('click', showNextImage);
prevBtn.addEventListener('click', showPrevImage);

// Close modal
closeBtn.addEventListener('click', () => {
  modal.style.display = "none";
  currentCarouselImages = [];
  currentImageIndex = 0;
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    currentCarouselImages = [];
    currentImageIndex = 0;
  }
});

// Close with ESC key and handle arrow navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === "block") {
    modal.style.display = "none";
    currentCarouselImages = [];
    currentImageIndex = 0;
  }
  // Add arrow key navigation
  if (modal.style.display === "block") {
    if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  }
}); 