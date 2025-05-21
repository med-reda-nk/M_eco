// Navigation Component

/**
 * Initializes the navigation functionality for the dashboard
 */
export function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-links li');
  const pageContainers = document.querySelectorAll('.page-container');
  const pageTitle = document.querySelector('.page-title');
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  // Handle navigation link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Update active nav link
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
      
      // Show corresponding page container
      const targetPage = link.getAttribute('data-page');
      pageContainers.forEach(container => {
        container.classList.remove('active');
        if (container.id === targetPage) {
          container.classList.add('active');
        }
      });
      
      // Update page title
      pageTitle.textContent = link.querySelector('span').textContent;
      
      // Close sidebar on mobile after navigation
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
      }
    });
  });
  
  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (event) => {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(event.target) && 
        !menuToggle.contains(event.target) && 
        sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('open');
    }
  });
  
  console.log('Navigation initialized');
}