
# Diploma 3rd Semester - Study Hub

> A comprehensive Progressive Web App (PWA) for West Bengal Polytechnic Diploma 3rd Semester students in Computer Science & Technology stream.

[![PWA](https://img.shields.io/badge/PWA-Enabled-blue)](https://web.dev/progressive-web-apps/)
[![Offline](https://img.shields.io/badge/Offline-Ready-green)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers)
[![License](https://img.shields.io/badge/License-Educational-orange)](LICENSE)

---

## 📚 Overview

This is a complete study companion app designed specifically for WB Polytechnic students. It includes:

- **5 Core Subjects** with detailed unit-wise content
- **Practice System** with day-wise question practice
- **Quiz System** with difficulty-based challenges
- **Previous Year Questions** organized by subject, year, and month
- **30-Day Roadmap** for structured exam preparation
- **Bookmark System** to save important pages
- **Dark/Light Themes** with user preference persistence
- **100% Offline Support** after first load
- **Installable** as a native-like app on any device

---

## 🎯 Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Subject Pages** | Complete notes for all 5 subjects (CST201, CST203, CST205, CST207, CST209) |
| **Unit-wise Content** | Each subject divided into units with explanations, examples, formulas |
| **Practice Mode** | Daily practice questions with progress tracking |
| **Quiz System** | Timed quizzes with instant results and explanations |
| **PYQ Viewer** | Filter previous year questions by subject, year, and month |
| **Roadmap** | 30-day study plan with daily targets |
| **Bookmarks** | Save any page for quick access later |
| **Study Tips** | Subject-specific preparation suggestions |

### Technical Features

- ✅ **No Dependencies** - Pure HTML, CSS, JavaScript
- ✅ **No Build Process** - Works directly in browser
- ✅ **PWA Compliant** - Installable, offline-ready
- ✅ **Mobile First** - Optimized for phone screens
- ✅ **Theme Toggle** - Dark/Light mode with localStorage
- ✅ **SVG Icons** - Scalable, theme-friendly icon system
- ✅ **Service Worker** - Smart caching for offline access
- ✅ **localStorage** - Progress and preferences saved locally

---

## 📖 Subjects Covered

| Code | Subject | Credits | Units |
|------|---------|---------|-------|
| **CST201** | Computer Programming in C | 2 | 5 |
| **CST203** | Scripting Languages (Python) | 2 | 5 |
| **CST205** | Data Structures | 2 | 4 |
| **CST207** | Computer System Organization | 4 | 5 |
| **CST209** | Algorithms | 4 | 5 |

**Total Credits:** 14

---

## 🚀 Quick Start

### For Students (Using the App)

#### Option 1: Direct Access
1. Open the app URL in your browser
2. On first launch, enter your name
3. Start exploring subjects and practice!

#### Option 2: Install as App
**Android (Chrome):**
1. Open the website
2. Tap menu (⋮) → "Add to Home Screen"
3. Confirm installation
4. Launch from home screen like any app

**iOS (Safari):**
1. Open the website
2. Tap Share button (□↑)
3. Scroll and tap "Add to Home Screen"
4. Confirm and launch

**Desktop (Chrome/Edge):**
1. Open the website
2. Look for install icon (⊕) in address bar
3. Click "Install"
4. App opens in its own window

---

## 💻 For Developers

### Local Setup

**Requirements:**
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Local web server (for PWA features)

**Steps:**

1. **Clone or Download**
   ```bash
   git clone <repository-url>
   cd Diploma-3rd-sem
   ```

2. **Serve Locally**

   Using Python:
   ```bash
   python -m http.server 8000
   ```

   Using Node.js:
   ```bash
   npx serve
   ```

   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open Browser**
   ```
   http://localhost:8000
   ```

4. **Test PWA Features**
   - Open DevTools → Application → Service Workers
   - Check manifest in Application → Manifest
   - Test offline by toggling Network → Offline

---

## 📁 Project Structure

```
Diploma-3rd-sem/
│
├── index.html                    # Main dashboard/homepage
├── manifest.json                 # PWA manifest
├── sw.js                         # Service Worker
├── offline.html                  # Offline fallback page
├── README.md                     # This file
│
├── assets/                       # Static assets
│   ├── css/
│   │   ├── variables.css         # CSS custom properties (theme variables)
│   │   └── main.css              # Main stylesheet
│   ├── js/
│   │   ├── theme.js              # Theme toggle logic
│   │   └── app.js                # Main app logic
│   ├── icons/
│   │   └── sprite.svg            # SVG icon sprite (30+ icons)
│   ├── images/
│   │   └── questions/            # Question diagram images
│   │       └── {SUBJECT}-{PAPERCODE}-Q{N}.png
│   └── pwa/                      # PWA icons (72x72 to 512x512)
│
├── _templates/                   # Reusable templates for new pages
│   ├── base-structure.html       # HTML skeleton
│   ├── variables.css             # CSS variables to copy
│   └── README.md                 # Template usage guide
│
├── _data/                        # Question data (JSON)
│   ├── manifest.json             # Master index of all subjects and papers
│   ├── CST201/                   # C Programming data
│   │   ├── meta.json             # Subject metadata
│   │   ├── registry.json         # Fixed paper registry for CST201
│   │   ├── CST201-P001-2021-03.json   # March 2021 paper
│   │   ├── CST201-P002-2022-06.json   # June 2022 paper
│   │   ├── CST201-P003-2023-03.json   # March 2023 paper
│   │   ├── CST201-P004-2024-01.json   # January 2024 paper
│   │   └── CST201-P005-2024-12.json   # December 2024 paper
│   ├── CST203/                   # Python data
│   │   ├── meta.json
│   │   ├── registry.json
│   │   └── CST203-P001-YYYY-MM.json
│   ├── CST205/                   # Data Structures data
│   │   ├── meta.json
│   │   ├── registry.json
│   │   └── CST205-P001-YYYY-MM.json
│   ├── CST207/                   # CSO data
│   │   ├── meta.json
│   │   ├── registry.json
│   │   └── CST207-P001-YYYY-MM.json
│   └── CST209/                   # Algorithms data
│       ├── meta.json
│       ├── registry.json
│       └── CST209-P001-YYYY-MM.json
│
├── subjects/                     # Subject pages
│   ├── CST201/                   # C Programming
│   │   ├── index.html            # Subject home
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── units/
│   │   │   ├── common.css        # Shared styles for all units
│   │   │   ├── common.js         # Shared logic for all units
│   │   │   ├── unit-1.html
│   │   │   ├── unit-2.html
│   │   │   ├── unit-3.html
│   │   │   ├── unit-4.html
│   │   │   └── unit-5.html
│   │   └── resources/
│   │       ├── formula-sheet.html
│   │       ├── formula-sheet.css
│   │       └── formula-sheet.js
│   ├── CST203/                   # Python (same structure)
│   ├── CST205/                   # Data Structures
│   ├── CST207/                   # Computer System Organization
│   └── CST209/                   # Algorithms
│
├── practice/                     # Practice system
│   ├── index.html                # Practice dashboard
│   ├── index.css
│   ├── index.js
│   ├── session.html              # Active practice session
│   ├── session.css
│   └── session.js
│
├── quiz/                         # Quiz system
│   ├── index.html                # Quiz selector
│   ├── index.css
│   ├── index.js
│   ├── play.html                 # Quiz session
│   ├── play.css
│   ├── play.js
│   ├── result.html               # Quiz results
│   ├── result.css
│   └── result.js
│
├── pyq/                          # Previous Year Questions
│   ├── index.html                # Subject selector
│   ├── index.css
│   ├── index.js
│   ├── viewer.html               # Question viewer
│   ├── viewer.css
│   └── viewer.js
│
├── roadmap/                      # 30-day revision roadmap
│   ├── index.html
│   ├── index.css
│   └── index.js
│
├── bookmarks/                    # Saved pages viewer
│   ├── index.html
│   ├── index.css
│   └── index.js
│
├── suggestions/                  # Study tips
│   ├── index.html                # Subject selector
│   ├── index.css
│   ├── index.js
│   └── subjects/
│       ├── CST201/
│       │   ├── tips.html
│       │   ├── tips.css
│       │   └── tips.js
│       └── ...
│
├── info/                         # Information pages
│   ├── about.html
│   ├── about.css
│   ├── usage-guide.html
│   ├── usage-guide.css
│   ├── contact.html
│   ├── contact.css
│   ├── credits.html
│   └── credits.css
│
└── _dev/                         # Development files (not for production)
    ├── README.md                 # Development notes
    ├── chat-progress.md          # Multi-chat build tracker
    ├── structure-notes.md        # Architecture decisions
    └── todo.txt                  # Future improvements
```

---

## 📋 Paper Registry System

### Why a Fixed Registry?

Each exam paper is assigned a **permanent paper code** (`P001`, `P002`, etc.) per subject.
This code never changes — it is the stable key used across:
- JSON file names
- JavaScript fetch calls
- Service Worker cache entries
- localStorage references
- PYQ viewer filters

### File Naming Convention

```
{SUBJECT_CODE}-{PAPER_CODE}-{YEAR}-{MONTH_2DIGIT}.json
```

**Examples:**
```
CST201-P001-2021-03.json   ← March 2021
CST201-P002-2022-06.json   ← June 2022
CST201-P003-2023-03.json   ← March 2023
CST201-P004-2024-01.json   ← January 2024
CST201-P005-2024-12.json   ← December 2024
```

### Rules
- Paper codes are assigned **per subject** independently
- Codes are assigned in order of **year ascending → month ascending**
- Same year, different month = different paper code
- Once assigned, a paper code is **permanent and never renamed**
- New papers discovered later get the **next available code** (append-only)

### CST201 — Registered Papers

| Paper Code | File Name | Source Code | Year | Month |
|------------|-----------|-------------|------|-------|
| P001 | CST201-P001-2021-03.json | 332(S) | 2021 | March |
| P002 | CST201-P002-2022-06.json | 307/1(N) | 2022 | June |
| P003 | CST201-P003-2023-03.json | 307/1(N) | 2023 | March |
| P004 | CST201-P004-2024-01.json | 307/1(N) | 2024 | January |
| P005 | CST201-P005-2024-12.json | 307/1(N) | 2024 | December |

### Registry File Format (`_data/CST201/registry.json`)

```json
{
  "subject": "CST201",
  "totalPapers": 5,
  "papers": [
    {
      "paperIndex": 1,
      "paperCode": "P001",
      "fileName": "CST201-P001-2021-03.json",
      "sourcePaperCode": "332(S)",
      "year": 2021,
      "month": "March",
      "monthNumber": 3
    },
    {
      "paperIndex": 2,
      "paperCode": "P002",
      "fileName": "CST201-P002-2022-06.json",
      "sourcePaperCode": "307/1(N)",
      "year": 2022,
      "month": "June",
      "monthNumber": 6
    },
    {
      "paperIndex": 3,
      "paperCode": "P003",
      "fileName": "CST201-P003-2023-03.json",
      "sourcePaperCode": "307/1(N)",
      "year": 2023,
      "month": "March",
      "monthNumber": 3
    },
    {
      "paperIndex": 4,
      "paperCode": "P004",
      "fileName": "CST201-P004-2024-01.json",
      "sourcePaperCode": "307/1(N)",
      "year": 2024,
      "month": "January",
      "monthNumber": 1
    },
    {
      "paperIndex": 5,
      "paperCode": "P005",
      "fileName": "CST201-P005-2024-12.json",
      "sourcePaperCode": "307/1(N)",
      "year": 2024,
      "month": "December",
      "monthNumber": 12
    }
  ]
}
```

---

## 🎯 Data Structure

### Question File Format

Every question JSON file follows this root structure:

```json
{
  "subject": "CST201",
  "paperIndex": 5,
  "paperCode": "P005",
  "fileName": "CST201-P005-2024-12.json",
  "sourcePaperCode": "307/1(N)",
  "year": 2024,
  "month": "December",
  "monthNumber": 12,
  "totalQuestions": 24,
  "questions": [...]
}
```

### Question Object Schema

```json
{
  "id": "CST201-P005-Q1",
  "paperCode": "P005",
  "paperIndex": 5,
  "unit": 2,
  "topic": "Operator Precedence",
  "question": "What is operator precedence? Explain with example.",
  "answer": "Operator precedence defines the order...",
  "marks": 6,
  "type": "theory",
  "difficulty": "easy",
  "year": 2024,
  "month": "December",
  "monthNumber": 12,
  "hasImage": false,
  "image": null,
  "tags": ["c-programming", "operators", "operator-precedence"],
  "practiceDay": 2
}
```

### Question Image Path Convention

If a question has a diagram:
```
"hasImage": true,
"image": "assets/images/questions/CST201-P005-Q3.png"
```

Image files are stored at:
```
assets/images/questions/{SUBJECT}-{PAPERCODE}-Q{NUMBER}.png
```

### Subject Metadata (`_data/CST201/meta.json`)

```json
{
  "code": "CST201",
  "name": "Computer Programming in C",
  "credits": 2,
  "totalUnits": 5,
  "units": [
    {
      "unit": 1,
      "title": "Introduction to C Programming",
      "topics": ["History of C", "Data Types", "Operators"]
    },
    {
      "unit": 2,
      "title": "Control Flow",
      "topics": ["if-else", "loops", "switch-case"]
    }
  ]
}
```

### Master Data Manifest (`_data/manifest.json`)

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-01",
  "subjects": [
    {
      "code": "CST201",
      "name": "Computer Programming in C",
      "credits": 2,
      "totalUnits": 5,
      "registryFile": "_data/CST201/registry.json",
      "totalPapers": 5
    },
    {
      "code": "CST203",
      "name": "Scripting Languages (Python)",
      "credits": 2,
      "totalUnits": 5,
      "registryFile": "_data/CST203/registry.json",
      "totalPapers": 0
    },
    {
      "code": "CST205",
      "name": "Data Structures",
      "credits": 2,
      "totalUnits": 4,
      "registryFile": "_data/CST205/registry.json",
      "totalPapers": 0
    },
    {
      "code": "CST207",
      "name": "Computer System Organization",
      "credits": 4,
      "totalUnits": 5,
      "registryFile": "_data/CST207/registry.json",
      "totalPapers": 0
    },
    {
      "code": "CST209",
      "name": "Algorithms",
      "credits": 4,
      "totalUnits": 5,
      "registryFile": "_data/CST209/registry.json",
      "totalPapers": 0
    }
  ]
}
```

---

## 🔧 LocalStorage Schema

The app stores user data locally:

```javascript
{
  // Theme preference
  "diploma-3rd-sem-theme": "dark",

  // First launch flag
  "diploma-3rd-sem-first-launch": true,

  // Student name
  "diploma-3rd-sem-student-name": "Rahul",

  // Last visited subject
  "diploma-3rd-sem-last-visited": {
    "subjectCode": "CST201",
    "timestamp": 1705334400000
  },

  // Bookmarked pages
  "diploma-3rd-sem-bookmarks": [
    {
      "url": "/subjects/CST205/units/unit-2.html",
      "title": "Unit 2 - Linear Data Structures",
      "subject": "CST205",
      "timestamp": 1705334400000
    }
  ],

  // Practice progress per day
  "diploma-3rd-sem-practice-progress": {
    "day1": { "completed": true, "score": 8, "total": 10 },
    "day2": { "completed": false }
  },

  // Quiz scores
  "diploma-3rd-sem-quiz-scores": [
    {
      "subject": "CST205",
      "difficulty": "medium",
      "score": 8,
      "total": 10,
      "date": "2025-01-15"
    }
  ],

  // PYQ last selected filter
  "diploma-3rd-sem-pyq-last-filter": {
    "subject": "CST201",
    "paperCode": "P005",
    "year": 2024,
    "month": "December",
    "monthNumber": 12
  }
}
```

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |
| Samsung Internet | 14+ | ✅ Fully Supported |

**Note:** PWA features (install, offline) require HTTPS in production.

---

## 📱 PWA Features

### Installability
- Manifest file with proper icons
- Service worker for offline support
- Standalone display mode
- Custom splash screen

### Offline Support
- All visited pages cached
- Study materials accessible offline
- User data persists locally
- Automatic sync when online

### App Shortcuts
Quick access to key features from home screen:
- Practice
- Quiz
- PYQs
- Roadmap

---

## 🛠️ Development Workflow

### Multi-Chat Development Strategy

This project is designed to be built across multiple AI chat sessions:

| Chat | Scope | Deliverable |
|------|-------|-------------|
| **Chat 1** | Foundation | Dashboard, templates, PWA setup, icons |
| **Chat 2** | CST201 | C Programming subject with all units |
| **Chat 3** | CST203 | Python subject with all units |
| **Chat 4** | CST205 | Data Structures subject with all units |
| **Chat 5** | CST207 | Computer System Organization subject |
| **Chat 6** | CST209 | Algorithms subject |
| **Chat 7** | PYQ System | Complete PYQ viewer with paper registry support |
| **Chat 8** | Practice | Day-wise practice system |
| **Chat 9** | Quiz | Quiz system with results |
| **Chat 10** | Roadmap + Misc | Roadmap, bookmarks, suggestions, info |

### Adding New Content

**To add a new unit:**
1. Copy `_templates/base-structure.html`
2. Update title, breadcrumb, content
3. Link to `common.css` and add inline styles if needed
4. Save as `subjects/SUBJECT/units/unit-X.html`

**To add a new paper (questions):**
1. Register the paper first by adding it to `_data/SUBJECT/registry.json`
2. Assign the next available `paperCode` (P006, P007, etc.)
3. Create the file using the exact `fileName` from registry
4. File name must follow: `{SUBJECT}-{PAPERCODE}-{YEAR}-{MONTH_2DIGIT}.json`
5. Add question objects following the full schema
6. Update `_data/manifest.json` to increment `totalPapers`
7. Questions automatically appear in PYQ viewer, Practice, and Quiz

**To add a question image:**
1. Save image as `assets/images/questions/{SUBJECT}-{PAPERCODE}-Q{N}.png`
2. Set `"hasImage": true` and `"image": "assets/images/questions/..."` in the question object

**To add a new page:**
1. Use template structure
2. Link to `/assets/css/variables.css`
3. Include `/assets/js/theme.js` for theme toggle
4. Use SVG icons from sprite

---

## 🎓 For Educators

### Contributing Content

You can help by:
- Adding more question files to `_data/` following the paper registry system
- Improving explanations in unit pages
- Adding solved examples
- Creating formula sheets
- Writing study tips

### Question Guidelines

When adding questions:
- Always register the paper in `registry.json` first
- Use the permanent `paperCode` in file name and all question `id` fields
- Use clear, concise language
- Provide complete answers
- Tag with correct unit, topic, and practiceDay
- Set appropriate difficulty
- Include marks distribution

---

## 🐛 Known Issues & Limitations

- **iOS Safari**: Install prompt doesn't auto-show (manual Add to Home Screen required)
- **localStorage Limit**: ~5-10MB depending on browser (sufficient for this app)
- **No Backend**: All data is static JSON (no user accounts, cloud sync)
- **Image Optimization**: Large images in answers may increase cache size

---

## 🗺️ Roadmap

### Version 1.1 (Planned)
- [ ] Flashcard system for quick revision
- [ ] Formula quick reference cards
- [ ] Progress analytics dashboard
- [ ] Solved example videos (YouTube embeds)

### Version 1.2 (Future)
- [ ] Study group features
- [ ] Exam date countdown customization
- [ ] Export bookmarks as PDF
- [ ] Voice-based quiz mode

### Version 2.0 (Future)
- [ ] Backend integration (optional)
- [ ] Multi-semester support
- [ ] Community contributions
- [ ] Real-time study sessions

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`feature/add-xyz`)
3. **Commit** your changes with clear messages
4. **Test** thoroughly in multiple browsers
5. **Submit** a pull request

### Contribution Areas
- 📝 Content (questions, notes, examples)
- 🎨 UI/UX improvements
- 🐛 Bug fixes
- 📚 Documentation
- ♿ Accessibility enhancements
- 🌐 Translations (future)

---

## 📄 License

This project is created for **educational purposes** only.

- **Free to use** for personal study
- **Free to modify** for your institution
- **Free to share** with fellow students
- **Attribution appreciated** but not required

### Credits

**Developed for:**
West Bengal State Council of Technical Education (WBSCTE)

**Target Audience:**
Diploma 3rd Semester - Computer Science & Technology Students

**Inspiration:**
Built to help students access quality study material anytime, anywhere, even offline.

---

## 📞 Support & Feedback

- **Bug Reports**: Use the Contact page in the app
- **Feature Requests**: Submit via feedback form
- **General Questions**: Check Usage Guide in app menu

---

## 📊 Statistics

- **5** Core Subjects
- **23** Total Units
- **500+** Practice Questions (target)
- **30** Days Roadmap
- **100%** Offline Capable
- **0** External Dependencies
- **~215** Total Files (when complete)

---

## 🏆 Acknowledgments

Special thanks to:
- WB Polytechnic faculty for syllabus guidance
- Students who provided feedback during development
- Open-source community for web standards and best practices

---

## 📜 Changelog

### v1.0.0 (January 2025)
- ✨ Initial release
- ✅ Complete dashboard with welcome screen
- ✅ Dark/Light theme toggle
- ✅ PWA setup with offline support
- ✅ SVG icon system
- ✅ Template structure for future development
- ✅ Paper registry system for stable file naming
- ✅ Data schema and manifest setup

---

## 💡 Tips for Best Experience

1. **Install the App**: Works better as installed PWA
2. **Enable Notifications**: Get study reminders (future feature)
3. **Bookmark Important Pages**: Quick access from bookmarks section
4. **Use Offline**: Download once, study anywhere
5. **Dark Mode**: Easier on eyes during night study sessions
6. **Practice Daily**: Follow the 30-day roadmap consistently

---

## 🔒 Privacy

This app:
- ✅ Stores data **only on your device** (localStorage)
- ✅ No tracking or analytics
- ✅ No user accounts required
- ✅ No data sent to servers
- ✅ Completely offline-capable
- ✅ No cookies used

**Your data stays yours.**

---

**Made with 💙 for WB Polytechnic Students**

*Study smart. Study offline. Excel in exams.*

---

**Version:** 1.0.0
**Last Updated:** January 2025
**Status:** Active Development
```

