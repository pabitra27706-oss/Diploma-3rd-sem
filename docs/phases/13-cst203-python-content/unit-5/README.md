# CST203 Unit 5 — Framework

> **Target file:** `subjects/CST203/units/unit-5.html` (current: `5,657w` [over-weighted #1 longest Python page] → target: **`~3,800–4,300w` [right-sized]**)  
> **Syllabus (`syllabus.json`, PDF p. 6):** **6 contact hours** (of `30h`, `2` credits, L–T–P `2-0-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`30 / 387` marks (`7.8%`, #5 in Python)** · avg **`7.5m/paper`** · **`4/4` papers** · **`6m` MCQ + `24m` 8m-subparts** (`P001-2022-06` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#mvc`, `#urls-templates`  
> **Existing `<section id>`s to preserve (13):** `overview`, `mvc`, `django-intro`, `urls-templates`, `forms`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s at planning time:** `0`.
> **Shipped 2026-11-19 (part 13.5) — `5`:** `#mvc-and-django-mvt-architecture`, `#why-django-and-project-setup`, `#django-urls-views-and-templates`, `#django-static-files`, `#django-forms-and-csrf`. Page shipped at `5,763w` — **rebalanced, not cut**, by owner decision that the word ceiling no longer applies: `#forms` 757w &rarr; 334w (0 marks) while `#mvc` 191w &rarr; 500w and `#django-intro` 245w &rarr; 618w (26 of 30 marks). Every `<section id>` preserved.

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 6)
- **Architectural Pattern:** Introduction to MVC (Model–View–Controller) Framework and how Django implements it as MVT / MTV (Model–View–Template).
- **Django Setup:** Overview of Django (features & why use it); Creating a Project in Django (`django-admin startproject`); Creating an Application in Django (`manage.py startapp`, `runserver`).
- **Presentation Layer:** URL routing & Views; Working with Templates (DTL); Static Files (`STATIC_URL`, `{% load static %}`).
- **User Input:** Working with Forms in Django (`forms.Form`, CSRF protection, basic validation).

> **Syllabus-Boundary Note:** Flask is not in PDF p. 6, but `P005-Q21iii` (`2m`) asked *"Is Django better than Flask?"* — cover via a compact, honestly badged **Tier E** trade-off box (~110w) in `#django-intro`. Do not add Django REST Framework, ORM migration internals, class-based generic view sprawl, or deployment tutorials (`0m`).

---

## 2. Current Page Audit & Gaps (`subjects/CST203/units/unit-5.html`)
- **Live metrics:** `5,657` words (currently longer than `152m` Unit 1 despite earning **5× fewer marks**!) · `26` `<pre>` blocks · `8` `<table>`s · `0` `<svg>`s · `0` `<h3 id>`s · `8` MCQs · `8` short Qs · `5` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#mvc` `191w`, `#django-intro` `245w`, `#urls-templates` `759w`, `#forms` `757w` (`1,952w` concept prose).
- **Specific defects & right-sizing targets:**
  1. **Completely inverted internal split:** `#mvc` + `#django-intro` drive **`26 / 30m` (`86.7%` of Unit 5!)** in just `436w`, while `#forms` spends `757w` and bloated boilerplate snippets on **`0m`**. Trim `#forms` by ~67% (`757w → ~250w`) while preserving `<section id="forms">`.
  2. Strengthen `#mvc` with an inline SVG HTTP request–response diagram and a crystal-clear **MVC vs Django MVT (MTV) Mapping Table** (`P003-Q34a`, `P004-Q21i`, `P005-Q21ii`, `P006-Q14,Q24b`).
  3. Strengthen `#django-intro` with a crisp numbered 6-step **Create & Run a Django Project** workflow (`P003-Q34b`, `P006-Q15`), 6 reasons to choose Django (`P004-Q21ii`), and the badged ~110w **Tier E Django vs Flask** table (`P005-Q21iii`).
  4. Resolve unmatched `P005-Q11` (`Django static files`) and `P005-Q21` (`File word count / MVC / Django vs Flask`).

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`30m`)

| Topic Cluster | Marks | % of U5 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **MVC & Django MVT/MTV architecture + why use Django** | **19m** | **63.3%** | 4.9% | **4/4** | **Tier A** | `P003-Q34a(3m MVC + each term)`; `P004-Q21i(3m MVC),Q21ii(5m what is Django & why use it)`; `P005-Q21ii(2m MVC)`; `P006-Q14` (2m MVC/MVT MCQ), `P006-Q24b(4m Django MVC/MTV)` |
| **Creating & running a Django project/app, URLs, templates & static files** | **9m** | **30.0%** | 2.3% | 3/4 | **Tier C** | `P003-Q34b(5m steps to create & run Django project)`; `P005-Q11` (2m static files); `P006-Q15` (2m template/`manage.py`) |
| **Django vs Flask trade-off comparison** | **2m** | 6.7% | 0.5% | 1/4 | **Tier E** | `P005-Q21iii(2m "Is Django better than Flask?")` |
| **Working with Django Forms (`forms.Form`, CSRF, validation)** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 6), 0 hits in 2023–2026 — condense to ~250w_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#mvc` [LOCKED] — MVC Pattern & Django MVT / MTV Cycle (Tier A · ~32% prose)
- Role of **Model** (data schema & business rules), **View** (UI output), and **Controller** (input handling & orchestration) plus benefits of separation of concerns (`P003-Q34a`, `P004-Q21i`, `P005-Q21ii`).
- **MVC ↔ Django MVT (MTV) Mapping Table:** Model ↔ `models.py` (ORM), View ↔ Template `.html` (DTL), Controller ↔ `views.py` + `urls.py` dispatcher, plus end-to-end request lifecycle `Browser → urls.py → views.py ↔ models.py/DB → template → HttpResponse` (`P006-Q14,Q24b`).

