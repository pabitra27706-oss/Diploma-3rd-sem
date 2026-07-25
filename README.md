
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
- **Previous Year Questions** organized by year and subject
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
| **PYQ Viewer** | Filter previous year questions by subject and year |
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
├── index.html                  # Main dashboard/homepage
├── manifest.json               # PWA manifest
├── sw.js                       # Service Worker
├── offline.html                # Offline fallback page
├── README.md                   # This file
│
├── assets/                     # Static assets
│   ├── css/
│   │   ├── variables.css       # CSS custom properties (theme variables)
│   │   └── main.css            # Main stylesheet
│   ├── js/
│   │   ├── theme.js            # Theme toggle logic
│   │   └── app.js              # Main app logic
│   ├── icons/
│   │   └── sprite.svg          # SVG icon sprite (30+ icons)
│   └── pwa/                    # PWA icons (72x72 to 512x512)
│
├── _templates/                 # Reusable templates for new pages
│   ├── base-structure.html     # HTML skeleton
│   ├── variables.css           # CSS variables to copy
│   └── README.md               # Template usage guide
│
├── _data/                      # Question data (JSON)
│   ├── manifest.json           # Master index of subjects
│   ├── CST201/                 # C Programming data
│   │   ├── meta.json           # Subject metadata
│   │   ├── 2021.json           # 2021 questions
│   │   ├── 2022.json           # 2022 questions
│   │   ├── 2023.json           # 2023 questions
│   │   ├── 2024.json           # 2024 questions
│   │   └── 2025.json           # 2025 questions
│   ├── CST203/                 # Python data
│   ├── CST205/                 # Data Structures data
│   ├── CST207/                 # CSO data
│   └── CST209/                 # Algorithms data
│
├── subjects/                   # Subject pages
│   ├── CST201/                 # C Programming
│   │   ├── index.html          # Subject home
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── units/
│   │   │   ├── common.css      # Shared styles for all units
│   │   │   ├── common.js       # Shared logic for all units
│   │   │   ├── unit-1.html     # Unit 1 content
│   │   │   ├── unit-2.html     # Unit 2 content
│   │   │   └── ...
│   │   └── resources/
│   │       ├── formula-sheet.html
│   │       ├── formula-sheet.css
│   │       └── formula-sheet.js
│   ├── CST203/                 # Python (same structure)
│   ├── CST205/                 # Data Structures
│   ├── CST207/                 # Computer System Organization
│   └── CST209/                 # Algorithms
│
├── practice/                   # Practice system
│   ├── index.html              # Practice dashboard
│   ├── index.css
│   ├── index.js
│   ├── session.html            # Active practice session
│   ├── session.css
│   └── session.js
│
├── quiz/                       # Quiz system
│   ├── index.html              # Quiz selector
│   ├── index.css
│   ├── index.js
│   ├── play.html               # Quiz session
│   ├── play.css
│   ├── play.js
│   ├── result.html             # Quiz results
│   ├── result.css
│   └── result.js
│
├── pyq/                        # Previous Year Questions
│   ├── index.html              # Subject/year selector
│   ├── index.css
│   ├── index.js
│   ├── viewer.html             # Question viewer
│   ├── viewer.css
│   └── viewer.js
│
├── roadmap/                    # 30-day revision roadmap
│   ├── index.html
│   ├── index.css
│   └── index.js
│
├── bookmarks/                  # Saved pages viewer
│   ├── index.html
│   ├── index.css
│   └── index.js
│
├── suggestions/                # Study tips
│   ├── index.html              # Subject selector
│   ├── index.css
│   ├── index.js
│   └── subjects/
│       ├── CST201/
│       │   ├── tips.html
│       │   ├── tips.css
│       │   └── tips.js
│       └── ...
│
├── info/                       # Information pages
│   ├── about.html              # About the app
│   ├── about.css
│   ├── usage-guide.html        # How to use
│   ├── usage-guide.css
│   ├── contact.html            # Contact/Feedback
│   ├── contact.css
│   ├── credits.html            # Credits
│   └── credits.css
│
└── _dev/                       # Development files (not for production)
    ├── README.md               # Development notes
    ├── chat-progress.md        # Multi-chat build tracker
    ├── structure-notes.md      # Architecture decisions
    └── todo.txt                # Future improvements
```

---

## 🎨 Design Philosophy

### 1. Self-Contained Pages
Each page owns its complete functionality (HTML + CSS + JS). No complex cross-dependencies.

### 2. Template-Based Development
Build foundation once, copy template structure for consistency across all new pages.

### 3. Unified Data Structure
One JSON file per subject per year. Same questions filtered multiple ways:
- **By year** → PYQ viewer
- **By day** → Practice system  
- **By difficulty** → Quiz system
- **By unit** → Unit quizzes

### 4. No External Dependencies
- No npm packages
- No build tools
- No frameworks
- Pure web standards

### 5. Mobile-First Responsive
Designed for mobile, enhanced for desktop. Touch-friendly UI with bottom navigation.

---

## 🎯 Data Structure

### Question Format

Every question in `_data/` follows this schema:

```json
{
  "id": "CST205-2023-Q1",
  "unit": 2,
  "topic": "Stack Operations",
  "question": "What is a Stack? Explain PUSH and POP operations.",
  "answer": "A Stack is a linear data structure that follows LIFO...",
  "marks": 6,
  "type": "theory",
  "difficulty": "easy",
  "year": 2023,
  "image": null
}
```

### Subject Metadata (`_data/CST205/meta.json`)

```json
{
  "code": "CST205",
  "name": "Data Structures",
  "credits": 2,
  "units": [
    {
      "unit": 1,
      "title": "Introduction to Data Structures",
      "topics": ["Basic Terminology", "Classification"]
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
    "subjectCode": "CST205",
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
  
  // Practice progress
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
  ]
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
| **Chat 7** | PYQ System | Complete PYQ viewer with filtering |
| **Chat 8** | Practice | Day-wise practice system |
| **Chat 9** | Quiz | Quiz system with results |
| **Chat 10** | Roadmap + Misc | Roadmap, bookmarks, suggestions, info |

### Adding New Content

**To add a new unit:**
1. Copy `_templates/base-structure.html`
2. Update title, breadcrumb, content
3. Link to `common.css` and add inline styles if needed
4. Save as `subjects/SUBJECT/units/unit-X.html`

**To add questions:**
1. Open `_data/SUBJECT/YEAR.json`
2. Add question object following the schema
3. Question automatically appears in PYQ, Practice, Quiz

**To add a new page:**
1. Use template structure
2. Link to `/assets/css/variables.css`
3. Include `/assets/js/theme.js` for theme toggle
4. Use SVG icons from sprite

---

## 🎓 For Educators

### Contributing Content

You can help by:
- Adding more questions to `_data/` files
- Improving explanations in unit pages
- Adding solved examples
- Creating formula sheets
- Writing study tips

### Question Guidelines

When adding questions:
- Use clear, concise language
- Provide complete answers
- Tag with correct unit and topic
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
- **~211** Total Files (when complete)

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
