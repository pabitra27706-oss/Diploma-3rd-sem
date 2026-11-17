# Local check in Termux — `arena/7e77489f-diploma-3rd-sem`

Everything below is verified in this sandbox: Python 3.11 stdlib only, no
`pip install` step, no `npm install` step. Node is optional (see step 6).

---

## 1. One-time setup

```sh
pkg update && pkg upgrade -y
pkg install git python
```

The scripts and the 113-test suite import **only the Python standard library**
(`pathlib`, `html.parser`, `json`, `re`, `subprocess`, …). Nothing to install.

---

## 2. Clone the branch

The site must be served from a directory **named `Diploma-3rd-sem`**, because
every internal link is absolute under the `/Diploma-3rd-sem/` base path.

```sh
cd ~
git clone --branch arena/7e77489f-diploma-3rd-sem \
  https://github.com/pabitra27706-oss/Diploma-3rd-sem.git
cd Diploma-3rd-sem
```

Expected: HEAD at `5b0f571 Phase 9B: single shared design layer, retheme, and
accessibility pass`.

> If you already have the repo cloned, do **not** clone again:
>
> ```sh
> cd ~/Diploma-3rd-sem
> git fetch origin arena/7e77489f-diploma-3rd-sem
> git checkout arena/7e77489f-diploma-3rd-sem
> git pull --ff-only origin arena/7e77489f-diploma-3rd-sem
> ```

Confirm you are on the right commit:

```sh
git log --oneline -1
git status -sb          # expect a clean tree, no modified files
```

---

## 3. Serve it

Run the server **from the parent directory**, not from inside the repo:

```sh
cd ~
python3 -m http.server 8010 --bind 127.0.0.1
```

Then open in your phone browser:

```
http://127.0.0.1:8010/Diploma-3rd-sem/
```

Stop with `Ctrl+C`.

Two gotchas worth knowing:

- `http://127.0.0.1:8010/` (bare root) shows a directory listing, **not** the
  site. The `/Diploma-3rd-sem/` path segment is mandatory.
- Don't bind to `0.0.0.0` on a phone unless you want it on your LAN.

### Optional: use the phone itself as the device

To test the real touch layout rather than a desktop-width emulation, open it in
Chrome on Android and turn on **Desktop site OFF**, then check these:

- bottom nav bar sits above the gesture bar and is tappable
- the theme toggle in the header switches light ⇄ dark and survives reload
- `/Diploma-3rd-sem/subjects/CST201/units/unit-1.html` — reading column is not
  cramped, and the floating action buttons don't cover text

---

## 4. Run the six static gates

From the repo root:

```sh
cd ~/Diploma-3rd-sem

python3 scripts/check_site.py
python3 scripts/check_tokens.py --strict
python3 scripts/audit_accessibility.py
python3 scripts/validate_pyq.py
python3 scripts/check_root_rewrite.py
python3 scripts/audit_page_weight.py --budget
```

All six should exit **0**. The last one prints:

```
budget: every page within 300 KB CSS / 350 KB JS (uncompressed, first-party)
```

That 300 KB fence was raised from 250 KB by owner decision (Option A) on
2026-11-17; the rationale is in the script's docstring.

---

## 5. Run the test suite

```sh
python3 -m unittest discover -s tests -q
```

Expected:

```
Ran 113 tests

FAILED (errors=1)
```

**One error is expected and is not a regression.** It is
`test_data_pipeline.test_no_semantic_or_answer_changes`, which shells out to
`git show 664674b:_data/CST201/CST201-P001-2021-03.json`. That commit is not in
the clone history, so the test fails with:

```
fatal: Not a valid object name 664674b
```

To make it pass, unshallow the clone (fetches full history — a few hundred MB):

```sh
git fetch --unshallow
```

Then re-run the suite; all 113 should pass.

---

## 6. Optional: the JS preference tests

Only needed if you want to check the storage/migration logic. Requires Node:

```sh
pkg install nodejs
node tests/preferences.cjs
```

Expected: 3/3 pass.

---

## What you should see

| Check | Expected |
|---|---|
| `git log --oneline -1` | `5b0f571 Phase 9B: single shared design layer…` |
| `git status -sb` | clean tree |
| 6 static gates | all exit 0 |
| `audit_page_weight.py --budget` | PASS, 300 KB CSS / 350 KB JS |
| unittest | 113 run, 1 error (the shallow-clone `664674b` one) |
| `node tests/preferences.cjs` | 3/3 pass |

The rendered-accessibility figures from the review — **0 contrast failures,
0 unnamed controls, 0 sub-24px targets, 0 JS errors across 148 page·theme
combinations** — come from a headless Chromium sweep driven by puppeteer. That
harness is not in the repo and Termux cannot run it; the six static gates above
are the part that reproduces here. Judge contrast and layout by eye in step 3.

---

## Full reset, if you want to start over

```sh
cd ~
rm -rf Diploma-3rd-sem
```

Then repeat step 2.