### 4.2 `#django-intro` — Why Django, 6-Step Project Setup & Tier E Flask Note (Tier A + Tier C + Tier E · ~32% prose)
- What Django is + 6 exam-ready strengths ("batteries included": ORM, auto admin, auth, CSRF/XSS/SQL-injection defenses, DRY rapid dev, scalability — `P004-Q21ii`).
- Numbered **6-Step Create & Run Checklist** (`P003-Q34b`, `P006-Q15`): (1) `python -m venv venv` + activate, (2) `pip install django`, (3) `django-admin startproject mysite`, (4) `cd mysite && python manage.py migrate`, (5) `python manage.py startapp core` (+ register in `INSTALLED_APPS`), (6) `python manage.py runserver` → `http://127.0.0.1:8000/`.
- Concise file-role table (`manage.py`, `settings.py`, `urls.py`, `wsgi.py`/`asgi.py`) + 4-row Project vs App table.
- **Badged Tier E Box (~110w, `2m`):** Balanced **Django vs Flask** table (full-stack batteries-included for database-backed apps vs minimalist micro-framework for small APIs/microservices — `P005-Q21iii`).

### 4.3 `#urls-templates` [LOCKED] — URLs, Views, Templates & Static Files (Tier C · ~24% prose)
- Minimal 3-file Hello slice: `urls.py` (`path("home/", views.home)`) → `views.py` (`render(request, "home.html", ctx)`) → `templates/home.html` showing `{{ var }}`, `{% for %}`, `{% if %}`, `{% extends %}`/`{% block %}`.
- **Static Files Checklist** (`P005-Q11`): `'django.contrib.staticfiles'` in `INSTALLED_APPS`, `STATIC_URL = "static/"`, app `static/` folder, `{% load static %}`, `<link rel="stylesheet" href="{% static 'css/style.css' %}">`, and `collectstatic` one-liner.

### 4.4 `#forms` — Django Forms Essentials (Tier S · ~12% prose, ~250w)
- Keep `<section id="forms">` intact; include one compact `FeedbackForm(forms.Form)`, view check `if request.method == "POST": ... if form.is_valid(): form.cleaned_data`, and why `{% csrf_token %}` prevents Cross-Site Request Forgery.

### 4.5 Practice & Revision Bank
- `6` MCQs, `4` short answers, and `3` crisp worked 8m essays (`MVC + create/run project`, `MVC + why Django + Django vs Flask`, `Django MVT + templates & static files`).

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVG (1):** Django MVT request–response flow (`Client ↔ URLconf → View ↔ Model/DB + Template → HTTP Response`) side-by-side with classic MVC roles.
- [ ] **Code blocks (5 concise, `ast.parse`-verified where Python):** 6-line CLI project setup; `urls.py` + `views.py`; DTL template with `{% load static %}`; compact `FeedbackForm` + `{% csrf_token %}` snippet.
- [ ] **Comparison tables (3):** Classic MVC vs Django MVT (MTV); Django Project vs Django App; Badged Tier E Django vs Flask.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST213/index.html`, PDF pp. 16–18)

| `CST213` Practical Area | Unit 5 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 8:** Developing a simple web application (Django) | `#django-intro`, `#urls-templates`, `#forms` | Direct 1:1 lab match — link from `#django-intro` & `#practice` as the step-by-step lab scaffold |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | MVC vs Django MVT (MTV) Architecture & Request–Response Flow Explained | **Tier A** (`19m`, 4/4) | `#mvc` | Clean architectural diagram + why use Django; Django 4/5 compatible; 10–20 min; verify live |
| **2** | Create & Run Your First Django Project: App, URLs, Views, Templates & Static Files | **Tier C** (`9m`) | `#django-intro` | Shows `startproject`, `startapp`, `runserver`, DTL, and `{% load static %}`; 20–35 min; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 5 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q34`, `P004-Q21`, `P006-Q14` | 8,8,2m | U5 `MVC / Django` | Same-unit → `#mvc` | `#mvc-and-django-mvt-architecture` — *MVC Framework and Django MVT (MTV) Architecture* |
| `P005-Q21` *(parts ii–iii)*, `P006-Q15` | 8m, 2m | U5 `File word count / MVC / Django vs Flask`; U5 `Django` | `P005-Q21` Unmatched | `#django-project-setup-and-django-vs-flask` — *Overview of Django, Project Setup and Django vs Flask* |
| `P005-Q11`, `P006-Q24` *(part b)* | 2m, 8m | U5 `Django static files`; U5 `Regular expressions / Django` | `Q11` Unmatched; `Q24` → U4 `#regex` | `#django-static-files-urls-and-templates` — *Django URLs, Views, Templates and Django Static Files* |
| _(Tier S anchor)_ | 0m | Syllabus Unit 5 Forms | Preserved `#forms` | `#django-forms-and-csrf` — *Working with Django Forms and CSRF Protection* |
