# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Start here: query the graph, don't read the files

This repo carries a **knowledge graph** of itself in `graphify-out/` (335 nodes, 511 edges, 28 communities — every function of `app.html`, the notebook's markup contract, the design rules, the traps; recalibrated 2026-07-21 after the closing cleanup pruned the deleted chantier documents' 63 nodes — the 2026-07-20 recalage had already stopped duplicating the standalone as ~90 function nodes). It exists so that answering a question costs **~2.3k tokens instead of reading a 2 000-line HTML file** (measured 2026-07-20: 10.5× fewer tokens per question).

**Before opening `app.html`, `vocabulaire_hebreu.html` or `flashcards_hebreu.html` to find something, ask the graph:**

```bash
graphify explain "checkAnswer"     # exact source line + every caller/callee, ~15 lines
graphify query "comment la révision espacée écrit-elle dans localStorage ?"
graphify path "extractCards" "recordResult"    # how two things connect
```

`graphify explain` is the reason this file no longer carries `near line NNN` pointers: **line anchors have drifted four times in this repo**, and all three of this file's were wrong (+11) when they were retired on 2026-07-20. The graph re-derives line numbers mechanically instead. It is not immune to drift either — it is a snapshot — so if a lookup contradicts the file, trust the file and rebuild (`/graphify . --update`).

Read a file in full only when you are about to **edit** it, or when the graph's answer is genuinely insufficient. `GRAPH_REPORT.md` holds the audit trail (god nodes, cross-community bridges, EXTRACTED/INFERRED/AMBIGUOUS provenance).

## Then: the subagent regime — STANDING DIRECTIVE, maximal delegation

**This is a permanent instruction from the project owner (2026-07-21, stated three times): use subagents à fond, without being asked again.** The reason: **every turn re-sends the whole accumulated context**, so a file read at turn 5 is paid again at turns 6, 7, 8… Growth is quadratic in session length. A subagent has its own window and returns **only its conclusion** — the intermediate traffic never enters this one. The graph rule above fights the cost of *one* lookup; this rule fights the cost of the *session*, which is the bigger bill.

**The test is the ratio, not the difficulty: much intermediate output, short verdict → delegate.** Mandatory delegations in this repo:

- **Every WebKit/Playwright run.** Dozens of driving round-trips (and screenshots, among the most expensive things a context can hold) for a verdict that fits in three lines. The single biggest win.
- **`node build.js` / `verifie_exemples.js` on a batch** — you want the counts and the named errors, not the log.
- **Broad exploration and any bulk file reading** the graph can't answer in one query — sweeping files for a property, extracting verbatim material/templates/line anchors from large files. The main thread never reads a big file it is not about to edit.
- **Material audits and content drafting on batches** (vocabulary lots, counter-expertise, dry-run validation) — the whole authoring pipeline runs in agents; only verdicts and arbitrages surface.

