/* ============================================================
   common.js — Shared JavaScript for all subject pages
   WBSCTE Diploma 3rd Semester — Computer Science & Technology
   ENHANCED VERSION 2.0 — Full Feature Set

   FEATURES:
   1.  Theme System
   2.  Mobile Drawer
   3.  Section Collapse (Smooth Animation)
   4.  Scroll Progress Bar
   5.  Back to Top (FAB)
   6.  Print
   7.  Bookmark System (Enhanced)
   8.  MCQ Answer Toggle
   9.  Active Section Highlight
   10. Smooth Anchor Scroll
   11. Copy Code (Fixed)
   12. Reading Time Estimator
   13. Typewriter Effect
   14. Number Counter Animation
   15. Stagger Animation Observer
   16. FAB Speed Dial
   17. Command Palette
   18. Keyboard Shortcuts
   19. Progress Widget
   20. Toast System (Enhanced)
   ============================================================ */


/* ============================================================
   GLOBAL: Toast (Available before DOMContentLoaded)
   ============================================================ */

window.showToast = function (message, duration, type) {
  duration = duration || 3000;
  type = type || "info";

  var toast = document.getElementById("toast");
  var toastMsg = document.getElementById("toastMsg");
  if (!toast || !toastMsg) return;

  /* Remove old type classes */
  toast.classList.remove("toast-success", "toast-warning", "toast-error", "toast-info");
  toast.classList.add("toast-" + type);

  toastMsg.textContent = message;
  toast.classList.add("show");

  /* Clear any existing timeout */
  if (window._toastTimeout) clearTimeout(window._toastTimeout);

  window._toastTimeout = setTimeout(function () {
    toast.classList.remove("show");
  }, duration);
};


/* ============================================================
   GLOBAL: Utility Helpers
   ============================================================ */

window.StudyApp = window.StudyApp || {};

StudyApp.debounce = function (fn, delay) {
  var timer;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};

StudyApp.getPageId = function () {
  return window.location.pathname.replace(/[^a-zA-Z0-9]/g, "_");
};

StudyApp.getSubjectFromBody = function () {
  var body = document.body;
  var classes = body.className.split(" ");
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].indexOf("subject-") === 0) {
      return classes[i].replace("subject-", "").toUpperCase();
    }
  }
  return "UNKNOWN";
};


