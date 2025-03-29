document.addEventListener('DOMContentLoaded', () => {
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <span class="close">&times;</span>
    <span class="nav prev">&#10094;</span>
    <span class="nav next">&#10095;</span>
    <img class="modal-content">
    <div class="caption"></div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector('.modal-content');
  const captionText = modal.querySelector('.caption');
  const closeBtn = modal.querySelector('.close');
  const prevBtn = modal.querySelector('.nav.prev');
  const nextBtn = modal.querySelector('.nav.next');

  let currentModalDay = null;
  let currentModalIndex = 0;

  // Image captions mapping
  const imageCaptions = {
    'day1a': 'Finding a local place to eat banh mi in the afternoon.',
    'day1b': 'Park near Hoan Kiem lake where we chilled for a while',
    'day1c': 'This is the very pretty and chill Hoan Kiem Lake. We sat outside the lake for nearly an hour eating fries and drinking juice.',
    'day1d': 'Riding around aimlessly in the streets of Hanoi was incredible fun',
    'day1e': 'Laika cafe where we got our first ever taste of incredible Vietnamese coffee',
    'day2a': 'We cycled on this beautiful road where our cycle chain came off and we were stranded for a while.',
    'day2b': 'Boating around in Ningbing amongst the caves was a great experience.',
    'day2c': 'There was somebody working on the top of Mua caves, and I wish that was my workspace.',
    'day2d': 'Incredible view from the top of Mua caves',
    'day2e': 'Happy faces',
    'day2f': 'Pretty lanes around Mua Caves area',
    'day2g': 'Walking on the beautiful streets of Trang An surrounded by breathtaking landscapes',
    'day3a': 'This is Era cruise which was our home for the night',
    'day3b': 'This was the view from our bed on the cruise. We had this view on three sides',
    'day3c': 'Kayaking in the beautiful waters of Halong Bay',
    'day3d': 'When you are on one of these Ha Long Bay cruises, you would spend hours looking at mountains and formations like these.',
    'day3e': 'The beautiful light and dark caves',
    'day4a': 'Lazy cruising through Halong Bay',
    'day4b': 'When you are on one of these Ha Long Bay cruises, you would spend hours looking at mountains and formations like these.',
    'day4c': 'The infamous Hanoi train street',
    'day4d': 'View fron the 50th floor of Hanoi Lotte tower',
    'day4e': 'Best ever Kadhai Panner at Red Chilli Indian restaurant',
    'day5a': 'First glimpse of Da Nang city from the plane',
    'day5b': 'Night market in Da Nang',
    'day5c': 'Chill area around Dragon Bridge. We chilled here watching the local college kids play games',
    'day5d': 'The amazing Dragon bridge. We enjoyed the vibe so much that we returned the next day',
    'day5e': 'Happy faces at Dragon bridge',
    'day6a': 'Dancing with this cutie was so uch fun',
    'day6b': 'The beautiful hand bridge. The weather here changes every few minutes',
    'day6c': 'Got lucky with this shot without anyone in the background',
    'day6d': 'The cable car ride to and from Ba Na hills gives views of the most stunning landscapes',
    'day6e': 'And we are bck to the dragon bridge are to chill some more',
    'day7a': 'Morning view of Thu Bon river',
    'day7b': 'The refreshing lemon and ginger drink',
    'day7c': 'Moments before the town lit up with lanterns all around',
    'day7d': 'What a magical evening. Reminds me of the scene from tangled when Rupunzel is at the boat and the sky lights up with lanterns',
    'day7e': 'Look at those pretty coconut trees at the banks of Thu Bon river',
    'day8a': 'You can see the entire city from Lady Buddha',
    'day8b': 'Happy faces at Lady Buddha',
    'day8c': 'Look at this cutie!',
    'day8d': 'My Khe beach was so clean and well maintained. Loved every minute we spent here',
    'day8e': 'Locals exercising at the beach',
    'day8f': 'Look at that landscape. Makes you want to teleport yourself to this place, doesn\'t it!',
    'day9a': 'Secret weapon cellar in Ho Chi Minh city is worth a visit',
    'day9b': 'Nguyen Hue street is so lively in the evenings',
    'day9c': 'Got to get clicked when the streets are so pretty!',
    'day10a': 'One of the five tunnels that are open for tourists at Cu Chi tunnels',
    'day10b': 'The entrance to the tunnel is so small',
    'day10c': 'The guide told us that the tunnels have been widened for tourists and that they used to be even smaller originally',
    'day10d': 'View from the Landmark 81 which is the tallest building in Ho Chi Minh city',
    'day10e': 'We reached Landmark pre sunset and watched the sun go down and the town light up which was incredible',
    'day11a': 'The War Remnants Museum had displays of army tanks',
    'day11b': 'The War Remnants Museum had displays of army tanks',
    'day11c': 'The Saigon post office where we picked beautiful post cards',
    'day11d': 'The Tan Dinh Church or the Pink church is very pretty',
    'day11e': 'The Bui Vien walking street has some major vibes and is a must do for everyone who enjoys nightlife'
  };

  // Carousel functionality
  const carousels = {};
  
  // Initialize carousels for each day
  document.querySelectorAll('.image-container').forEach(container => {
    const day = container.querySelector('.clickable-image').dataset.day;
    const images = container.querySelectorAll('.clickable-image');
    const dots = container.querySelectorAll('.carousel-dot');
    const captionElement = container.querySelector('.image-caption');
    let currentIndex = 0;

    carousels[day] = {
      images,
      dots,
      currentIndex,
      captionElement,
      interval: setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel(day, currentIndex);
      }, 3000)
    };

    // Add click handlers for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        clearInterval(carousels[day].interval);
        updateCarousel(day, index);
        carousels[day].interval = setInterval(() => {
          carousels[day].currentIndex = (carousels[day].currentIndex + 1) % images.length;
          updateCarousel(day, carousels[day].currentIndex);
        }, 3000);
      });
    });

    // Add click handlers for images
    images.forEach((img, index) => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.style.display = "block";
        modalImg.src = e.target.src;
        // Extract the image name from URL and get appropriate caption
        const srcPath = e.target.src;
        const isWebp = srcPath.includes('.webp');
        const imageName = srcPath.split('/').pop().replace(/-\d+w\.webp$|\.webp$|\.jpg$/, '');
        
        captionText.innerHTML = imageCaptions[imageName] || e.target.alt;
        currentModalDay = day;
        currentModalIndex = index;
      });
    });
  });

  function updateCarousel(day, index) {
    const carousel = carousels[day];
    carousel.images.forEach(img => img.classList.remove('active'));
    carousel.dots.forEach(dot => dot.classList.remove('active'));
    
    carousel.images[index].classList.add('active');
    carousel.dots[index].classList.add('active');
    carousel.currentIndex = index;

    // Update caption
    const activeImage = carousel.images[index];
    // Extract the image name from URL and get appropriate caption
    const srcPath = activeImage.src;
    const isWebp = srcPath.includes('.webp');
    const imageName = srcPath.split('/').pop().replace(/-\d+w\.webp$|\.webp$|\.jpg$/, '');
    
    carousel.captionElement.innerHTML = imageCaptions[imageName] || activeImage.alt;
  }

  function showNextImage() {
    if (currentModalDay) {
      const images = carousels[currentModalDay].images;
      currentModalIndex = (currentModalIndex + 1) % images.length;
      modalImg.src = images[currentModalIndex].src;
      
      // Extract the image name from URL and get appropriate caption
      const srcPath = images[currentModalIndex].src;
      const isWebp = srcPath.includes('.webp');
      const imageName = srcPath.split('/').pop().replace(/-\d+w\.webp$|\.webp$|\.jpg$/, '');
      
      captionText.innerHTML = imageCaptions[imageName] || images[currentModalIndex].alt;
    }
  }

  function showPrevImage() {
    if (currentModalDay) {
      const images = carousels[currentModalDay].images;
      currentModalIndex = (currentModalIndex - 1 + images.length) % images.length;
      modalImg.src = images[currentModalIndex].src;
      
      // Extract the image name from URL and get appropriate caption
      const srcPath = images[currentModalIndex].src;
      const isWebp = srcPath.includes('.webp');
      const imageName = srcPath.split('/').pop().replace(/-\d+w\.webp$|\.webp$|\.jpg$/, '');
      
      captionText.innerHTML = imageCaptions[imageName] || images[currentModalIndex].alt;
    }
  }

  // Navigation button click handlers
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
  });

  // Close modal with close button
  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside the image
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (modal.style.display === "block") {
      if (e.key === 'Escape') {
        modal.style.display = "none";
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      }
    }
  });

  // Preload images for better performance
  const preloadImagesForDay = (day) => {
    const images = document.querySelectorAll(`.clickable-image[data-day="${day}"]`);
    images.forEach(img => {
      if (img.src.endsWith('.jpg')) {
        const webpSrc = img.src.replace('.jpg', '.webp');
        const img800 = new Image();
        const img400 = new Image();
        img800.src = webpSrc.replace('.webp', '-800w.webp');
        img400.src = webpSrc.replace('.webp', '-400w.webp');
      }
    });
  };

  // Preload images for the first three days and lazy load the rest as needed
  preloadImagesForDay("1");
  preloadImagesForDay("2");
  preloadImagesForDay("3");
}); 