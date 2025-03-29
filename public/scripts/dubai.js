// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.getElementById('closeModal');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let currentImageIndex = 0;
  let currentCarouselImages = [];
  let carouselIntervals = new Map();
  let animationFrameId = null;

  // Lazy loading images that are not immediately visible
  const lazyLoadImages = () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // If image has data-src, load it
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            // Stop observing this image
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      let lazyLoadThrottleTimeout;
      
      const lazyLoad = () => {
        if (lazyLoadThrottleTimeout) {
          clearTimeout(lazyLoadThrottleTimeout);
        }
        
        lazyLoadThrottleTimeout = setTimeout(() => {
          const scrollTop = window.pageYOffset;
          
          lazyImages.forEach(img => {
            if (img.offsetTop < window.innerHeight + scrollTop) {
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
            }
          });
          
          if (lazyImages.length === 0) {
            document.removeEventListener('scroll', lazyLoad);
            window.removeEventListener('resize', lazyLoad);
            window.removeEventListener('orientationChange', lazyLoad);
          }
        }, 20);
      };
      
      document.addEventListener('scroll', lazyLoad);
      window.addEventListener('resize', lazyLoad);
      window.addEventListener('orientationChange', lazyLoad);
    }
  };
  
  // Initialize lazy loading
  lazyLoadImages();

  // Function to rotate carousel images with requestAnimationFrame for better performance
  function rotateCarousel(container) {
    const images = container.querySelectorAll('.carousel-image-container');
    let currentIndex = 0;
    let lastTime = 0;
    const rotationInterval = 3000; // 3 seconds between rotations

    // Clear any existing interval for this container
    if (carouselIntervals.has(container)) {
      clearInterval(carouselIntervals.get(container));
    }

    // Animation function using requestAnimationFrame
    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;
      
      if (elapsed > rotationInterval) {
        images[currentIndex].style.opacity = '0';
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].style.opacity = '1';
        lastTime = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    // Start the animation
    animationFrameId = requestAnimationFrame(animate);
    
    // Store the animation frame ID
    carouselIntervals.set(container, animationFrameId);
  }

  // Initialize all carousels
  const carousels = document.querySelectorAll('.carousel-container');
  
  // Use Intersection Observer to only animate visible carousels
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        rotateCarousel(entry.target);
      } else {
        // Stop animation when not visible
        if (carouselIntervals.has(entry.target)) {
          cancelAnimationFrame(carouselIntervals.get(entry.target));
        }
      }
    });
  }, { threshold: 0.1 });

  carousels.forEach(container => {
    observer.observe(container);
  });

  // Add click handlers to all carousel images with event delegation
  document.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    
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

  // Add navigation event listeners with throttling to prevent excessive calls
  let isThrottled = false;
  
  nextBtn.addEventListener('click', () => {
    if (!isThrottled) {
      isThrottled = true;
      showNextImage();
      setTimeout(() => { isThrottled = false; }, 100);
    }
  });
  
  prevBtn.addEventListener('click', () => {
    if (!isThrottled) {
      isThrottled = true;
      showPrevImage();
      setTimeout(() => { isThrottled = false; }, 100);
    }
  });

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

  // Close with ESC key and handle arrow navigation with throttling
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === "block") {
      modal.style.display = "none";
      currentCarouselImages = [];
      currentImageIndex = 0;
    }
    
    // Add arrow key navigation with throttling
    if (modal.style.display === "block" && !isThrottled) {
      isThrottled = true;
      if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      }
      setTimeout(() => { isThrottled = false; }, 100);
    }
  });
}); 