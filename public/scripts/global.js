/**
 * Global Performance Optimizations
 * 
 * This script implements various performance optimizations for the entire website.
 * It uses modern browser features and falls back to simpler implementations when
 * those features aren't available.
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Only run performance optimizations if client-side JS is available
  // Ensure the site works without JavaScript
  
  // ===== Image Optimizations =====
  
  // Lazy load images using Intersection Observer
  const lazyLoadImages = () => {
    // Target all images with loading="lazy" that aren't already loaded
    const lazyImages = document.querySelectorAll('img[loading="lazy"]:not([data-loaded])');
    
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
            
            // If image has srcset in data attribute, load it
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            // Mark as loaded and stop observing
            img.dataset.loaded = true;
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px', // Start loading 50px before coming into view
        threshold: 0.01 // Trigger when 1% of the image is visible
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      const lazyLoad = () => {
        const scrollTop = window.pageYOffset;
        
        lazyImages.forEach(img => {
          if (img.offsetTop < window.innerHeight + scrollTop + 50) {
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            img.dataset.loaded = true;
          }
        });
      };
      
      // Add scroll event with throttling to improve performance
      let lazyLoadThrottleTimeout;
      
      const throttledLazyLoad = () => {
        if (lazyLoadThrottleTimeout) {
          clearTimeout(lazyLoadThrottleTimeout);
        }
        
        lazyLoadThrottleTimeout = setTimeout(lazyLoad, 20);
      };
      
      window.addEventListener('scroll', throttledLazyLoad);
      window.addEventListener('resize', throttledLazyLoad);
      window.addEventListener('orientationChange', throttledLazyLoad);
      
      // Initial load
      lazyLoad();
    }
  };
  
  // ===== Content Loading Optimizations =====
  
  // Apply content-visibility dynamically to improve rendering performance
  const optimizeContentVisibility = () => {
    const sections = document.querySelectorAll('section:not(.priority-high)');
    
    if ('IntersectionObserver' in window) {
      const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Only enable content-visibility for elements outside the viewport
          if (!entry.isIntersecting) {
            entry.target.classList.add('priority-low');
          } else {
            entry.target.classList.remove('priority-low');
            // Add priority-medium to maintain the layout space while optimizing rendering
            entry.target.classList.add('priority-medium');
          }
        });
      }, {
        rootMargin: '200px 0px', // Larger margin to start loading earlier
        threshold: 0
      });
      
      sections.forEach(section => {
        visibilityObserver.observe(section);
      });
    }
  };
  
  // ===== Event Handling Optimizations =====
  
  // Delegate common events to improve performance by reducing handlers
  const setupEventDelegation = () => {
    // Delegate click events for common interactive elements
    document.addEventListener('click', (e) => {
      // Handle dropdowns
      const dropdownToggle = e.target.closest('[data-toggle="dropdown"]');
      if (dropdownToggle) {
        const dropdownMenu = document.getElementById(dropdownToggle.getAttribute('aria-controls'));
        if (dropdownMenu) {
          dropdownMenu.classList.toggle('hidden');
          return;
        }
      }
      
      // Handle modals
      const modalToggle = e.target.closest('[data-toggle="modal"]');
      if (modalToggle) {
        const modalId = modalToggle.getAttribute('data-target');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.toggle('hidden');
          return;
        }
      }
      
      // Handle tabs
      const tabToggle = e.target.closest('[role="tab"]');
      if (tabToggle) {
        const tabGroup = tabToggle.closest('[role="tablist"]');
        if (tabGroup) {
          // Deactivate all tabs
          tabGroup.querySelectorAll('[role="tab"]').forEach(tab => {
            tab.setAttribute('aria-selected', 'false');
            tab.classList.remove('active');
          });
          
          // Activate clicked tab
          tabToggle.setAttribute('aria-selected', 'true');
          tabToggle.classList.add('active');
          
          // Show relevant panel
          const tabPanel = document.getElementById(tabToggle.getAttribute('aria-controls'));
          if (tabPanel) {
            const tabPanelContainer = tabPanel.parentNode;
            tabPanelContainer.querySelectorAll('[role="tabpanel"]').forEach(panel => {
              panel.classList.add('hidden');
            });
            tabPanel.classList.remove('hidden');
          }
          return;
        }
      }
    });
  };
  
  // ===== Navigation Optimizations =====
  
  // Prefetch pages on hover to make navigation faster
  const setupLinkPrefetching = () => {
    // Only prefetch links if browser is not on a slow connection
    if (navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType.includes('2g'))) {
      return;
    }
    
    // Get all internal links
    const links = document.querySelectorAll('a[href^="/"]:not([prefetch="false"])');
    let prefetched = new Set();
    
    // Use intersection observer to monitor which links are in viewport
    if ('IntersectionObserver' in window) {
      const linkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target;
            const href = link.getAttribute('href');
            
            // Only prefetch each URL once
            if (!prefetched.has(href)) {
              const prefetchLink = document.createElement('link');
              prefetchLink.rel = 'prefetch';
              prefetchLink.href = href;
              document.head.appendChild(prefetchLink);
              prefetched.add(href);
            }
            
            linkObserver.unobserve(link);
          }
        });
      }, {
        rootMargin: '0px 0px 200px 0px', // Prefetch links that are about to come into view
        threshold: 0.01
      });
      
      links.forEach(link => {
        linkObserver.observe(link);
        
        // Also prefetch on hover
        link.addEventListener('mouseenter', () => {
          const href = link.getAttribute('href');
          if (!prefetched.has(href)) {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = href;
            document.head.appendChild(prefetchLink);
            prefetched.add(href);
          }
        });
      });
    }
  };
  
  // ===== Performance Monitoring =====
  
  // Monitor performance metrics if available
  const monitorPerformance = () => {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      try {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          // Largest Contentful Paint should be under 2.5s for a good experience
          console.log('LCP:', lastEntry.startTime);
        }).observe({type: 'largest-contentful-paint', buffered: true});
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }
      
      // Monitor First Input Delay
      try {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            // First Input Delay should be under 100ms for a good experience
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        }).observe({type: 'first-input', buffered: true});
      } catch (e) {
        console.warn('FID monitoring not supported');
      }
      
      // Monitor Cumulative Layout Shift
      try {
        let cumulativeLayoutShift = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              cumulativeLayoutShift += entry.value;
            }
          }
          // CLS should be under 0.1 for a good experience
          console.log('CLS:', cumulativeLayoutShift);
        }).observe({type: 'layout-shift', buffered: true});
      } catch (e) {
        console.warn('CLS monitoring not supported');
      }
    }
  };
  
  // ===== Initialize Optimizations =====
  
  // Initialize all optimizations
  const initializeOptimizations = () => {
    lazyLoadImages();
    optimizeContentVisibility();
    setupEventDelegation();
    setupLinkPrefetching();
    monitorPerformance();
  };
  
  // Start optimizations
  initializeOptimizations();
}); 