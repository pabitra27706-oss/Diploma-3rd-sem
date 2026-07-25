/* ============================================================
   common.js — Shared JavaScript for all subjects pages
   WBSCTE Diploma 3rd Semester — Computer Science & Technology
   ENHANCED VERSION — Fixed theme toggle, added copy code
   ============================================================ */

/* Make showToast available globally before DOMContentLoaded */
window.showToast = function (message, duration) {
  duration = duration || 3000;
  var toast = document.getElementById("toast");
  var toastMsg = document.getElementById("toastMsg");
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, duration);
};

document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================
     FUNCTION 1: THEME SYSTEM
     ========================================================== */

  function getPreferredTheme() {
    var saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeIcons(theme);
  }

  function updateThemeIcons(theme) {
    var iconHTML = theme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    var label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

    var navToggle = document.getElementById("themeToggle");
    if (navToggle) {
      navToggle.innerHTML = iconHTML;  // FIXED: Use innerHTML instead of textContent
      navToggle.setAttribute("aria-label", label);
      navToggle.setAttribute("title", label);
    }

    var drawerToggle = document.getElementById("drawerThemeToggle");
    if (drawerToggle) {
      var drawerIconHTML = theme === "dark" 
        ? '<i class="fas fa-sun"></i> Light Mode' 
        : '<i class="fas fa-moon"></i> Dark Mode';
      drawerToggle.innerHTML = drawerIconHTML;  // FIXED: Use innerHTML
      drawerToggle.setAttribute("aria-label", label);
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme") || "light";
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  }

  /* Apply theme on load */
  applyTheme(getPreferredTheme());

  /* Attach theme toggle listeners */
  var themeToggleBtn = document.getElementById("themeToggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  var drawerThemeBtn = document.getElementById("drawerThemeToggle");
  if (drawerThemeBtn) {
    drawerThemeBtn.addEventListener("click", toggleTheme);
  }

  /* ==========================================================
     FUNCTION 2: MOBILE DRAWER SYSTEM
     ========================================================== */

  var menuBtn = document.getElementById("menuBtn");
  var mobileDrawer = document.getElementById("mobileDrawer");
  var navOverlay = document.getElementById("navOverlay");
  var drawerClose = document.getElementById("drawerClose");
  var drawerLinksContainer = document.getElementById("drawerLinks");

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add("open");
    if (navOverlay) navOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove("open");
    if (navOverlay) navOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", openDrawer);
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", closeDrawer);
  }

  if (drawerClose) {
    drawerClose.addEventListener("click", closeDrawer);
  }

  if (drawerLinksContainer) {
    var drawerAnchors = drawerLinksContainer.querySelectorAll("a");
    drawerAnchors.forEach(function (anchor) {
      anchor.addEventListener("click", closeDrawer);
    });
  }

  /* ==========================================================
     FUNCTION 3: SECTION COLLAPSE SYSTEM
     ========================================================== */

  function getSectionKey(sectionId) {
    return "section_collapsed_" + sectionId;
  }

  function collapseSection(sectionTitle, sectionContent, collapseIcon) {
    sectionContent.classList.add("collapsed");
    if (collapseIcon) collapseIcon.classList.add("rotated");
  }

  function expandSection(sectionTitle, sectionContent, collapseIcon) {
    sectionContent.classList.remove("collapsed");
    if (collapseIcon) collapseIcon.classList.remove("rotated");
  }

  var sectionTitles = document.querySelectorAll(".section-title");

  sectionTitles.forEach(function (titleEl) {
    var parentSection = titleEl.closest(".section");
    var sectionId = parentSection ? parentSection.id : null;
    var contentEl = titleEl.nextElementSibling;
    var iconEl = titleEl.querySelector(".collapse-icon");

    if (!contentEl || !contentEl.classList.contains("section-content")) {
      return;
    }

    /* Restore saved state */
    if (sectionId) {
      var savedState = localStorage.getItem(getSectionKey(sectionId));
      if (savedState === "collapsed") {
        collapseSection(titleEl, contentEl, iconEl);
      }
    }

    /* Toggle on click */
    titleEl.addEventListener("click", function () {
      var isCollapsed = contentEl.classList.contains("collapsed");
      if (isCollapsed) {
        expandSection(titleEl, contentEl, iconEl);
        if (sectionId) localStorage.setItem(getSectionKey(sectionId), "expanded");
      } else {
        collapseSection(titleEl, contentEl, iconEl);
        if (sectionId) localStorage.setItem(getSectionKey(sectionId), "collapsed");
      }
    });
  });

  /* ==========================================================
     FUNCTION 4: SCROLL PROGRESS BAR
     ========================================================== */

  var scrollProgressBar = document.getElementById("scrollProgress");

  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;
    var scrollable = scrollHeight - clientHeight;
    if (scrollable <= 0) {
      scrollProgressBar.style.width = "100%";
      return;
    }
    var percent = (scrollTop / scrollable) * 100;
    scrollProgressBar.style.width = percent + "%";
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ==========================================================
     FUNCTION 5: BACK TO TOP FAB
     ========================================================== */

  var fabTop = document.getElementById("fabTop");

  function updateFabTopVisibility() {
    if (!fabTop) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 300) {
      fabTop.classList.add("visible");
    } else {
      fabTop.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", updateFabTopVisibility, { passive: true });
  updateFabTopVisibility();

  if (fabTop) {
    fabTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==========================================================
     FUNCTION 6: PRINT BUTTON
     ========================================================== */

  var fabPrint = document.getElementById("fabPrint");
  if (fabPrint) {
    fabPrint.addEventListener("click", function () {
      window.print();
    });
  }

  var drawerPrint = document.getElementById("drawerPrint");
  if (drawerPrint) {
    drawerPrint.addEventListener("click", function () {
      closeDrawer();
      setTimeout(function () {
        window.print();
      }, 300);
    });
  }

  /* ==========================================================
     FUNCTION 7: BOOKMARK SYSTEM
     ========================================================== */

  var fabSave = document.getElementById("fabSave");
  if (fabSave) {
    fabSave.addEventListener("click", function () {
      var currentPage = window.location.href;
      var bookmarks;
      try {
        bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      } catch (e) {
        bookmarks = [];
      }

      if (bookmarks.indexOf(currentPage) !== -1) {
        showToast("Already bookmarked! ✓");
      } else {
        bookmarks.push(currentPage);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        showToast("Page bookmarked! 🔖");
      }
    });
  }

  /* ==========================================================
     FUNCTION 8: MCQ ANSWER TOGGLE
     ========================================================== */

  var toggleBtns = document.querySelectorAll(".toggle-btn");

  toggleBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-target");
      if (!targetId) return;
      var targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      var isOpen = targetEl.classList.contains("open");

      if (isOpen) {
        targetEl.classList.remove("open");
        btn.innerHTML = '<i class="fas fa-eye"></i> Show Answer';
      } else {
        targetEl.classList.add("open");
        btn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Answer';
      }
    });
  });

  /* ==========================================================
     FUNCTION 9: ACTIVE SECTION HIGHLIGHT IN NAVBAR
     ========================================================== */

  var navLinksList = document.querySelectorAll(".nav-links a");

  function clearActiveLinks() {
    navLinksList.forEach(function (link) {
      link.classList.remove("active");
    });
  }

  if ("IntersectionObserver" in window && navLinksList.length > 0) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            clearActiveLinks();
            navLinksList.forEach(function (link) {
              var href = link.getAttribute("href");
              if (href && href === "#" + id) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0
      }
    );

    var allSections = document.querySelectorAll("section.section[id]");
    allSections.forEach(function (sec) {
      sectionObserver.observe(sec);
    });
  }

  /* ==========================================================
     FUNCTION 10: SMOOTH ANCHOR SCROLL
     ========================================================== */

  var navbar = document.querySelector(".navbar");

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      var targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      var navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
      var elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
      var offsetPosition = elementTop - navbarHeight - 12;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    });
  });

  /* ==========================================================
     FUNCTION 11: COPY CODE FUNCTIONALITY (NEW!)
     ========================================================== */

  // Add copy buttons to all code boxes
  var codeBoxes = document.querySelectorAll('.code-box pre, pre');
  
  codeBoxes.forEach(function(pre) {
    // Skip if already has a copy button
    if (pre.querySelector('.copy-code-btn')) return;
    
    // Create copy button
    var copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
    
    // Make pre element relative positioned
    pre.style.position = 'relative';
    
    // Insert button
    pre.appendChild(copyBtn);
    
    // Copy functionality
    copyBtn.addEventListener('click', function() {
      var code = pre.querySelector('code') || pre;
      var textToCopy = code.textContent;
      
      // Use modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(function() {
          copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          copyBtn.classList.add('copied');
          showToast('Code copied to clipboard! 📋');
          
          setTimeout(function() {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        }).catch(function(err) {
          console.error('Failed to copy:', err);
          fallbackCopy(textToCopy, copyBtn);
        });
      } else {
        // Fallback for older browsers
        fallbackCopy(textToCopy, copyBtn);
      }
    });
  });
  
  // Fallback copy method for older browsers
  function fallbackCopy(text, button) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      var success = document.execCommand('copy');
      if (success) {
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        showToast('Code copied to clipboard! 📋');
        
        setTimeout(function() {
          button.innerHTML = '<i class="fas fa-copy"></i> Copy';
          button.classList.remove('copied');
        }, 2000);
      } else {
        showToast('Copy failed. Please copy manually.');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      showToast('Copy not supported. Please copy manually.');
    }
    
    document.body.removeChild(textarea);
  }

}); /* End DOMContentLoaded */