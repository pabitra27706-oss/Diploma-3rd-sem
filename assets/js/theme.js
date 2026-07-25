/**
 * Theme Management System
 * Handles dark/light mode toggle with localStorage persistence
 */

class ThemeManager {
  constructor() {
    this.storageKey = 'diploma-3rd-sem-theme';
    this.html = document.documentElement;
    this.toggle = null;
    
    this.init();
  }
  
  init() {
    // Set initial theme
    const savedTheme = this.getSavedTheme();
    const preferredTheme = savedTheme || this.getSystemPreference();
    this.setTheme(preferredTheme);
    
    // Setup toggle button after DOM loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupToggle());
    } else {
      this.setupToggle();
    }
    
    // Listen for system theme changes
    this.watchSystemPreference();
  }
  
  setupToggle() {
    this.toggle = document.getElementById('themeToggle');
    
    if (this.toggle) {
      this.toggle.addEventListener('click', () => {
        const currentTheme = this.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.saveTheme(newTheme);
      });
    }
  }
  
  setTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    
    // Update meta theme-color for browser chrome
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#1a1a2e' : '#ffffff');
    }
  }
  
  getSavedTheme() {
    return localStorage.getItem(this.storageKey);
  }
  
  saveTheme(theme) {
    localStorage.setItem(this.storageKey, theme);
  }
  
  getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  watchSystemPreference() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only apply system preference if user hasn't set a preference
      if (!this.getSavedTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();