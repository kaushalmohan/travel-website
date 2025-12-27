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
    'day1a': 'Mutrah Souk in muscat is a wonderful mesh of tiny lanes, small stores, and tasty food',
    'day1b': 'Beautiful silver antique shop in mutrah souk - it felt like we were in an old Arabian Bazaar',
    'day2a': 'That\'s us getting ready for the dolphin watching experience at Marina Bandar',
    'day2b': 'Dolphins were much larger than wwe thought they\'d be!',
    'day2c': 'The dolphins never stopped being fascinating',
    'day2d': 'Al Bustan beach was stunningly pristine and beautiful',
    'day2e': 'Just us, looking into the beach at Al Bustan',
    'day2f': 'I can\'t emphasise what a pleasure driving in Oman was',
    'day2g': 'The drive from Muscat to Nizwa was pitcuresque with mountains dotting the landscape',
    'day2h': 'We ended our day at Nizwa Souk - which had countless shops with souveniers, dates, weapons, meat, and pots',
    'day3a': 'Friday morning had locals bring in knives and swords for sale at Nizwa Souk',
    'day3b': 'The highlight of the souk on Friday was the goat market - locals paraded their cattle in this circle',
    'day3c': 'We drove down the beautiful roads from Nizwa to Al Hoota, to see the ancient caves',
    'day3d': 'Al Hoota caves, famous for stalactites and stalagmites - are estimated to be over 2 million years old',
    'day3e': 'In a desperate bid to find vegetarian food at the village of Bahla, we settled with just a Pizza and Veg puff for lunch',
    'day3f': 'Bahla fort was quite large and had multiple nooks and corners, each with it\'s own stories',
    'day3g': 'The view from the bahla fort at dusk was mersmerizing, with the town slowly lighting up',
    'day3h': 'The bahla fort itself was lit up in the night',
    'day4a': 'The Nizwa castle and fort was our first plan for the day',
    'day4b': 'The top of Nizwa fort gave us access to some pretty views of the city',
    'day4c': 'A random mirror in Nizwa castle enabled us to take this selfie',
    'day4d': 'We moved from Nizwa to Misfat al Abriyeen - a charming town with narrow lanes',
    'day4e': 'Hiking down this trail in Misfat was pretty - and then scary as it started getting dark very quickly',
    'day4f': 'We ate this Rogan Crepe and Rogan Cafe - and it was the tastiest thing we at in Oman',
    'day4g': 'Our night was spent in Al Hamra Old house - literally an old house in the village of Al hamra',
    'day4h': 'Our room at Al Hamra Old House - we loved how much vibe it had!',
    'day5a': 'Our first Wadi experience of Oman - Wadi Bani Khalid',
    'day5b': 'Every turn at Wadi Bani Khalid gave us access to breathtaking views ',
    'day5c': 'We setup our tripod at the very end of the trail to capture this image',
    'day5d': 'On the way back, we realized that the same paths we walked on looked so different from the opposite angle',
    'day5e': 'And we couldn\'t resist stopping and staring into the stream',
    'day5f': 'The drive to Sur had about 50 km or so of complete isolation and pitch darkness - where we were the only ones on the road!',
    'day5g': 'Watching the sea turtles at Ras Al Jinz reserve was an overwhelming experience',
    'day5h': 'Plankton dotted the coastline - a stunning view that left us so mesmerized',
    'day6a': 'Driving from Ras Al Hadd village to Sur city blessed us with these beautiful beach views',
    'day6b': 'We went to a Dhow factory in Sur - was fascinating to see how dhows were actually built',
    'day6c': 'An under construction down at the Dhow factory',
    'day6d': 'The view from the top of the Sur Watchtower was stunning - gave us 360 views of Sur town',
    'day6e': 'That\'s Pankhuri, looking into Sur town',
    'day6f': 'Another view from the top of Sur Watchtower, just as dusk hit',
    'day7a': 'Yet another Wadi day - the most famous of the Omani Wadis - Wadi Shab',
    'day7b': 'The starting point of Wadi Shab was a wide pool',
    'day7c': 'Along the wadi route were areas so shallow we could sit in them',
    'day7d': 'One of the rare together pics we got in the wadi',
    'day7e': 'what you don\'t see here is how panicky we were since we didn\'t fully trust our lifejackets yet',
    'day7f': 'Wadi Bani Khalid and Wadi Shab made us want to do another wadi - which we did, later!',
    'day8a': 'The morning began with a visit to Sultan Qaboos Mosque - beautiful and vast!',
    'day8b': 'The carpet in Sultan Quboos is the second largest in the world, following the Shaik Zayed Mosque in Abu Dhabi',
    'day8c': 'We went to Bimmah Sinkhole (near Wadi Shab) since we missed it on the previous day',
    'day8d': 'Bimmah Sinkhole gave us the opportunity to get our feet nibbled at by tiny fish',
    'day8e': 'The Tiwi beach is next to the Sinkhole, and is so unbelievably peaceful and pebbley',
    'day8f': 'Pankhuri setting up our tripod at the Tiwi beach, to give us some great timelapses of the evening',
    'day9a': 'The day was all about visiting the stunning set of Damaniyat Islands',
    'day9b': 'From the top of one of the islands of the Damaniyat, we could see turtles and shallow sea sharks ',
    'day9c': 'We snorkeled for the first time, only to be treated by these cute turtles',
    'day9d': 'We were continually awestruck by the turtles and fish we saw while snorkeling',
    'day9e': 'For non swimmers like us, life jackets were truly life changing',
    'day9f': 'yet another stunning view of the turquoise blue waters of the Arabian Ocean',
    'day10a': 'We bought our own life jackets to visit the sulphur blue waters of Wadi Hoquin - the best Wadi we saw!',
    'day10b': 'Wadi Hoqain topped our wadi list - it was just SO different',
    'day10c': 'Wadi Hoqain got really deep really quickly - but our life jackets did a great job!',
    'day10d': 'Wadi Hoqain was really narrow at times, while being super deep',
    'day11a': 'The desert at Bidiyah Sands was vast, stunningly beautiful, and ridiculously windy - getting sand everywhere!',
    'day11b': 'We stayed in a tent in the desrert at Bidiyah sands - it felt like a very authentic experience',
    'day11c': 'Pankhuri using the sand to determine the direction of the wind - to help her bowl the perfect outswinger',
    'day11d': 'Climbing up the dunes were painfully difficult',
    'day11e': 'We stayed up till 12 looking up at the starry sky - and we saw a fwe shooting stars!',
    'day11f': 'It genuinely was the most stars we\'d seen in our lives',
    'day12a': 'We woke up to see the sunrise at the desert - it was cold but so worth it',
    'day12b': 'On the way from Bidiyah to Jebel Akhdar, we saw many cute camels in the wild',
    'day12c': 'Jebel Akhdar is an entirely skippable mountain village (especially if you\'ve been to ghats / mountains in India)',
    'day13a': 'The area of Birkat al mouz is an abandoned village where you can still see the outlines of older houses',
    'day13b': 'The opera house in Muscat is beautiful and glitzy',
    'day13c': 'We setup our tripod at the Royal Opera House and tried a few pics - none were great',
    'day13d': 'The top of the Mutrah fort gave us beautiful views of the corniche',
    'day13e': 'As the evening set in, the views we saw from the top of the Mutrah fort became prettier'
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