**How to run them** (the part that keeps getting re-explained — don't make the owner repeat it):

1. **Parallel fan-out when independent** — launch all independent agents in ONE message. A 12-check campaign is 3 agents by theme, not 1 giant or 12 tiny ones.
2. **Numbered criteria in every prompt**: "count X, name every failure, PASS/FAIL per item, max N lines, no screenshots/HTML in the reply". A subagent inherits this file, not your conversation — state the acceptance bar *in the prompt*. An agent that answers « c'est bon » proved nothing: a muted control always passes green (same lesson as the coverage guard in `build.js`).
3. **Reuse a finished agent for follow-ups in its area** (continue it with a new message) instead of spawning a fresh one — its context is already paid for.
4. **Never read an agent's transcript/output file, a screenshot, or a raw log in the main thread.** If the report is insufficient, send the agent a follow-up question.
5. **The main thread keeps only**: charter/design judgment (DESIGN.md's named rules), content arbitration, the edits themselves, commits, the documentation pass, and short greps (≤ ~15 lines of output). These need the accumulated context and the project's voice — exactly what a subagent doesn't have.

**One session per chantier**, then `/clear`. Step 5 of the ritual is a commit, which is the clean cut point: the state lives in git and in TODO.md « Reprendre ici », not in the context window.

## What this is

A French-language toolkit for learning modern Hebrew, deployed as static files on GitHub Pages at `https://rubischtgadol.github.io/flashcards-hebreu/`. There are **no dependencies, no tests, no package manager** — every deployed file is a single self-contained HTML document with inline CSS and vanilla JS. The only tooling is `build.js`, `verifie_exemples.js` and `audit_carnet_mecanique.js` (dev-only, zero-dependency Node scripts, not deployed; the last one is stage 0 of the notebook audit — it regenerates the gitignored `audit/` work pieces). To develop, open the files in a browser; to deploy, replace files on the `main` branch (GitHub Pages redeploys automatically, same URLs).

The five deployed pieces: **`vocabulaire_hebreu.html`** (the notebook — **single source of truth for all content**), **`index.html`** (the portal / root page), **`app.html`** (the online flashcards, fetches the notebook at load), **`flashcards_hebreu.html`** (the standalone offline build), and the PWA layer (`manifest.webmanifest`, `sw.js`, `icons/`). Ask the graph for what any of them contains; ARCHITECTURE.md holds the prose version.

Important: `app.html` uses `fetch()`, so it must be served over HTTP, not opened as a `file://`. Run a local server from the repo root (`python3 -m http.server`) and open `http://localhost:8000/`.

## ⚠️ The traps — these do not live in the graph, because they must fire before you ask

Each of these was paid for once. They are listed inline because a graph query only helps an agent who already suspects there is something to know.

1. **Never edit `flashcards_hebreu.html` by hand.** It is 100% generated by `node build.js` from `app.html` + the notebook. Hand edits are erased on the next build.
2. **Never use `transition:all` in `app.html`.** The shorthand captures the `outline-*` longhands; WebKit then pins them to their initial values, so a focused element renders WebKit's UA ring instead of the gold one *while still matching `:focus-visible`*. This silently cost the 40+ chips and the cards-mode buttons their focus ring. Always list the animated properties explicitly (`background, color, border-color, opacity`).
3. **`font-size:22px` sits on `body`, never on `html`, in all three files — so `1rem` is 16px, not 22px** (measured in WebKit; the old comment claiming otherwise was false, and that misunderstanding caused a 24-value type drift). Do not "fix" this by moving the 22px to `html`: it would scale every `rem` by 1.375 here *and* in `app.html`, whose sizes are tuned to what they actually render.
4. **The notebook holds three `:root` blocks, and they never merge.** (1) the shared design tokens — see trap 5; (2) the 8-step type ramp (`--pas-titre` 2.3rem … `--pas-micro` 0.7rem): **no literal `font-size` may remain outside it**, the single named exception being `1.15em` on Hebrew embedded in French prose; (3) the reading column (`--colonne` 28rem, `--colonne-large` 56rem). Both local blocks are **measured values, not preferences** — `--colonne-large` is a floor (the widest table sits at 890px; below 55.6rem, 7 of 29 tables gain a scrollbar) and `--colonne` is calibrated on the prose's real advance (6.63px/char), never on a digit's width. DESIGN.md §3 carries the full rule and the three traps paid for it.
5. **The first `:root` design-token block must stay byte-identical** between the notebook, `app.html` and the portal (the notebook is the reference). If `--bg`/`--gold` change, regenerate the icons and update `manifest.webmanifest`/`theme-color`.
6. **Every Hebrew node carries `lang="he"`** — in the notebook (100% of 5234 nodes, measured 2026-07-21) and in every generated node of the app (`.big-he`, `.sub-he`, `.cursive-line`, `.f-he`, `.qc-he`, `.sr-he`, `.srd-he`, `.m-he`, feedback `.he`, brand `.he`). Keep it when touching those template strings. ⚠️ The notebook count must be **measured in a browser, not computed from the source**: a new entry also creates its generated `span.cursive`, so one word is worth more than one node.
7. **Gold never appears on an inactive state** (DESIGN.md, règle de la lampe), and no surface is gold-tinted at rest — the app's « Révision du jour » card is the single licensed exception. `border:1px dashed` means **only** "nothing here" (`.empty`); warning boxes use `.attention`, solid rule.
8. **`data-niveau` is mandatory in the notebook** on every `<li>` and every `<tr>` of the three tables. `build.js` fails naming the offending word if any card comes out without one (coverage 757/757). The app's tolerance for unclassified cards is a safety net, not a licence.
9. **Every entry of the Noms/Adjectifs/Verbes tables must carry at least one example** (verbs: a present-tense sentence). `verifie_exemples.js` treats a missing `<ul class="exemples">` as a blocking error.
10. **Bump `VERSION` in `sw.js`** after changing its strategy, asset list or icons — **and whenever a change must reach the device on the very next launch**. The fetch handler is stale-while-revalidate: without a bump, the previous `app.html` is served once more and the new one only from the second launch.
11. **The service worker registration lives inside the `BUILD:ONLINE-ONLY` fence** of `app.html` and must stay there (the standalone file must not register it). The portal has its own snippet.
12. **WSL tooling**: visual checks run through **Playwright + real WebKit** (`devices['iPhone 16 Pro']`), pure logic through jsdom. The system headless Chrome **hangs in WSL2 — never use it**. Details in TODO.md § Outillage.
13. ⚠️ **Our visual checks are iPhone-emulated, so a desktop-only defect is invisible to them.** The notebook's unbounded reading width (158 characters per line at 1280) survived every critique of the project for exactly this reason: on mobile the viewport bounds the text on its own, so nothing looked wrong. **When you touch layout, measure at desktop widths too** (1440/1280/992/900/768), not only on the phone. Symmetrically, a layout change proven on desktop must be shown to leave the phone **identical** — that comparison is what catches a fix that quietly costs mobile something.
14. ⚠️ **An emulated timing is worthless in absolute terms — it is only ever valid compared to itself.** Paid for on 2026-07-20: emulated WebKit measured the study screen's first render at **329 ms** and I made it the prime suspect for a reported lag, reasoning that a phone's CPU could only make it worse. The real iPhone renders it in **41 ms**, and was *faster than the dev machine* on all three measured paths (boot 31 vs 88 ms, chip tap 49 vs 53 ms). Emulation runs a desktop CPU through a phone-shaped viewport; it models layout, not performance. **Use emulated timings only as A/B deltas** (before vs after, this build vs that build). For any absolute claim about how the app *feels*, the measurement must come off the device — that is what the « Diagnostic de latence » block in « Réglages avancés » is for (TODO.md § chantier carries the reference table). This is the mirror of trap 13: there, emulation hid a real desktop defect; here, it invented a mobile one that did not exist.

## The extraction coupling (the one thing to understand before editing the notebook)

`app.html`'s `extractCards(doc)` scrapes the notebook's DOM, and `build.js` re-implements the same parse with regexes (no DOM in Node). Edits to `vocabulaire_hebreu.html` can therefore **silently drop cards**. The invariants:

- Sections are found by `<h2>` containing `<span class="count">LABEL</span>`. **The exact `LABEL` text is the key** (`'Verbes'`, `'Adjectifs'`, `'Noms'`, `'Pronoms personnels'`, `'Nombres (0–10)'`…). Renaming a count label detaches its section from extraction.
- Entries live in `<table><tbody><tr>` rows (Verbes, Adjectifs, Noms) or `<ul class="word-list"><li>` items (everything else — see the `listCats` map). Adding a `listCats` entry must be mirrored in `build.js` (both `listCats` **and** `EXPECTED_CATS`).
- Table extraction is **positional**: Verbes needs ≥5 columns, Adjectifs ≥4, Noms ≥3 (col. 2 = gender `m`/`f`, col. 3 = plural). Fields come from child spans `.he` / `.tr` / `.fr`.
- ⚠️ **Nested `<li>` break naive regex.** `lisOf` in `build.js` does depth-aware scanning for top-level `<li>` only; `app.html` uses the `ul.word-list > li` direct-child selector. Keep both properties when touching either parser.
- ⚠️ **Property insertion order in card objects must stay identical between the two extractors** — `node build.js --check` byte-compares the embedded snapshot, which is how drift gets caught.
- For a word's examples, the word's own `.he`/`.fr` spans must come **first**: extraction reads the *first* `.he`/`.fr` of the fragment.
- Grammar-only sections (racine, passé, futur, binyanim, article, smikhut…) have no `.count` mapping and are intentionally excluded from cards.
- `build.js` replaces the loader `<div>` by **exact string match** — editing that line in `app.html` requires the same edit in `build.js`.

Card schema: `{cat, he, tr, fr, note?, niveau?, exemples?:[{he, tr, fr, he_plain}], he_plain, forms?:[{he, tr, label, he_plain}], genre?}`. Table-derived cards have `tr:''`; the UI falls back to `he2tr(card.he)`. Full detail in ARCHITECTURE.md §3, or `graphify explain "extractCards"`.

## Transliteration standard

All notebook `.tr` values and `he2tr` output follow it: `kh` = khaf without dagesh, `ch` = het (final furtive patach → `ach`), `ts` = tsadi, `'` = ayin everywhere (`'ivrit`, `be'er`, `yode'a`) and alef between two vowels (`tsme'ah`), final hey kept (`atah`, `zeh`), `ei` for tsere/segol+yud (`beit`), `u`/`f`/`k`/`v` (never `ou`/`ph`/`q`/`w`). Initial cluster shva is written only when heard (`gdolim` but `ledaber`).

⚠️ **The notebook is authoritative — don't blindly regenerate hand-written `.tr` values from `he2tr`.** Thanks to `trKey`'s folding the standard is display-only: typing stays tolerant to all variants. When changing acceptance behaviour, edit `trKey` and `he2tr` **together** — they must agree on the canonical form, and `he2tr` doubles as the display fallback wherever a card has no notebook `tr`.

## The ritual after any change

1. `node build.js` — regenerates the standalone; fails if a section or an `EXPECTED_LEVELS` level drops to 0, or if any card lacks `data-niveau`. Check the printed counts.
2. If examples or vocabulary changed: `node verifie_exemples.js` — **0 errors required** (warnings are editorial signals; `--strict` blocks on them too).
3. Verify the behaviour, **at the cheapest level that actually proves it**. `build.js --check` already byte-compares the two extractors, so a content-only change is proven by steps 1–2 alone. Add a local server or jsdom when logic changed. **Reach for WebKit/Playwright only when you touched the UI** — markup, CSS, or a render path. Booting a real browser to re-confirm what `--check` just proved is comfort, not evidence, and it costs a tooling install plus a session of driving.
4. If `sw.js`, the asset list or the icons changed: bump `VERSION`.
5. **Refresh the graph — but only on a structural change.** `/graphify . --update` costs **~235k tokens** (measured 2026-07-20), so it is not a reflex. Two natures of change, two answers:
   - **Structural** — `app.html`, `build.js`, `verifie_exemples.js`, `sw.js`, `index.html`, or a new/renamed/deleted file. The graph's map is now wrong: refresh it, otherwise this file's premise (query the graph first) starts lying.
   - **Content only** — vocabulary or examples in `vocabulaire_hebreu.html`, and the prose of the `.md` files. **The graph is still correct**: no function, file or flow moved. Only counts changed, and they live in the docs (step 6), not in the graph. Skip the refresh and say so in the commit.

   ⚠️ The trap this rule was bought with: the 54-example batch of 2026-07-20 was pure content, and refreshing anyway cost ~4× the useful work to move two counters from 510 to 564. The `--update` diff (168 nodes added, 87 removed) shows it churns the graph rather than extending it — one more reason not to run it for nothing.
6. Update the docs (README, ARCHITECTURE, DESIGN, PRODUCT, TODO — especially « Reprendre ici »).
7. Commit per change, messages in French, then push to `main`.

Full version, with the tooling traps, in TODO.md § Rituel à chaque modification.

## Content note

All UI text and documentation is in **French**. Match that when editing user-facing strings. (This file stays in English — it is agent-facing.)

## Where the prose lives

- **`ARCHITECTURE.md`** — data flow, the two extractors, card schema, CEFR levels, the validator's lexicon and its two guards, `app.html`'s anatomy, the silent-breakage guards. **§ « Le graphe de connaissance du dépôt » documents the graph itself.**
- **`DESIGN.md`** — the visual system ("Le carnet d'étude du soir"): Nuit d'encre/Or ancien, the three type voices, the named rules (lampe, couches, vedette, carte unique, le pli).
- **`PRODUCT.md`** — register, platform, users, goal, personality, anti-references (no Duolingo gamification, no generic SaaS, no austere textbook).
- **`TODO.md`** — current state, what's next, the WSL tooling, the ritual.
- **`GRAPH_REPORT.md`** — the graph's audit trail.
