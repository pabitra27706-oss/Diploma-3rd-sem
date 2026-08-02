/**
 * Theme Management System
 * Handles dark/light mode toggle with localStorage persistence
 * Enhanced: system preference sync, smooth transitions, meta tag updates
 */

class ThemeManager {
  constructor() {
    this.storageKey = 'diploma-3rd-sem-theme';
    this.html = document.documentElement;
    this.toggle = null;
    this.isAnimating = false;
    
    this.init();
  }
  
  // ================================
  // Initialization
  // ================================
  
  init() {
    // Apply theme immediately — before DOM is ready
    // Prevents flash of wrong theme (FOUT)
    const savedTheme = this.getSavedTheme();
    const preferredTheme = savedTheme || this.getSystemPreference();
    this.applyTheme(preferredTheme, false); // false = no transition on first load
    
    // Setup toggle after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupToggle());
    } else {
      this.setupToggle();
    }
    
    // Watch system preference changes
    this.watchSystemPreference();
  }
  
  // ================================
  // Toggle Button Setup
  // ================================
  
  setupToggle() {
    this.toggle = document.getElementById('themeToggle');
    
    if (!this.toggle) return;
    
    this.toggle.addEventListener('click', () => {
      if (this.isAnimating) return; // Prevent rapid clicking
      this.toggleTheme();
    });
    
    // Keyboard support — Space and Enter
    this.toggle.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!this.isAnimating) this.toggleTheme();
      }
    });
    
    // Update aria-label on init
    this.updateToggleAria();
  }
  
  // ================================
  // Theme Switching
  // ================================
  
  toggleTheme() {
    const current = this.html.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    
    this.applyTheme(newTheme, true); // true = animate transition
    this.saveTheme(newTheme);
    
    // Dispatch custom event so other scripts can react
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: newTheme }
    }));
  }
  
  applyTheme(theme, animate = true) {
    if (!animate) {
      // Block transitions during first load
      this.html.style.setProperty('--transition-base', '0ms');
      this.html.style.setProperty('--transition-fast', '0ms');
      this.html.style.setProperty('--transition-slow', '0ms');
    }
    
    this.html.setAttribute('data-theme', theme);
    this.updateMetaTheme(theme);
    this.updateToggleAria(theme);
    
    if (!animate) {
      // Re-enable transitions after paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.html.style.removeProperty('--transition-base');
          this.html.style.removeProperty('--transition-fast');
          this.html.style.removeProperty('--transition-slow');
        });
      });
    } else {
      // Brief animation lock — prevents toggle spam
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 300);
    }
  }
  
  // ================================
  // ARIA & Meta Updates
  // ================================
  
  updateToggleAria(theme) {
    if (!this.toggle) return;
    
    const current = theme || this.html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    
    this.toggle.setAttribute('aria-label', `Switch to ${next} mode`);
    this.toggle.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');
  }
  
  updateMetaTheme(theme) {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) return;
    
    const colors = {
      dark: '#1a1a2e',
      light: '#ffffff'
    };
    
    metaTheme.setAttribute('content', colors[theme] || colors.dark);
  }
  
  // ================================
  // Storage
  // ================================
  
  getSavedTheme() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      // Validate — only accept known values
      if (saved === 'dark' || saved === 'light') return saved;
      return null;
    } catch (e) {
      // localStorage unavailable (private browsing, etc.)
      console.warn('[Theme] localStorage unavailable:', e.message);
      return null;
    }
  }
  
  saveTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (e) {
      console.warn('[Theme] Could not save theme:', e.message);
    }
  }
  
  // ================================
  // System Preference
  // ================================
  
  getSystemPreference() {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ?
        'dark' :
        'light';
    } catch (e) {
      return 'dark'; // Safe default for this app
    }
  }
  
  watchSystemPreference() {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Only follow system if user has NOT manually set a preference
        if (!this.getSavedTheme()) {
          const systemTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(systemTheme, true);
          
          window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: systemTheme, source: 'system' }
          }));
        }
      });
    } catch (e) {
      console.warn('[Theme] Could not watch system preference:', e.message);
    }
  }
  
  // ================================
  // Public API
  // ================================
  
  /**
   * Get current theme
   * @returns {'dark'|'light'}
   */
  getTheme() {
    return this.html.getAttribute('data-theme') || 'dark';
  }
  
  /**
   * Set theme explicitly
   * @param {'dark'|'light'} theme
   */
  setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') {
      console.warn('[Theme] Invalid theme:', theme);
      return;
    }
    this.applyTheme(theme, true);
    this.saveTheme(theme);
  }
  
  /**
   * Check if current theme is dark
   * @returns {boolean}
   */
  isDark() {
    return this.getTheme() === 'dark';
  }
}

// ================================
// Initialize & Export
// ================================

const themeManager = new ThemeManager();

// Make globally accessible for other scripts
window.ThemeManager = themeManager;