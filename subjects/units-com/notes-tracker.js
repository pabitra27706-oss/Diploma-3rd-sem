/* ============================================================
   notes-tracker.js — Notes & Highlights System
   WBSCTE Diploma 3rd Semester — Computer Science & Technology
   
   FEATURES:
   1.  Text Highlight System (4 colors)
   2.  Notes CRUD (Create, Read, Update, Delete)
   3.  Notes Panel (Slide-in)
   4.  Highlight Toolbar (on text selection)
   5.  Re-apply Highlights on Page Load
   6.  Section Note Indicators
   7.  Export as Text (.txt)
   8.  Export as Markdown (.md)
   9.  Star / Favorite Notes
   10. Tab Filtering (All Pages / This Page / Starred)
   
   DEPENDENCIES: None (standalone)
   LOADED AFTER: common.js
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     STORAGE KEYS
     ============================================================ */

  var HIGHLIGHTS_KEY = "study-highlights";
  var NOTES_KEY = "study-notes";


  /* ============================================================
     STATE
     ============================================================ */

  var state = {
    highlights: [],
    notes: [],
    panelOpen: false,
    editorOpen: false,
    activeTab: "thispage",
    activeFilter: "all",
    editingNoteId: null,
    selectedColor: "yellow",
    currentSelection: null,
    toolbarVisible: false
  };


  /* ============================================================
     UTILITY FUNCTIONS
     ============================================================ */

  function generateId(prefix) {
    return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 5);
  }

  function getCurrentPageUrl() {
    return window.location.pathname + window.location.search;
  }

  function getCurrentPageTitle() {
    return document.title || "Untitled";
  }

  function getSubjectCode() {
    if (window.StudyApp && window.StudyApp.getSubjectFromBody) {
      return window.StudyApp.getSubjectFromBody();
    }
    return "UNKNOWN";
  }

  function formatDate(timestamp) {
    var d = new Date(timestamp);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function formatDateTime(timestamp) {
    var d = new Date(timestamp);
    return formatDate(timestamp) + " " + d.getHours().toString().padStart(2, "0") + ":" +
      d.getMinutes().toString().padStart(2, "0");
  }

  function truncate(text, maxLen) {
    maxLen = maxLen || 80;
    if (text.length <= maxLen) return text;
    return text.substr(0, maxLen) + "...";
  }

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function getSectionInfo(element) {
    var section = element ? element.closest("section.section[id]") : null;
    if (!section) return { id: "general", title: "General" };

    var titleEl = section.querySelector(".section-title");
    var title = section.id;
    if (titleEl) {
      title = titleEl.textContent.replace(/[\s\n]+/g, " ").trim();
      var collapseIcon = titleEl.querySelector(".collapse-icon");
      if (collapseIcon) title = title.replace(collapseIcon.textContent, "").trim();
    }

    return { id: section.id, title: title };
  }

  function getContext(node, text) {
    if (!node) return "";
    var parent = node.parentElement;
    if (!parent) return text;
    var fullText = parent.textContent || "";
    var idx = fullText.indexOf(text);
    if (idx === -1) return text;
    var start = Math.max(0, idx - 30);
    var end = Math.min(fullText.length, idx + text.length + 30);
    return fullText.substring(start, end);
  }


  /* ============================================================
     STORAGE: Load / Save
     ============================================================ */

  function loadHighlights() {
    try {
      state.highlights = JSON.parse(localStorage.getItem(HIGHLIGHTS_KEY)) || [];
    } catch (e) {
      state.highlights = [];
    }
  }

  function saveHighlights() {
    try {
      localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(state.highlights));
    } catch (e) {
      console.warn("Failed to save highlights:", e);
    }
  }

  function loadNotes() {
    try {
      state.notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
    } catch (e) {
      state.notes = [];
    }
  }

  function saveNotes() {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(state.notes));
    } catch (e) {
      console.warn("Failed to save notes:", e);
    }
  }


  /* ============================================================
     HIGHLIGHT: Apply to DOM
     ============================================================ */

  function applyHighlightToRange(range, color, highlightId) {
    var mark = document.createElement("mark");
    mark.className = "text-highlight-" + color;
    mark.setAttribute("data-highlight-id", highlightId);
    mark.setAttribute("title", "Click to manage highlight");

    try {
      range.surroundContents(mark);
    } catch (e) {
      /* Range spans multiple elements — use extractContents approach */
      var fragment = range.extractContents();
      mark.appendChild(fragment);
      range.insertNode(mark);
    }

    /* Click to show options */
    mark.addEventListener("click", function (e) {
      e.stopPropagation();
      showHighlightOptions(mark, highlightId);
    });

    return mark;
  }

  function removeHighlightFromDOM(highlightId) {
    var marks = document.querySelectorAll('mark[data-highlight-id="' + highlightId + '"]');
    marks.forEach(function (mark) {
      var parent = mark.parentNode;
      while (mark.firstChild) {
        parent.insertBefore(mark.firstChild, mark);
      }
      parent.removeChild(mark);
      parent.normalize();
    });
  }

  function showHighlightOptions(markEl, highlightId) {
    /* Remove any existing popup */
    var existing = document.querySelector(".highlight-options-popup");
    if (existing) existing.remove();

    var popup = document.createElement("div");
    popup.className = "highlight-toolbar highlight-options-popup visible";

    /* Color dots */
    var colors = ["yellow", "green", "pink", "blue"];
    colors.forEach(function (color) {
      var dot = document.createElement("button");
      dot.className = "highlight-color-dot highlight-dot-" + color;
      dot.setAttribute("title", color);
      dot.addEventListener("click", function (e) {
        e.stopPropagation();
        changeHighlightColor(highlightId, color);
        popup.remove();
      });
      popup.appendChild(dot);
    });

    /* Divider */
    var divider = document.createElement("div");
    divider.className = "highlight-toolbar-divider";
    popup.appendChild(divider);

    /* Add note button */
    var noteBtn = document.createElement("button");
    noteBtn.className = "highlight-toolbar-btn";
    noteBtn.innerHTML = '<i class="fas fa-sticky-note"></i>';
    noteBtn.setAttribute("title", "Add note");
    noteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      popup.remove();
      var hl = findHighlightById(highlightId);
      if (hl) {
        openNoteEditor(null, hl.text, getSectionInfoById(hl));
      }
    });
    popup.appendChild(noteBtn);

    /* Remove button */
    var removeBtn = document.createElement("button");
    removeBtn.className = "highlight-toolbar-btn";
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
    removeBtn.setAttribute("title", "Remove highlight");
    removeBtn.style.color = "var(--accent-red)";
    removeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      popup.remove();
      deleteHighlight(highlightId);
    });
    popup.appendChild(removeBtn);

    /* Position popup */
    var rect = markEl.getBoundingClientRect();
    popup.style.position = "fixed";
    popup.style.top = (rect.top - 45) + "px";
    popup.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 220)) + "px";
    popup.style.zIndex = "800";

    document.body.appendChild(popup);

    /* Close on outside click */
    setTimeout(function () {
      document.addEventListener("click", function closePopup(e) {
        if (!popup.contains(e.target)) {
          popup.remove();
          document.removeEventListener("click", closePopup);
        }
      });
    }, 10);
  }

  function findHighlightById(id) {
    for (var i = 0; i < state.highlights.length; i++) {
      if (state.highlights[i].id === id) return state.highlights[i];
    }
    return null;
  }

  function getSectionInfoById(highlight) {
    return { id: highlight.sectionId || "general", title: highlight.sectionTitle || "General" };
  }

  function changeHighlightColor(highlightId, newColor) {
    var hl = findHighlightById(highlightId);
    if (!hl) return;

    hl.color = newColor;
    saveHighlights();

    /* Update DOM */
    var marks = document.querySelectorAll('mark[data-highlight-id="' + highlightId + '"]');
    marks.forEach(function (mark) {
      mark.className = "text-highlight-" + newColor;
    });

    if (window.showToast) window.showToast("Color changed! 🎨", 2000, "success");
  }

  function deleteHighlight(highlightId) {
    removeHighlightFromDOM(highlightId);

    state.highlights = state.highlights.filter(function (hl) {
      return hl.id !== highlightId;
    });
    saveHighlights();
    updateNoteIndicators();
    renderNotesList();

    if (window.showToast) window.showToast("Highlight removed", 2000, "info");
  }


  /* ============================================================
     HIGHLIGHT: Re-apply on Page Load
     ============================================================ */

  function reapplyHighlights() {
    var pageUrl = getCurrentPageUrl();
    var pageHighlights = state.highlights.filter(function (hl) {
      return hl.pageUrl === pageUrl;
    });

    pageHighlights.forEach(function (hl) {
      var found = findTextInDOM(hl.text, hl.context);
      if (found) {
        try {
          var mark = document.createElement("mark");
          mark.className = "text-highlight-" + hl.color;
          mark.setAttribute("data-highlight-id", hl.id);
          mark.setAttribute("title", "Click to manage highlight");

          found.range.surroundContents(mark);

          mark.addEventListener("click", function (e) {
            e.stopPropagation();
            showHighlightOptions(mark, hl.id);
          });
        } catch (e) {
          /* Could not re-apply — content may have changed */
        }
      }
    });
  }

  function findTextInDOM(searchText, context) {
    if (!searchText) return null;

    var treeWalker = document.createTreeWalker(
      document.querySelector(".container") || document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    var node;
    while ((node = treeWalker.nextNode())) {
      var nodeText = node.textContent;
      var idx = nodeText.indexOf(searchText);
      if (idx !== -1) {
        /* Skip if already highlighted */
        if (node.parentElement && node.parentElement.tagName === "MARK") continue;

        var range = document.createRange();
        range.setStart(node, idx);
        range.setEnd(node, idx + searchText.length);
        return { range: range, node: node };
      }
    }

    return null;
  }


  /* ============================================================
     HIGHLIGHT TOOLBAR: Text Selection
     ============================================================ */

  var highlightToolbar = null;

  function createHighlightToolbar() {
    highlightToolbar = document.createElement("div");
    highlightToolbar.className = "highlight-toolbar";
    highlightToolbar.setAttribute("id", "highlightToolbar");

    /* Color dots */
    var colors = [
      { name: "yellow", label: "Yellow" },
      { name: "green", label: "Green" },
      { name: "pink", label: "Pink" },
      { name: "blue", label: "Blue" }
    ];

    colors.forEach(function (c) {
      var dot = document.createElement("button");
      dot.className = "highlight-color-dot highlight-dot-" + c.name;
      dot.setAttribute("title", "Highlight " + c.label);
      dot.setAttribute("data-color", c.name);
      dot.addEventListener("mousedown", function (e) {
        e.preventDefault();
        e.stopPropagation();
        highlightSelection(c.name);
      });
      highlightToolbar.appendChild(dot);
    });

    /* Divider */
    var divider = document.createElement("div");
    divider.className = "highlight-toolbar-divider";
    highlightToolbar.appendChild(divider);

    /* Note button */
    var noteBtn = document.createElement("button");
    noteBtn.className = "highlight-toolbar-btn";
    noteBtn.innerHTML = '<i class="fas fa-sticky-note"></i>';
    noteBtn.setAttribute("title", "Add note");
    noteBtn.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      addNoteFromSelection();
    });
    highlightToolbar.appendChild(noteBtn);

    /* Copy button */
    var copyBtn = document.createElement("button");
    copyBtn.className = "highlight-toolbar-btn";
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.setAttribute("title", "Copy text");
    copyBtn.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      copySelection();
    });
    highlightToolbar.appendChild(copyBtn);

    document.body.appendChild(highlightToolbar);
  }

  function showToolbar(x, y) {
    if (!highlightToolbar) createHighlightToolbar();
    highlightToolbar.classList.add("visible");

    /* Position */
    var toolbarWidth = 230;
    var posX = Math.max(8, Math.min(x - toolbarWidth / 2, window.innerWidth - toolbarWidth - 8));
    var posY = Math.max(8, y - 48);

    highlightToolbar.style.position = "fixed";
    highlightToolbar.style.top = posY + "px";
    highlightToolbar.style.left = posX + "px";
    state.toolbarVisible = true;
  }

  function hideToolbar() {
    if (highlightToolbar) {
      highlightToolbar.classList.remove("visible");
    }
    state.toolbarVisible = false;
    state.currentSelection = null;
  }

  function handleTextSelection() {
    var selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      /* Delay hide to allow button clicks */
      setTimeout(function () {
        if (!state.toolbarVisible) return;
        hideToolbar();
      }, 200);
      return;
    }

    var text = selection.toString().trim();
    if (text.length < 2) return;

    /* Only allow selection within .container */
    var container = document.querySelector(".container");
    if (!container) return;

    var anchorNode = selection.anchorNode;
    if (!container.contains(anchorNode)) return;

    /* Skip selections inside inputs, textareas, code blocks */
    var parentEl = anchorNode.parentElement;
    if (parentEl) {
      var tag = parentEl.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "pre" || tag === "code") return;
      if (parentEl.closest("pre") || parentEl.closest(".code-box") ||
          parentEl.closest(".note-editor") || parentEl.closest(".cmd-box")) return;
    }

    /* Store selection */
    state.currentSelection = {
      text: text,
      range: selection.getRangeAt(0).cloneRange(),
      anchorNode: anchorNode
    };

    /* Position toolbar */
    var range = selection.getRangeAt(0);
    var rect = range.getBoundingClientRect();
    showToolbar(rect.left + rect.width / 2, rect.top);
  }

  /* Attach selection listener */
  document.addEventListener("mouseup", function () {
    setTimeout(handleTextSelection, 10);
  });

  document.addEventListener("touchend", function () {
    setTimeout(handleTextSelection, 300);
  });

  /* Hide toolbar on scroll */
  window.addEventListener("scroll", function () {
    if (state.toolbarVisible) hideToolbar();
  }, { passive: true });


  /* ============================================================
     HIGHLIGHT: Create from Selection
     ============================================================ */

  function highlightSelection(color) {
    if (!state.currentSelection) return;

    var sel = state.currentSelection;
    var sectionInfo = getSectionInfo(sel.anchorNode);
    var context = getContext(sel.anchorNode, sel.text);

    var hlId = generateId("hl");
    var highlight = {
      id: hlId,
      pageUrl: getCurrentPageUrl(),
      pageTitle: getCurrentPageTitle(),
      subject: getSubjectCode(),
      text: sel.text,
      color: color,
      context: context,
      sectionId: sectionInfo.id,
      sectionTitle: sectionInfo.title,
      timestamp: Date.now()
    };

    /* Apply to DOM */
    try {
      /* Restore the selection range */
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(sel.range);

      var range = selection.getRangeAt(0);
      applyHighlightToRange(range, color, hlId);

      selection.removeAllRanges();
    } catch (e) {
      console.warn("Could not apply highlight:", e);
      if (window.showToast) window.showToast("Could not highlight this text", 2500, "warning");
      hideToolbar();
      return;
    }

    /* Save */
    state.highlights.push(highlight);
    saveHighlights();
    updateNoteIndicators();
    hideToolbar();

    if (window.showToast) window.showToast("Text highlighted! 🟡", 2000, "success");
  }


  /* ============================================================
     NOTES: CRUD Operations
     ============================================================ */

  function addNoteFromSelection() {
    if (!state.currentSelection) {
      openNoteEditor(null, "", { id: "general", title: "General" });
      hideToolbar();
      return;
    }

    var sel = state.currentSelection;
    var sectionInfo = getSectionInfo(sel.anchorNode);
    openNoteEditor(null, sel.text, sectionInfo);
    hideToolbar();
    window.getSelection().removeAllRanges();
  }

  function copySelection() {
    if (!state.currentSelection) return;
    var text = state.currentSelection.text;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (window.showToast) window.showToast("Text copied! 📋", 2000, "success");
      });
    } else {
      /* Fallback */
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0;left:-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      if (window.showToast) window.showToast("Text copied! 📋", 2000, "success");
    }

    hideToolbar();
    window.getSelection().removeAllRanges();
  }

  function createNote(noteContent, attachedText, sectionInfo, color) {
    var note = {
      id: generateId("nt"),
      pageUrl: getCurrentPageUrl(),
      pageTitle: getCurrentPageTitle(),
      subject: getSubjectCode(),
      sectionId: sectionInfo.id,
      sectionTitle: sectionInfo.title,
      attachedText: attachedText || "",
      noteContent: noteContent,
      color: color || "yellow",
      starred: false,
      timestamp: Date.now(),
      lastEdited: Date.now()
    };

    state.notes.push(note);
    saveNotes();
    updateNoteIndicators();
    renderNotesList();

    if (window.showToast) window.showToast("Note saved! 📝", 2500, "success");
    return note;
  }

  function updateNote(noteId, newContent) {
    for (var i = 0; i < state.notes.length; i++) {
      if (state.notes[i].id === noteId) {
        state.notes[i].noteContent = newContent;
        state.notes[i].lastEdited = Date.now();
        break;
      }
    }
    saveNotes();
    renderNotesList();

    if (window.showToast) window.showToast("Note updated! ✏️", 2000, "success");
  }

  function deleteNote(noteId) {
    state.notes = state.notes.filter(function (n) {
      return n.id !== noteId;
    });
    saveNotes();
    updateNoteIndicators();
    renderNotesList();

    if (window.showToast) window.showToast("Note deleted 🗑️", 2000, "info");
  }

  function toggleStarNote(noteId) {
    for (var i = 0; i < state.notes.length; i++) {
      if (state.notes[i].id === noteId) {
        state.notes[i].starred = !state.notes[i].starred;
        break;
      }
    }
    saveNotes();
    renderNotesList();
  }


  /* ============================================================
     NOTES PANEL: DOM Creation
     ============================================================ */

  var notesPanel = null;
  var notesOverlay = null;
  var notesListContainer = null;
  var noteEditor = null;
  var noteEditorTextarea = null;
  var noteEditorColorDots = null;
  var sectionFilterSelect = null;

  function createNotesPanel() {
    /* Overlay */
    notesOverlay = document.createElement("div");
    notesOverlay.className = "notes-overlay";
    notesOverlay.addEventListener("click", closePanel);

    /* Panel */
    notesPanel = document.createElement("div");
    notesPanel.className = "notes-panel";

    /* Header */
    var header = document.createElement("div");
    header.className = "notes-panel-header";
    header.innerHTML =
      '<h3><i class="fas fa-sticky-note"></i> My Notes</h3>';

    var closeBtn = document.createElement("button");
    closeBtn.className = "notes-panel-close";
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.addEventListener("click", closePanel);
    header.appendChild(closeBtn);

    /* Tabs */
    var tabs = document.createElement("div");
    tabs.className = "notes-tabs";

    var tabData = [
      { id: "allpages", label: "All Pages" },
      { id: "thispage", label: "This Page" },
      { id: "starred", label: "★ Starred" }
    ];

    tabData.forEach(function (t) {
      var tab = document.createElement("button");
      tab.className = "notes-tab";
      tab.textContent = t.label;
      tab.setAttribute("data-tab", t.id);
      if (t.id === state.activeTab) tab.classList.add("active");
      tab.addEventListener("click", function () {
        state.activeTab = t.id;
        tabs.querySelectorAll(".notes-tab").forEach(function (tb) {
          tb.classList.remove("active");
        });
        tab.classList.add("active");
        renderNotesList();
      });
      tabs.appendChild(tab);
    });

    /* Section Filter */
    var filterWrapper = document.createElement("div");
    filterWrapper.className = "notes-filter";

    sectionFilterSelect = document.createElement("select");
    sectionFilterSelect.innerHTML = '<option value="all">All Sections</option>';
    sectionFilterSelect.addEventListener("change", function () {
      state.activeFilter = sectionFilterSelect.value;
      renderNotesList();
    });

    filterWrapper.appendChild(sectionFilterSelect);

    /* Notes List */
    notesListContainer = document.createElement("div");
    notesListContainer.className = "notes-list";

    /* Note Editor */
    noteEditor = document.createElement("div");
    noteEditor.className = "note-editor";

    noteEditorTextarea = document.createElement("textarea");
    noteEditorTextarea.placeholder = "Write your note here...";

    var colorPicker = document.createElement("div");
    colorPicker.className = "note-color-picker";

    var editorColors = ["yellow", "green", "pink", "blue"];
    noteEditorColorDots = [];

    editorColors.forEach(function (color) {
      var dot = document.createElement("button");
      dot.className = "note-color-dot note-color-" + color;
      dot.setAttribute("data-color", color);
      if (color === state.selectedColor) dot.classList.add("active");
      dot.addEventListener("click", function () {
        state.selectedColor = color;
        noteEditorColorDots.forEach(function (d) { d.classList.remove("active"); });
        dot.classList.add("active");
      });
      colorPicker.appendChild(dot);
      noteEditorColorDots.push(dot);
    });

    var editorActions = document.createElement("div");
    editorActions.className = "note-editor-actions";

    var saveBtn = document.createElement("button");
    saveBtn.className = "save-note";
    saveBtn.textContent = "Save Note";
    saveBtn.addEventListener("click", function () {
      var content = noteEditorTextarea.value.trim();
      if (!content) {
        if (window.showToast) window.showToast("Please write something!", 2000, "warning");
        return;
      }

      if (state.editingNoteId) {
        updateNote(state.editingNoteId, content);
      } else {
        var sectionInfo = { id: "general", title: "General" };
        if (noteEditor._attachedSection) {
          sectionInfo = noteEditor._attachedSection;
        }
        createNote(content, noteEditor._attachedText || "", sectionInfo, state.selectedColor);
      }

      closeNoteEditor();
    });

    var cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-note";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", closeNoteEditor);

    editorActions.appendChild(saveBtn);
    editorActions.appendChild(cancelBtn);

    noteEditor.appendChild(noteEditorTextarea);
    noteEditor.appendChild(colorPicker);
    noteEditor.appendChild(editorActions);

    /* Footer */
    var footer = document.createElement("div");
    footer.className = "notes-panel-footer";

    var addBtn = document.createElement("button");
    addBtn.className = "btn-add-note";
    addBtn.innerHTML = '<i class="fas fa-plus"></i> New Note';
    addBtn.addEventListener("click", function () {
      openNoteEditor(null, "", { id: "general", title: "General" });
    });

    var exportBtn = document.createElement("button");
    exportBtn.innerHTML = '<i class="fas fa-download"></i> Export';
    exportBtn.addEventListener("click", showExportModal);

    footer.appendChild(addBtn);
    footer.appendChild(exportBtn);

    /* Assemble panel */
    notesPanel.appendChild(header);
    notesPanel.appendChild(tabs);
    notesPanel.appendChild(filterWrapper);
    notesPanel.appendChild(notesListContainer);
    notesPanel.appendChild(noteEditor);
    notesPanel.appendChild(footer);

    document.body.appendChild(notesOverlay);
    document.body.appendChild(notesPanel);
  }


  /* ============================================================
     NOTES PANEL: Open / Close
     ============================================================ */

  function openPanel() {
    if (!notesPanel) createNotesPanel();

    updateSectionFilter();
    renderNotesList();

    notesPanel.classList.add("open");
    notesOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    state.panelOpen = true;
  }

  function closePanel() {
    if (notesPanel) notesPanel.classList.remove("open");
    if (notesOverlay) notesOverlay.classList.remove("open");
    document.body.style.overflow = "";
    state.panelOpen = false;
    closeNoteEditor();
  }

  function togglePanel() {
    if (state.panelOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }


  /* ============================================================
     NOTE EDITOR: Open / Close
     ============================================================ */

  function openNoteEditor(noteId, attachedText, sectionInfo) {
    if (!noteEditor) return;
    if (!state.panelOpen) openPanel();

    state.editorOpen = true;
    state.editingNoteId = noteId || null;
    noteEditor._attachedText = attachedText || "";
    noteEditor._attachedSection = sectionInfo || { id: "general", title: "General" };

    if (noteId) {
      /* Editing existing note */
      var note = findNoteById(noteId);
      if (note) {
        noteEditorTextarea.value = note.noteContent;
        state.selectedColor = note.color;
      }
    } else {
      noteEditorTextarea.value = "";
    }

    /* Update color dots */
    noteEditorColorDots.forEach(function (d) {
      d.classList.toggle("active", d.getAttribute("data-color") === state.selectedColor);
    });

    noteEditor.classList.add("open");

    setTimeout(function () {
      noteEditorTextarea.focus();
    }, 100);
  }

  function closeNoteEditor() {
    if (noteEditor) noteEditor.classList.remove("open");
    state.editorOpen = false;
    state.editingNoteId = null;
    if (noteEditorTextarea) noteEditorTextarea.value = "";
  }

  function findNoteById(id) {
    for (var i = 0; i < state.notes.length; i++) {
      if (state.notes[i].id === id) return state.notes[i];
    }
    return null;
  }


  /* ============================================================
     NOTES PANEL: Render Notes List
     ============================================================ */

  function updateSectionFilter() {
    if (!sectionFilterSelect) return;

    sectionFilterSelect.innerHTML = '<option value="all">All Sections</option>';

    var sections = document.querySelectorAll("section.section[id]");
    sections.forEach(function (sec) {
      var titleEl = sec.querySelector(".section-title");
      var title = sec.id;
      if (titleEl) {
        title = titleEl.textContent.replace(/[\s\n]+/g, " ").trim();
        var icon = titleEl.querySelector(".collapse-icon");
        if (icon) title = title.replace(icon.textContent, "").trim();
      }

      var option = document.createElement("option");
      option.value = sec.id;
      option.textContent = truncate(title, 35);
      sectionFilterSelect.appendChild(option);
    });
  }

  function renderNotesList() {
    if (!notesListContainer) return;

    var pageUrl = getCurrentPageUrl();
    var filtered = [];

    /* Tab filter */
    switch (state.activeTab) {
      case "allpages":
        filtered = state.notes.slice();
        break;
      case "thispage":
        filtered = state.notes.filter(function (n) {
          return n.pageUrl === pageUrl;
        });
        break;
      case "starred":
        filtered = state.notes.filter(function (n) {
          return n.starred;
        });
        break;
      default:
        filtered = state.notes.slice();
    }

    /* Section filter */
    if (state.activeFilter !== "all") {
      filtered = filtered.filter(function (n) {
        return n.sectionId === state.activeFilter;
      });
    }

    /* Sort by timestamp (newest first) */
    filtered.sort(function (a, b) {
      return b.timestamp - a.timestamp;
    });

    /* Render */
    notesListContainer.innerHTML = "";

    if (filtered.length === 0) {
      notesListContainer.innerHTML =
        '<div class="notes-empty">' +
        '<i class="fas fa-sticky-note"></i>' +
        '<p>No notes yet.<br>Select text to highlight or add notes!</p>' +
        "</div>";
      return;
    }

    filtered.forEach(function (note) {
      var card = document.createElement("div");
      card.className = "note-card card-paper";

      /* Section tag */
      var sectionTag = document.createElement("div");
      sectionTag.className = "note-section-tag";
      sectionTag.innerHTML = '<i class="fas fa-bookmark"></i> ' + escapeHtml(truncate(note.sectionTitle, 25));

      /* Page info for "all pages" tab */
      if (state.activeTab === "allpages") {
        sectionTag.innerHTML += ' · ' + escapeHtml(truncate(note.pageTitle, 20));
      }

      card.appendChild(sectionTag);

      /* Attached text (if any) */
      if (note.attachedText) {
        var attached = document.createElement("div");
        attached.className = "note-attached-text";
        attached.textContent = '"' + truncate(note.attachedText, 100) + '"';
        card.appendChild(attached);
      }

      /* Note content */
      var text = document.createElement("div");
      text.className = "note-text";
      text.textContent = note.noteContent;
      card.appendChild(text);

      /* Meta row */
      var meta = document.createElement("div");
      meta.className = "note-meta";

      var dateSpan = document.createElement("span");
      dateSpan.textContent = formatDate(note.timestamp);
      if (note.lastEdited > note.timestamp) {
        dateSpan.textContent += " · Edited " + formatDate(note.lastEdited);
      }

      /* Action buttons */
      var actions = document.createElement("div");
      actions.className = "note-actions";

      /* Star */
      var starBtn = document.createElement("button");
      starBtn.className = "note-action-btn star";
      if (note.starred) starBtn.classList.add("starred");
      starBtn.innerHTML = '<i class="fas fa-star"></i>';
      starBtn.setAttribute("title", note.starred ? "Unstar" : "Star");
      starBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleStarNote(note.id);
      });

      /* Edit */
      var editBtn = document.createElement("button");
      editBtn.className = "note-action-btn";
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.setAttribute("title", "Edit");
      editBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openNoteEditor(note.id, note.attachedText, {
          id: note.sectionId,
          title: note.sectionTitle
        });
      });

      /* Delete */
      var delBtn = document.createElement("button");
      delBtn.className = "note-action-btn delete";
      delBtn.innerHTML = '<i class="fas fa-trash"></i>';
      delBtn.setAttribute("title", "Delete");
      delBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (confirm("Delete this note?")) {
          deleteNote(note.id);
        }
      });

      actions.appendChild(starBtn);
      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      meta.appendChild(dateSpan);
      meta.appendChild(actions);
      card.appendChild(meta);

      notesListContainer.appendChild(card);
    });

    /* Add highlights count */
    var pageHighlights = state.highlights.filter(function (hl) {
      if (state.activeTab === "thispage") return hl.pageUrl === pageUrl;
      return true;
    });

    if (pageHighlights.length > 0) {
      var hlSection = document.createElement("div");
      hlSection.style.cssText = "padding:0.75rem;margin-top:0.5rem;font-size:0.78rem;color:var(--text-muted);border-top:1px solid var(--border-color)";
      hlSection.innerHTML = '<i class="fas fa-highlighter" style="margin-right:0.4rem"></i>' +
        pageHighlights.length + " highlight" + (pageHighlights.length > 1 ? "s" : "") + " on " +
        (state.activeTab === "thispage" ? "this page" : "all pages");
      notesListContainer.appendChild(hlSection);
    }
  }


  /* ============================================================
     SECTION NOTE INDICATORS
     ============================================================ */

  function updateNoteIndicators() {
    /* Remove existing indicators */
    document.querySelectorAll(".section-note-indicator").forEach(function (ind) {
      ind.remove();
    });

    var pageUrl = getCurrentPageUrl();
    var pageNotes = state.notes.filter(function (n) {
      return n.pageUrl === pageUrl;
    });
    var pageHighlights = state.highlights.filter(function (hl) {
      return hl.pageUrl === pageUrl;
    });

    /* Group by section */
    var sectionCounts = {};

    pageNotes.forEach(function (n) {
      if (!sectionCounts[n.sectionId]) sectionCounts[n.sectionId] = 0;
      sectionCounts[n.sectionId]++;
    });

    pageHighlights.forEach(function (hl) {
      if (!sectionCounts[hl.sectionId]) sectionCounts[hl.sectionId] = 0;
      sectionCounts[hl.sectionId]++;
    });

    /* Add indicators */
    Object.keys(sectionCounts).forEach(function (sectionId) {
      var section = document.getElementById(sectionId);
      if (!section) return;

      var titleEl = section.querySelector(".section-title");
      if (!titleEl) return;

      /* Don't add if already has indicator */
      if (titleEl.querySelector(".section-note-indicator")) return;

      var indicator = document.createElement("span");
      indicator.className = "section-note-indicator";
      indicator.innerHTML = '<i class="fas fa-sticky-note"></i> ' + sectionCounts[sectionId];
      indicator.setAttribute("title", sectionCounts[sectionId] + " notes & highlights");

      /* Insert before collapse icon */
      var collapseIcon = titleEl.querySelector(".collapse-icon");
      if (collapseIcon) {
        titleEl.insertBefore(indicator, collapseIcon);
      } else {
        titleEl.appendChild(indicator);
      }

      indicator.addEventListener("click", function (e) {
        e.stopPropagation();
        state.activeTab = "thispage";
        state.activeFilter = sectionId;
        openPanel();

        /* Update filter select */
        if (sectionFilterSelect) sectionFilterSelect.value = sectionId;

        /* Update tab UI */
        if (notesPanel) {
          notesPanel.querySelectorAll(".notes-tab").forEach(function (tab) {
            tab.classList.toggle("active", tab.getAttribute("data-tab") === "thispage");
          });
        }
      });
    });
  }


  /* ============================================================
     EXPORT: Text (.txt) + Markdown (.md)
     ============================================================ */

  var exportModalOverlay = null;

  function showExportModal() {
    if (!exportModalOverlay) {
      exportModalOverlay = document.createElement("div");
      exportModalOverlay.className = "export-modal-overlay";

      var modal = document.createElement("div");
      modal.className = "export-modal";

      modal.innerHTML =
        '<h3><i class="fas fa-download"></i> Export Notes</h3>' +
        '<p>Choose your preferred format</p>' +
        '<div class="export-options">' +
        '<button class="export-option-btn" data-format="txt">' +
        '<i class="fas fa-file-alt"></i>' +
        '<div class="export-option-info">' +
        '<h4>Plain Text (.txt)</h4>' +
        '<span>Simple text format, works everywhere</span>' +
        '</div></button>' +
        '<button class="export-option-btn" data-format="md">' +
        '<i class="fas fa-file-code"></i>' +
        '<div class="export-option-info">' +
        '<h4>Markdown (.md)</h4>' +
        '<span>Formatted with headers, lists, quotes</span>' +
        '</div></button>' +
        '</div>';

      exportModalOverlay.appendChild(modal);
      document.body.appendChild(exportModalOverlay);

      /* Events */
      exportModalOverlay.addEventListener("click", function (e) {
        if (e.target === exportModalOverlay) {
          exportModalOverlay.classList.remove("open");
        }
      });

      modal.querySelectorAll(".export-option-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var format = btn.getAttribute("data-format");
          exportNotes(format);
          exportModalOverlay.classList.remove("open");
        });
      });
    }

    exportModalOverlay.classList.add("open");
  }

  function exportNotes(format) {
    var content = "";
    var filename = "";
    var mimeType = "text/plain";

    var subject = getSubjectCode();
    var date = formatDate(Date.now());
    var dateFile = new Date().toISOString().split("T")[0];

    if (format === "txt") {
      content = generateTextExport(subject, date);
      filename = "study-notes-" + subject + "-" + dateFile + ".txt";
      mimeType = "text/plain";
    } else if (format === "md") {
      content = generateMarkdownExport(subject, date);
      filename = "study-notes-" + subject + "-" + dateFile + ".md";
      mimeType = "text/markdown";
    }

    downloadFile(content, filename, mimeType);
    if (window.showToast) window.showToast("Notes exported! 📄", 2500, "success");
  }

  function generateTextExport(subject, date) {
    var lines = [];

    lines.push("═══════════════════════════════════════");
    lines.push("📚 STUDY NOTES EXPORT");
    lines.push("Subject: " + subject);
    lines.push("Exported: " + date);
    lines.push("═══════════════════════════════════════");
    lines.push("");

    /* Group notes and highlights by page */
    var pages = groupByPage();

    Object.keys(pages).forEach(function (pageUrl) {
      var pageData = pages[pageUrl];

      lines.push("📄 PAGE: " + pageData.title);
      lines.push("URL: " + pageUrl);
      lines.push("───────────────────────────────────────");
      lines.push("");

      /* Highlights */
      if (pageData.highlights.length > 0) {
        lines.push("📌 HIGHLIGHTS:");
        lines.push("");

        pageData.highlights.forEach(function (hl) {
          lines.push("  [" + hl.sectionTitle + "]");
          lines.push('  ● "' + hl.text + '" (' + hl.color + ')');
          lines.push("    Added: " + formatDate(hl.timestamp));
          lines.push("");
        });
      }

      /* Notes */
      if (pageData.notes.length > 0) {
        lines.push("📝 NOTES:");
        lines.push("");

        pageData.notes.forEach(function (note) {
          lines.push("  [" + note.sectionTitle + "]");
          var star = note.starred ? "  ★ " : "  ";
          lines.push(star + note.noteContent);
          if (note.attachedText) {
            lines.push('    Referenced: "' + truncate(note.attachedText, 60) + '"');
          }
          lines.push("    Added: " + formatDate(note.timestamp));
          if (note.lastEdited > note.timestamp) {
            lines.push("    Edited: " + formatDate(note.lastEdited));
          }
          lines.push("");
        });
      }

      lines.push("═══════════════════════════════════════");
      lines.push("");
    });

    /* Summary */
    lines.push("SUMMARY:");
    lines.push("  Total Highlights: " + state.highlights.length);
    lines.push("  Total Notes: " + state.notes.length);
    lines.push("  Starred Notes: " + state.notes.filter(function (n) { return n.starred; }).length);
    lines.push("");
    lines.push("Generated by Study Hub — Diploma 3rd Semester");

    return lines.join("\n");
  }

  function generateMarkdownExport(subject, date) {
    var lines = [];

    lines.push("# 📚 Study Notes Export");
    lines.push("");
    lines.push("**Subject:** " + subject);
    lines.push("**Exported:** " + date);
    lines.push("");
    lines.push("---");
    lines.push("");

    /* Group by page */
    var pages = groupByPage();

    Object.keys(pages).forEach(function (pageUrl) {
      var pageData = pages[pageUrl];

      lines.push("## 📄 " + pageData.title);
      lines.push("");

      /* Highlights */
      if (pageData.highlights.length > 0) {
        lines.push("### 📌 Highlights");
        lines.push("");

        pageData.highlights.forEach(function (hl) {
          lines.push("**Section: " + hl.sectionTitle + "**");
          lines.push('> "' + hl.text + '" 🟡');
          lines.push("*Added: " + formatDate(hl.timestamp) + "*");
          lines.push("");
        });
      }

      /* Notes */
      if (pageData.notes.length > 0) {
        lines.push("### 📝 Notes");
        lines.push("");

        pageData.notes.forEach(function (note) {
          lines.push("**Section: " + note.sectionTitle + "**");
          var star = note.starred ? "⭐ " : "";
          lines.push(star + note.noteContent);
          if (note.attachedText) {
            lines.push('> Referenced: "' + truncate(note.attachedText, 80) + '"');
          }
          lines.push("*Added: " + formatDate(note.timestamp));
          if (note.lastEdited > note.timestamp) {
            lines.push(" | Edited: " + formatDate(note.lastEdited));
          }
          lines.push("*");
          lines.push("");
        });
      }

      lines.push("---");
      lines.push("");
    });

    /* Summary */
    lines.push("## 📊 Summary");
    lines.push("");
    lines.push("| Metric | Count |");
    lines.push("|--------|-------|");
    lines.push("| Highlights | " + state.highlights.length + " |");
    lines.push("| Notes | " + state.notes.length + " |");
    lines.push("| Starred | " + state.notes.filter(function (n) { return n.starred; }).length + " |");
    lines.push("");
    lines.push("---");
    lines.push("*Generated by Study Hub — Diploma 3rd Semester*");

    return lines.join("\n");
  }

  function groupByPage() {
    var pages = {};

    state.highlights.forEach(function (hl) {
      if (!pages[hl.pageUrl]) {
        pages[hl.pageUrl] = {
          title: hl.pageTitle,
          highlights: [],
          notes: []
        };
      }
      pages[hl.pageUrl].highlights.push(hl);
    });

    state.notes.forEach(function (note) {
      if (!pages[note.pageUrl]) {
        pages[note.pageUrl] = {
          title: note.pageTitle,
          highlights: [],
          notes: []
        };
      }
      pages[note.pageUrl].notes.push(note);
    });

    return pages;
  }

  function downloadFile(content, filename, mimeType) {
    var blob = new Blob([content], { type: mimeType + ";charset=utf-8" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();

    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }


  /* ============================================================
     INITIALIZATION
     ============================================================ */

  function init() {
    /* Load data */
    loadHighlights();
    loadNotes();

    /* Re-apply highlights */
    setTimeout(function () {
      reapplyHighlights();
    }, 300);

    /* Add section indicators */
    setTimeout(function () {
      updateNoteIndicators();
    }, 500);
  }

  /* Wait for DOM */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }


  /* ============================================================
     PUBLIC API (Exposed to window.NotesTracker)
     ============================================================ */

  window.NotesTracker = {
    openPanel: openPanel,
    closePanel: closePanel,
    togglePanel: togglePanel,
    isOpen: function () { return state.panelOpen; },

    /* Programmatic highlight */
    highlightText: function (text, color) {
      var found = findTextInDOM(text);
      if (found) {
        var hlId = generateId("hl");
        var sectionInfo = getSectionInfo(found.node);
        applyHighlightToRange(found.range, color || "yellow", hlId);
        state.highlights.push({
          id: hlId,
          pageUrl: getCurrentPageUrl(),
          pageTitle: getCurrentPageTitle(),
          subject: getSubjectCode(),
          text: text,
          color: color || "yellow",
          context: getContext(found.node, text),
          sectionId: sectionInfo.id,
          sectionTitle: sectionInfo.title,
          timestamp: Date.now()
        });
        saveHighlights();
        updateNoteIndicators();
        return true;
      }
      return false;
    },

    /* Programmatic note */
    addNote: function (content, sectionId) {
      var sectionInfo = { id: "general", title: "General" };
      if (sectionId) {
        var sec = document.getElementById(sectionId);
        if (sec) sectionInfo = getSectionInfo(sec);
      }
      return createNote(content, "", sectionInfo, "yellow");
    },

    /* Get counts */
    getStats: function () {
      var pageUrl = getCurrentPageUrl();
      return {
        totalNotes: state.notes.length,
        totalHighlights: state.highlights.length,
        pageNotes: state.notes.filter(function (n) { return n.pageUrl === pageUrl; }).length,
        pageHighlights: state.highlights.filter(function (h) { return h.pageUrl === pageUrl; }).length,
        starredNotes: state.notes.filter(function (n) { return n.starred; }).length
      };
    },

    /* Export programmatically */
    exportAsText: function () { exportNotes("txt"); },
    exportAsMarkdown: function () { exportNotes("md"); },

    /* Force refresh */
    refresh: function () {
      loadHighlights();
      loadNotes();
      reapplyHighlights();
      updateNoteIndicators();
      if (state.panelOpen) renderNotesList();
    }
  };

})();