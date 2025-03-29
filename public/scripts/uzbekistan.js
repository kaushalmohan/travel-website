document.addEventListener('DOMContentLoaded', function() {
  // Use Intersection Observer to load images when they come into view
  const lazyLoadImages = () => {
    const imageContainers = document.querySelectorAll('.image-container');
    const observerOptions = {
      rootMargin: '200px', // Load images a bit before they enter the viewport
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const img = container.querySelector('img');
          
          if (img && img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Once the image is loaded, stop observing it
          observer.unobserve(container);
        }
      });
    }, observerOptions);

    imageContainers.forEach(container => {
      observer.observe(container);
    });
  };

  // Setup modal functionality
  const setupModal = () => {
    const imageContainers = document.querySelectorAll('.image-container');
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close');
    
    // Use event delegation to reduce the number of event listeners
    document.addEventListener('click', function(event) {
      // Check if clicked element is within an image container
      const container = event.target.closest('.image-container');
      if (container) {
        const img = container.querySelector('img');
        const caption = container.querySelector('.image-caption').textContent;
        openModal(img.src, caption);
      }
      
      // Close modal when clicking outside the image
      if (event.target === modal) {
        closeModal();
      }
    });

    // Close modal when clicking the close button
    if (closeBtn) {
      closeBtn.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event from bubbling to modal
        closeModal();
      });
    }

    // Close modal when pressing ESC key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    });
  };

  function openModal(imgSrc, caption) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    
    // Replace with WebP version if available
    const webpSrc = imgSrc.replace(/\.(jpg|jpeg)$/, '.webp');
    
    modal.style.display = "block";
    modalImg.src = webpSrc;
    captionText.innerHTML = caption;
  }

  function closeModal() {
    const modal = document.getElementById("imageModal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  // Initialize the page
  lazyLoadImages();
  setupModal();
});

// Make these functions available globally
window.openModal = function(imgSrc, caption) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const captionText = document.getElementById("caption");
  
  // Replace with WebP version if available
  const webpSrc = imgSrc.replace(/\.(jpg|jpeg)$/, '.webp');
  
  modal.style.display = "block";
  modalImg.src = webpSrc;
  captionText.innerHTML = caption;
};

window.closeModal = function() {
  const modal = document.getElementById("imageModal");
  if (modal) {
    modal.style.display = "none";
  }
}; 