/* ============================================================
   MAIN: DOMContentLoaded
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {


  /* ==========================================================
     1. THEME SYSTEM
     ========================================================== */

  function getPreferredTheme() {
    var saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
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
    var iconHTML = theme === "dark"
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
    var label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

    var navToggle = document.getElementById("themeToggle");
    if (navToggle) {
      navToggle.innerHTML = iconHTML;
      navToggle.setAttribute("aria-label", label);
      navToggle.setAttribute("title", label);
    }

    var drawerToggle = document.getElementById("drawerThemeToggle");
    if (drawerToggle) {
      var drawerIcon = theme === "dark"
        ? '<i class="fas fa-sun"></i> Light Mode'
        : '<i class="fas fa-moon"></i> Dark Mode';
      drawerToggle.innerHTML = drawerIcon;
      drawerToggle.setAttribute("aria-label", label);
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  }

  applyTheme(getPreferredTheme());

  var themeToggleBtn = document.getElementById("themeToggle");
  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);

  var drawerThemeBtn = document.getElementById("drawerThemeToggle");
  if (drawerThemeBtn) drawerThemeBtn.addEventListener("click", toggleTheme);


  /* ==========================================================
     2. MOBILE DRAWER SYSTEM
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

    /* Focus trap — focus first link */
    setTimeout(function () {
      var firstLink = mobileDrawer.querySelector("a, button");
      if (firstLink) firstLink.focus();
    }, 100);
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove("open");
    if (navOverlay) navOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (menuBtn) menuBtn.addEventListener("click", openDrawer);
  if (navOverlay) navOverlay.addEventListener("click", closeDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);

  if (drawerLinksContainer) {
    var drawerAnchors = drawerLinksContainer.querySelectorAll("a");
    drawerAnchors.forEach(function (a) {
      a.addEventListener("click", closeDrawer);
    });
  }

  /* Escape key closes drawer */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileDrawer && mobileDrawer.classList.contains("open")) {
      closeDrawer();
    }
  });


  /* ==========================================================
     3. SECTION COLLAPSE (Smooth max-height Animation)
     ========================================================== */

  var sectionTitles = document.querySelectorAll(".section-title");

  function getSectionKey(sectionId) {
    return "section_collapsed_" + StudyApp.getPageId() + "_" + sectionId;
  }

  function collapseSection(contentEl, iconEl) {
    contentEl.style.maxHeight = contentEl.scrollHeight + "px";
    /* Force reflow */
    contentEl.offsetHeight;
    contentEl.classList.add("collapsed");
    contentEl.style.maxHeight = "0";
    if (iconEl) iconEl.classList.add("rotated");
  }

  function expandSection(contentEl, iconEl) {
    contentEl.classList.remove("collapsed");
    contentEl.style.maxHeight = contentEl.scrollHeight + "px";
    if (iconEl) iconEl.classList.remove("rotated");

    /* After transition, remove inline max-height for dynamic content */
    var onEnd = function () {
      contentEl.style.maxHeight = "";
      contentEl.removeEventListener("transitionend", onEnd);
    };
    contentEl.addEventListener("transitionend", onEnd);
  }

  sectionTitles.forEach(function (titleEl) {
    var parentSection = titleEl.closest(".section");
    var sectionId = parentSection ? parentSection.id : null;
    var contentEl = titleEl.nextElementSibling;
    var iconEl = titleEl.querySelector(".collapse-icon");

    if (!contentEl || !contentEl.classList.contains("section-content")) return;

    /* Make section title keyboard accessible */
    titleEl.setAttribute("tabindex", "0");
    titleEl.setAttribute("role", "button");
    titleEl.setAttribute("aria-expanded", "true");

    /* Restore saved state */
    if (sectionId) {
      var saved = localStorage.getItem(getSectionKey(sectionId));
      if (saved === "collapsed") {
        contentEl.classList.add("collapsed");
        contentEl.style.maxHeight = "0";
        if (iconEl) iconEl.classList.add("rotated");
        titleEl.setAttribute("aria-expanded", "false");
      }
    }

    /* Click to toggle */
    titleEl.addEventListener("click", function () {
      var isCollapsed = contentEl.classList.contains("collapsed");
      if (isCollapsed) {
        expandSection(contentEl, iconEl);
        titleEl.setAttribute("aria-expanded", "true");
        if (sectionId) localStorage.setItem(getSectionKey(sectionId), "expanded");
      } else {
        collapseSection(contentEl, iconEl);
        titleEl.setAttribute("aria-expanded", "false");
        if (sectionId) localStorage.setItem(getSectionKey(sectionId), "collapsed");
      }
    });

    /* Keyboard: Enter or Space */
    titleEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        titleEl.click();
      }
    });
  });


  /* ==========================================================
     4. SCROLL PROGRESS BAR
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
    scrollProgressBar.style.width = (scrollTop / scrollable * 100) + "%";
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();


  /* ==========================================================
     5. BACK TO TOP
     ========================================================== */

  var fabTopOld = document.getElementById("fabTop");

  function updateBackToTop() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    /* Old FAB system */
    if (fabTopOld) {
      if (scrollTop > 300) {
        fabTopOld.classList.add("visible");
      } else {
        fabTopOld.classList.remove("visible");
      }
    }

    /* New speed dial system */
    var speedDialTop = document.querySelector('.fab-dial-item[data-action="top"]');
    if (speedDialTop) {
      if (scrollTop > 300) {
        speedDialTop.classList.add("visible");
      } else {
        speedDialTop.classList.remove("visible");
      }
    }
  }

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  if (fabTopOld) {
    fabTopOld.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  /* ==========================================================
     6. PRINT
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
      setTimeout(function () { window.print(); }, 300);
    });
  }


  /* ==========================================================
     7. BOOKMARK SYSTEM (Enhanced)
     ========================================================== */

  function getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem("bookmarks")) || [];
    } catch (e) {
      return [];
    }
  }

  function saveBookmark() {
    var currentPage = window.location.href;
    var bookmarks = getBookmarks();

    /* Check if already bookmarked */
    var exists = false;
    for (var i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i].url === currentPage || bookmarks[i] === currentPage) {
        exists = true;
        break;
      }
    }

    if (exists) {
      showToast("Already bookmarked! ✓", 2000, "info");
    } else {
      bookmarks.push({
        url: currentPage,
        title: document.title,
        subject: StudyApp.getSubjectFromBody(),
        timestamp: Date.now()
      });
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      showToast("Page bookmarked! 🔖", 2500, "success");
    }
  }

  var fabSave = document.getElementById("fabSave");
  if (fabSave) fabSave.addEventListener("click", saveBookmark);


  /* ==========================================================
     8. MCQ ANSWER TOGGLE
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
     9. ACTIVE SECTION HIGHLIGHT IN NAVBAR
     ========================================================== */

  var navLinksList = document.querySelectorAll(".nav-links a");

  function clearActiveLinks() {
    navLinksList.forEach(function (link) {
      link.classList.remove("active");
    });
  }

  if ("IntersectionObserver" in window && navLinksList.length > 0) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          clearActiveLinks();
          navLinksList.forEach(function (link) {
            var href = link.getAttribute("href");
            if (href && href === "#" + id) link.classList.add("active");
          });
        }
      });
    }, {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0
    });

    document.querySelectorAll("section.section[id]").forEach(function (sec) {
      navObserver.observe(sec);
    });
  }


  /* ==========================================================
     10. SMOOTH ANCHOR SCROLL
     ========================================================== */

  var navbar = document.querySelector(".navbar");

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      var targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();
      closeDrawer();

      var navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
      var elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
      var offsetPosition = elementTop - navbarHeight - 12;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });

      /* Expand section if collapsed */
      var section = targetElement.closest(".section");
      if (section) {
        var content = section.querySelector(".section-content");
        var icon = section.querySelector(".collapse-icon");
        if (content && content.classList.contains("collapsed")) {
          expandSection(content, icon);
          var titleEl = section.querySelector(".section-title");
          if (titleEl) titleEl.setAttribute("aria-expanded", "true");
          if (section.id) {
            localStorage.setItem(getSectionKey(section.id), "expanded");
          }
        }
      }
    });
  });


  /* ==========================================================
     11. COPY CODE (Fixed)
     ========================================================== */

  function initCopyCode() {
    /* Handle .code-box div wrappers */
    var codeBoxes = document.querySelectorAll(".code-box");
    codeBoxes.forEach(function (box) {
      if (box.querySelector(".copy-code-btn")) return;
      setupCopyButton(box, box.querySelector("pre") || box);
    });

    /* Handle standalone pre elements NOT inside .code-box */
    var allPres = document.querySelectorAll("pre");
    allPres.forEach(function (pre) {
      if (pre.closest(".code-box")) return;
      if (pre.querySelector(".copy-code-btn")) return;
      if (pre.closest(".copy-code-container")) return;
      setupCopyButton(pre, pre);
    });
  }

  function setupCopyButton(container, codeElement) {
    var btnContainer = document.createElement("div");
    btnContainer.className = "copy-code-container";

    var copyBtn = document.createElement("button");
    copyBtn.className = "copy-code-btn";
    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
    copyBtn.setAttribute("aria-label", "Copy code to clipboard");

    btnContainer.appendChild(copyBtn);

    /* Insert container at the beginning of the parent */
    container.style.position = "relative";
    container.insertBefore(btnContainer, container.firstChild);

    copyBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var code = codeElement.querySelector("code") || codeElement;
      /* Get text but exclude copy button text */
      var text = code.textContent || code.innerText;
      /* Clean up potential button text artifacts */
      text = text.replace(/^\s*Copy\s*/i, "").replace(/^\s*Copied!\s*/i, "").trim();

      copyToClipboard(text, copyBtn);
    });
  }

  function copyToClipboard(text, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        onCopySuccess(button);
      }).catch(function () {
        fallbackCopy(text, button);
      });
    } else {
      fallbackCopy(text, button);
    }
  }

  function fallbackCopy(text, button) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = "position:fixed;opacity:0;left:-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      var success = document.execCommand("copy");
      if (success) {
        onCopySuccess(button);
      } else {
        showToast("Copy failed. Please copy manually.", 3000, "error");
      }
    } catch (err) {
      showToast("Copy not supported in this browser.", 3000, "error");
    }
    document.body.removeChild(textarea);
  }

  function onCopySuccess(button) {
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.classList.add("copied");
    showToast("Code copied to clipboard! 📋", 2000, "success");

    setTimeout(function () {
      button.innerHTML = '<i class="fas fa-copy"></i> Copy';
      button.classList.remove("copied");
    }, 2000);
  }

  initCopyCode();


  /* ==========================================================
     12. READING TIME ESTIMATOR
     ========================================================== */

  function initReadingTime() {
    var container = document.querySelector(".container");
    var headerContent = document.querySelector(".header-content");
    if (!container || !headerContent) return;

    var text = container.textContent || container.innerText;
    var words = text.trim().split(/\s+/).length;
    var minutes = Math.ceil(words / 200);

    var badge = document.createElement("div");
    badge.className = "reading-time-badge";
    badge.innerHTML = '<i class="fas fa-book-reader"></i> ~' + minutes + " min read";

    headerContent.appendChild(badge);
  }

  initReadingTime();


  /* ==========================================================
     13. TYPEWRITER EFFECT
     ========================================================== */

  function initTypewriter() {
    var elements = document.querySelectorAll(".typewriter");
    if (!elements.length) return;

    /* Skip if reduced motion preferred */
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach(function (el) {
        el.classList.add("done", "no-cursor");
      });
      return;
    }

    /* Only run on first visit per page */
    var key = "typewriter_" + StudyApp.getPageId();
    if (localStorage.getItem(key)) {
      elements.forEach(function (el) {
        el.classList.add("done", "no-cursor");
      });
      return;
    }

    elements.forEach(function (el) {
      var fullText = el.textContent;
      el.textContent = "";
      el.style.maxWidth = "0";
      el.classList.remove("done", "no-cursor");

      var charIndex = 0;
      var speed = parseInt(el.getAttribute("data-speed")) || 60;

      function typeChar() {
        if (charIndex < fullText.length) {
          el.textContent += fullText.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, speed);
        } else {
          el.classList.add("done");
          /* Stop cursor after 3 seconds */
          setTimeout(function () {
            el.classList.add("no-cursor");
          }, 3000);
        }
      }

      /* Small delay before starting */
      setTimeout(function () {
        el.style.maxWidth = "100%";
        typeChar();
      }, 500);
    });

    localStorage.setItem(key, "true");
  }

  initTypewriter();


  /* ==========================================================
     14. NUMBER COUNTER ANIMATION
     ========================================================== */

  function initCounters() {
    var items = document.querySelectorAll(".info-item[data-count]");
    if (!items.length) return;

    /* Skip if reduced motion */
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    items.forEach(function (item) {
      var target = parseInt(item.getAttribute("data-count"));
      var suffix = item.getAttribute("data-suffix") || "";
      var span = item.querySelector(".count-value");
      if (!span || isNaN(target)) return;

      var duration = 1500;
      var startTime = null;

      function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        var progress = Math.min((currentTime - startTime) / duration, 1);
        /* Ease out cubic */
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        span.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          span.textContent = target + suffix;
        }
      }

      /* Start when element becomes visible */
      if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) {
            requestAnimationFrame(animate);
            observer.disconnect();
          }
        }, { threshold: 0.5 });
        observer.observe(item);
      } else {
        requestAnimationFrame(animate);
      }
    });
  }

  initCounters();


  /* ==========================================================
     15. STAGGER ANIMATION OBSERVER
     ========================================================== */

  function initStaggerAnimations() {
    var animateElements = document.querySelectorAll(
      ".animate-in, .animate-scale, .animate-left, .animate-right"
    );

    if (!animateElements.length) return;

    /* Skip if reduced motion */
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animateElements.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    if ("IntersectionObserver" in window) {
      var staggerObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            staggerObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      });

      animateElements.forEach(function (el) {
        staggerObserver.observe(el);
      });
    } else {
      /* Fallback: show all immediately */
      animateElements.forEach(function (el) {
        el.classList.add("visible");
      });
    }

    /* Also animate mark chart bars */
    var chartBars = document.querySelectorAll(".mark-chart-bar");
    if (chartBars.length && "IntersectionObserver" in window) {
      var chartObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            chartObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      chartBars.forEach(function (bar) {
        chartObserver.observe(bar);
      });
    }
  }

  initStaggerAnimations();


  /* ==========================================================
     16. FAB SPEED DIAL
     ========================================================== */

  function initFabSpeedDial() {
    var dial = document.querySelector(".fab-speed-dial");
    if (!dial) return;

    var mainBtn = dial.querySelector(".fab-main");
    if (!mainBtn) return;

    var isOpen = false;

    function toggleDial() {
      isOpen = !isOpen;
      dial.classList.toggle("open", isOpen);
    }

    function closeDial() {
      isOpen = false;
      dial.classList.remove("open");
    }

    mainBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleDial();
    });

    /* Close on outside click */
    document.addEventListener("click", function (e) {
      if (isOpen && !dial.contains(e.target)) closeDial();
    });

    /* Close on scroll */
    var closeOnScroll = StudyApp.debounce(function () {
      if (isOpen) closeDial();
    }, 150);
    window.addEventListener("scroll", closeOnScroll, { passive: true });

    /* Dial item actions */
    var dialItems = dial.querySelectorAll(".fab-dial-item");
    dialItems.forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        var action = item.getAttribute("data-action");

        switch (action) {
          case "top":
            window.scrollTo({ top: 0, behavior: "smooth" });
            break;
          case "print":
            window.print();
            break;
          case "bookmark":
            saveBookmark();
            break;
          case "notes":
            if (window.NotesTracker && window.NotesTracker.togglePanel) {
              window.NotesTracker.togglePanel();
            } else {
              showToast("Notes system loading...", 2000, "info");
            }
            break;
        }

        closeDial();
      });
    });
  }

  initFabSpeedDial();


  /* ==========================================================
     17. COMMAND PALETTE
     ========================================================== */

  var cmdOverlay = null;
  var cmdBox = null;
  var cmdInput = null;
  var cmdResults = null;
  var cmdSelectedIndex = -1;
  var cmdSearchIndex = [];
  var cmdIsOpen = false;

  function buildSearchIndex() {
    cmdSearchIndex = [];

    /* Sections on current page */
    document.querySelectorAll("section.section[id]").forEach(function (sec) {
      var title = sec.querySelector(".section-title");
      var titleText = "";
      if (title) {
        titleText = title.textContent.replace(/[\s\n]+/g, " ").trim();
        /* Remove collapse icon text */
        var iconText = title.querySelector(".collapse-icon");
        if (iconText) titleText = titleText.replace(iconText.textContent, "").trim();
      }

      cmdSearchIndex.push({
        title: titleText || sec.id,
        icon: "fas fa-bookmark",
        type: "Section",
        action: function () {
          var href = "#" + sec.id;
          var target = document.querySelector(href);
          if (target) {
            var navH = navbar ? navbar.getBoundingClientRect().height : 0;
            var top = target.getBoundingClientRect().top + window.pageYOffset - navH - 12;
            window.scrollTo({ top: top, behavior: "smooth" });

            /* Expand if collapsed */
            var content = sec.querySelector(".section-content");
            var icon = sec.querySelector(".collapse-icon");
            if (content && content.classList.contains("collapsed")) {
              expandSection(content, icon);
            }
          }
        }
      });
    });

    /* Nav links */
    document.querySelectorAll(".nav-links a, .drawer-links a").forEach(function (a) {
      var text = a.textContent.trim();
      var href = a.getAttribute("href");

      /* Skip if already added as section */
      var isDuplicate = false;
      for (var i = 0; i < cmdSearchIndex.length; i++) {
        if (cmdSearchIndex[i].title === text) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate && text) {
        cmdSearchIndex.push({
          title: text,
          icon: "fas fa-link",
          type: "Navigation",
          action: function () {
            if (href && href.startsWith("#")) {
              var target = document.querySelector(href);
              if (target) {
                var navH = navbar ? navbar.getBoundingClientRect().height : 0;
                var top = target.getBoundingClientRect().top + window.pageYOffset - navH - 12;
                window.scrollTo({ top: top, behavior: "smooth" });
              }
            } else if (href) {
              window.location.href = href;
            }
          }
        });
      }
    });

    /* Keyboard shortcuts */
    cmdSearchIndex.push({
      title: "Toggle Theme",
      icon: "fas fa-moon",
      type: "Action",
      kbd: "T",
      action: toggleTheme
    });

    cmdSearchIndex.push({
      title: "Print Page",
      icon: "fas fa-print",
      type: "Action",
      kbd: "P",
      action: function () { window.print(); }
    });

    cmdSearchIndex.push({
      title: "Bookmark Page",
      icon: "fas fa-bookmark",
      type: "Action",
      kbd: "B",
      action: saveBookmark
    });

    cmdSearchIndex.push({
      title: "Open Notes",
      icon: "fas fa-sticky-note",
      type: "Action",
      kbd: "N",
      action: function () {
        if (window.NotesTracker && window.NotesTracker.togglePanel) {
          window.NotesTracker.togglePanel();
        }
      }
    });

    cmdSearchIndex.push({
      title: "Scroll to Top",
      icon: "fas fa-arrow-up",
      type: "Action",
      action: function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    cmdSearchIndex.push({
      title: "Keyboard Shortcuts",
      icon: "fas fa-keyboard",
      type: "Help",
      kbd: "?",
      action: showShortcutsModal
    });
  }

  function createCommandPalette() {
    /* Overlay */
    cmdOverlay = document.createElement("div");
    cmdOverlay.className = "cmd-overlay";
    cmdOverlay.addEventListener("click", closeCommandPalette);

    /* Box */
    cmdBox = document.createElement("div");
    cmdBox.className = "cmd-box";

    /* Input wrapper */
    var inputWrapper = document.createElement("div");
    inputWrapper.className = "cmd-input-wrapper";
    inputWrapper.innerHTML = '<i class="fas fa-search"></i>';

    cmdInput = document.createElement("input");
    cmdInput.className = "cmd-input";
    cmdInput.type = "text";
    cmdInput.placeholder = "Search sections, actions...";
    cmdInput.setAttribute("autocomplete", "off");
    cmdInput.setAttribute("spellcheck", "false");

    var hint = document.createElement("span");
    hint.className = "cmd-input-hint";
    hint.textContent = "ESC";

    inputWrapper.appendChild(cmdInput);
    inputWrapper.appendChild(hint);

    /* Results */
    cmdResults = document.createElement("div");
    cmdResults.className = "cmd-results";

    /* Footer */
    var footer = document.createElement("div");
    footer.className = "cmd-footer";
    footer.innerHTML =
      "<span><kbd>↑↓</kbd> Navigate</span>" +
      "<span><kbd>↵</kbd> Select</span>" +
      "<span><kbd>esc</kbd> Close</span>";

    cmdBox.appendChild(inputWrapper);
    cmdBox.appendChild(cmdResults);
    cmdBox.appendChild(footer);

    document.body.appendChild(cmdOverlay);
    document.body.appendChild(cmdBox);

    /* Input events */
    cmdInput.addEventListener("input", function () {
      filterCommandResults(cmdInput.value);
    });

    cmdInput.addEventListener("keydown", function (e) {
      var items = cmdResults.querySelectorAll(".cmd-item");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        cmdSelectedIndex = Math.min(cmdSelectedIndex + 1, items.length - 1);
        updateCmdSelection(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        cmdSelectedIndex = Math.max(cmdSelectedIndex - 1, 0);
        updateCmdSelection(items);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (items[cmdSelectedIndex]) {
          items[cmdSelectedIndex].click();
        }
      } else if (e.key === "Escape") {
        closeCommandPalette();
      }
    });
  }

  function filterCommandResults(query) {
    if (!cmdResults) return;
    cmdResults.innerHTML = "";
    cmdSelectedIndex = -1;

    var q = query.toLowerCase().trim();
    var filtered = cmdSearchIndex.filter(function (item) {
      return !q || item.title.toLowerCase().indexOf(q) !== -1;
    });

    if (filtered.length === 0) {
      cmdResults.innerHTML =
        '<div class="cmd-empty">' +
        '<i class="fas fa-search"></i>' +
        "No results found" +
        "</div>";
      return;
    }

    filtered.forEach(function (item, index) {
      var el = document.createElement("div");
      el.className = "cmd-item";
      if (index === 0) {
        el.classList.add("selected");
        cmdSelectedIndex = 0;
      }

      var iconEl = '<i class="' + item.icon + '"></i>';
      var titleEl = '<span class="cmd-item-title">' + item.title + "</span>";
      var catEl = '<span class="cmd-item-category">' + item.type + "</span>";
      var kbdEl = item.kbd
        ? '<span class="cmd-kbd">' + item.kbd + "</span>"
        : "";

      el.innerHTML = iconEl + titleEl + catEl + kbdEl;

      el.addEventListener("click", function () {
        closeCommandPalette();
        setTimeout(function () {
          item.action();
        }, 100);
      });

      el.addEventListener("mouseenter", function () {
        var allItems = cmdResults.querySelectorAll(".cmd-item");
        allItems.forEach(function (i) { i.classList.remove("selected"); });
        el.classList.add("selected");
        cmdSelectedIndex = index;
      });

      cmdResults.appendChild(el);
    });
  }

  function updateCmdSelection(items) {
    items.forEach(function (item, i) {
      item.classList.toggle("selected", i === cmdSelectedIndex);
    });

    /* Scroll into view */
    if (items[cmdSelectedIndex]) {
      items[cmdSelectedIndex].scrollIntoView({ block: "nearest" });
    }
  }

  function openCommandPalette() {
    if (cmdIsOpen) return;
    if (!cmdOverlay) createCommandPalette();

    buildSearchIndex();

    cmdOverlay.classList.add("open");
    cmdBox.classList.add("open");
    cmdIsOpen = true;
    document.body.style.overflow = "hidden";

    cmdInput.value = "";
    filterCommandResults("");

    setTimeout(function () {
      cmdInput.focus();
    }, 100);
  }

  function closeCommandPalette() {
    if (!cmdIsOpen) return;
    if (cmdOverlay) cmdOverlay.classList.remove("open");
    if (cmdBox) cmdBox.classList.remove("open");
    cmdIsOpen = false;
    document.body.style.overflow = "";
  }

  /* Expose globally */
  window.openCommandPalette = openCommandPalette;
  window.closeCommandPalette = closeCommandPalette;


  /* ==========================================================
     18. KEYBOARD SHORTCUTS
     ========================================================== */

  var shortcutsModalOverlay = null;

  function showShortcutsModal() {
    if (!shortcutsModalOverlay) {
      shortcutsModalOverlay = document.createElement("div");
      shortcutsModalOverlay.className = "shortcuts-modal-overlay";

      var modal = document.createElement("div");
      modal.className = "shortcuts-modal";

      modal.innerHTML =
        '<h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>' +
        shortcutRow("Toggle Theme", "T") +
        shortcutRow("Print Page", "P") +
        shortcutRow("Bookmark Page", "B") +
        shortcutRow("Search / Command", "/") +
        shortcutRow("Search / Command", "Ctrl", "K") +
        shortcutRow("Open Notes", "N") +
        shortcutRow("Close Panel", "Esc") +
        shortcutRow("Show This Help", "?");

      shortcutsModalOverlay.appendChild(modal);
      document.body.appendChild(shortcutsModalOverlay);

      shortcutsModalOverlay.addEventListener("click", function (e) {
        if (e.target === shortcutsModalOverlay) {
          shortcutsModalOverlay.classList.remove("open");
        }
      });
    }

    shortcutsModalOverlay.classList.add("open");
  }

  function shortcutRow(label, key1, key2) {
    var keys = '<kbd>' + key1 + '</kbd>';
    if (key2) keys += ' <kbd>' + key2 + '</kbd>';
    return '<div class="shortcut-row">' +
      '<span class="shortcut-label">' + label + '</span>' +
      '<span class="shortcut-keys">' + keys + '</span>' +
      '</div>';
  }

  document.addEventListener("keydown", function (e) {
    /* Ignore when typing in inputs */
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.target.isContentEditable) return;

    /* Don't interfere with modified keys (except Ctrl+K) */
    if (e.altKey || e.metaKey) return;

    /* Ctrl+K — Command palette */
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      if (cmdIsOpen) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
      return;
    }

    if (e.ctrlKey) return;

    /* Escape — close everything */
    if (e.key === "Escape") {
      if (cmdIsOpen) {
        closeCommandPalette();
        return;
      }
      if (shortcutsModalOverlay && shortcutsModalOverlay.classList.contains("open")) {
        shortcutsModalOverlay.classList.remove("open");
        return;
      }
      if (mobileDrawer && mobileDrawer.classList.contains("open")) {
        closeDrawer();
        return;
      }
      if (window.NotesTracker && window.NotesTracker.isOpen && window.NotesTracker.isOpen()) {
        window.NotesTracker.closePanel();
        return;
      }
      return;
    }

    switch (e.key.toLowerCase()) {
      case "t":
        toggleTheme();
        break;
      case "p":
        window.print();
        break;
      case "b":
        saveBookmark();
        break;
      case "/":
        e.preventDefault();
        openCommandPalette();
        break;
      case "?":
        showShortcutsModal();
        break;
      case "n":
        if (window.NotesTracker && window.NotesTracker.togglePanel) {
          window.NotesTracker.togglePanel();
        }
        break;
    }
  });


  /* ==========================================================
     19. PROGRESS WIDGET
     ========================================================== */

  function initProgressWidget() {
    var sections = document.querySelectorAll("section.section[id]");
    if (sections.length < 2) return;

    var pageId = StudyApp.getPageId();
    var storageKey = "progress_" + pageId;
    var visitedSections = {};

    try {
      visitedSections = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (e) {
      visitedSections = {};
    }

    /* Create widget DOM */
    var widget = document.createElement("div");
    widget.className = "progress-widget";
    widget.id = "progressWidget";

    /* Toggle button */
    var toggleBtn = document.createElement("button");
    toggleBtn.className = "progress-widget-toggle";
    toggleBtn.setAttribute("aria-label", "View progress");
    toggleBtn.setAttribute("title", "Reading progress");

    var visitedCount = 0;
    sections.forEach(function (sec) {
      if (visitedSections[sec.id]) visitedCount++;
    });

    var percent = Math.round((visitedCount / sections.length) * 100);
    var circumference = 113;
    var offset = circumference - (percent / 100 * circumference);

    toggleBtn.innerHTML =
      '<svg viewBox="0 0 40 40">' +
      '<circle class="bg" cx="20" cy="20" r="18"/>' +
      '<circle class="fill" cx="20" cy="20" r="18" style="stroke-dashoffset: ' + offset + '"/>' +
      '</svg>' +
      '<span style="position:relative;z-index:1">' + percent + '%</span>';

    /* Panel */
    var panel = document.createElement("div");
    panel.className = "progress-widget-panel";

    var panelTitle = document.createElement("div");
    panelTitle.className = "progress-widget-panel-title";
    panelTitle.innerHTML = '<i class="fas fa-tasks"></i> Reading Progress';

    var sectionList = document.createElement("div");
    sectionList.className = "progress-section-list";

    sections.forEach(function (sec) {
      var item = document.createElement("div");
      item.className = "progress-section-item";
      if (visitedSections[sec.id]) item.classList.add("visited");

      var dot = document.createElement("div");
      dot.className = "section-dot";

      var name = document.createElement("span");
      name.className = "section-name";
      var titleEl = sec.querySelector(".section-title");
      var titleText = sec.id;
      if (titleEl) {
        titleText = titleEl.textContent.replace(/[\s\n]+/g, " ").trim();
        var collapseText = titleEl.querySelector(".collapse-icon");
        if (collapseText) titleText = titleText.replace(collapseText.textContent, "").trim();
      }
      name.textContent = titleText;

      item.appendChild(dot);
      item.appendChild(name);

      /* Click to scroll */
      item.addEventListener("click", function () {
        var navH = navbar ? navbar.getBoundingClientRect().height : 0;
        var top = sec.getBoundingClientRect().top + window.pageYOffset - navH - 12;
        window.scrollTo({ top: top, behavior: "smooth" });
      });

      sectionList.appendChild(item);
    });

    panel.appendChild(panelTitle);
    panel.appendChild(sectionList);

    widget.appendChild(toggleBtn);
    widget.appendChild(panel);
    document.body.appendChild(widget);

    /* Toggle panel */
    var widgetOpen = false;
    toggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      widgetOpen = !widgetOpen;
      widget.classList.toggle("open", widgetOpen);
    });

    document.addEventListener("click", function (e) {
      if (widgetOpen && !widget.contains(e.target)) {
        widgetOpen = false;
        widget.classList.remove("open");
      }
    });

    /* Track section visibility */
    if ("IntersectionObserver" in window) {
      var progressObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            if (!visitedSections[id]) {
              visitedSections[id] = true;
              localStorage.setItem(storageKey, JSON.stringify(visitedSections));

              /* Update widget */
              var items = sectionList.querySelectorAll(".progress-section-item");
              items.forEach(function (item, idx) {
                var secs = document.querySelectorAll("section.section[id]");
                if (secs[idx] && secs[idx].id === id) {
                  item.classList.add("visited");
                }
              });

              /* Update percentage */
              visitedCount = 0;
              sections.forEach(function (s) {
                if (visitedSections[s.id]) visitedCount++;
              });
              percent = Math.round((visitedCount / sections.length) * 100);
              offset = circumference - (percent / 100 * circumference);

              var fillCircle = toggleBtn.querySelector(".fill");
              if (fillCircle) fillCircle.style.strokeDashoffset = offset;

              var percentSpan = toggleBtn.querySelector("span");
              if (percentSpan) percentSpan.textContent = percent + "%";
            }
          }
        });
      }, {
        threshold: 0.6,
        rootMargin: "0px"
      });

      sections.forEach(function (sec) {
        progressObserver.observe(sec);
      });
    }
  }

  initProgressWidget();


  /* ==========================================================
     20. UTILITY: Remove data-theme from HTML if hardcoded
     ========================================================== */

  /* This ensures theme doesn't flash on page load */
  (function () {
    var html = document.documentElement;
    var hardcoded = html.getAttribute("data-theme");
    var saved = localStorage.getItem("theme");
    if (saved && hardcoded !== saved) {
      html.setAttribute("data-theme", saved);
    }
  })();


}); /* ═══ End DOMContentLoaded ═══ */