// Theme Toggle Component

/**
 * Initializes the theme toggle functionality
 * Supports light/dark mode switching and persists preference
 */
export function initThemeToggle() {
  const themeToggle = document.querySelector('.toggle-slider');
  const darkModeToggleInput = document.querySelector('#darkMode');
  
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    if (darkModeToggleInput) {
      darkModeToggleInput.checked = true;
    }
  }
  
  // Function to toggle theme
  const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    
    // Save theme preference
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      if (darkModeToggleInput) {
        darkModeToggleInput.checked = true;
      }
    } else {
      localStorage.setItem('theme', 'light');
      if (darkModeToggleInput) {
        darkModeToggleInput.checked = false;
      }
    }
  };
  
  // Theme toggle in sidebar
  themeToggle.addEventListener('click', toggleTheme);
  
  // Theme toggle in settings if it exists
  if (darkModeToggleInput) {
    darkModeToggleInput.addEventListener('change', () => {
      if (darkModeToggleInput.checked !== document.body.classList.contains('dark-mode')) {
        toggleTheme();
      }
    });
  }
  
  console.log('Theme toggle initialized');
}