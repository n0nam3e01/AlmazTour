# Almaz Tour Update Implementation Plan

> **For agentic workers:** use executing-plans for local execution and dispatching-parallel-agents for disjoint content, pages and forms. Track results below; no extra approval pauses because the owner explicitly requested starting and resolving details while working.

**Goal:** Ship a verified local update with ru/kk, three themes, restrained design and Lenis, retaining the animated navigation pill.
**Architecture:** Shared App Router pages under `[locale]`, centralized typed copy and destination data, persistent locale/theme/scroll providers. Existing Telegram transport and Tourvisor IDs remain intact.
**Tech Stack:** Existing Next.js 16.2.10, React 19, TypeScript, Tailwind, Motion, GSAP; add only Lenis for product code. Use Node test runner and existing TypeScript for isolated tests.
**Spec:** `docs/superpowers/specs/2026-10-16-almaz-tour-update-design.md` including the deferred live Tourvisor requirement.

## Global Constraints

- Preserve `420ms cubic-bezier(0.23, 1, 0.32, 1)` navigation pill; no page-wide fade replacement.
- No production deploy, push, domain/account changes or messages to real managers.
- Preserve existing dirty Telegram/README/environment changes. Never commit secrets or `.codex/`.
- Work in the current project as requested; current branch is `codex/futuristic-travel-redesign`, not main.
- Languages derive from URL. Old links redirect to ru; API and assets are not localized.
- Live Tourvisor is deferred; loading/error/fallback states remain required.

## Review Focus

- Locale changes preserve query/hash/draft and do not reset scroll accidentally (tasks 1, 2, 4).
- Dark theme first paint, invalid storage, and OS changes (tasks 1, 2).
- Missing Telegram must return failure, never falsely confirm delivery (task 3).
- Back/forward, hash links and sticky navigation must not fight smooth scrolling (task 5).
- Long Kazakh labels must fit mobile and intermediate desktop widths (tasks 2, 4, 6).

### Task 1: Shared routing and settings contracts

Files: `src/lib/i18n.ts`, `src/lib/theme.ts`, `tests/load-ts.cjs`, `tests/settings.test.cjs`, `next.config.ts`.
Interfaces: `Locale = 'ru' | 'kk'`, `hasLocale`, `localizePath(path, locale)`, `stripLocale(path)`, `switchLocale(href, locale)`, `localeFromPath(path)`; `ThemeMode`, `parseThemeMode(value)`, `resolveTheme(mode, darkOS)`.

- [ ] Write behavior tests for locale mapping, preserved query/hash, external-link safety, unknown locale, theme defaults and OS override; run and observe failure.
- [ ] Implement pure helpers and explicit redirects for legacy routes; run tests to green.
- [ ] Read installed Next guides for layout, metadata, redirects, scripts and route handlers before editing those APIs.

### Task 2: Persistent localized shell and themes

Files: `[locale]/layout.tsx`, `LocaleProvider`, `ThemeControl`, `LanguageSwitch`, `Header`, `AnimatedNavDock`, `Footer`, `ui-copy`, `globals.css`, localized 404, `site.ts`, sitemap/robots.
Consumes task 1. `useLocale(): Locale` is the client contract. Semantic CSS: `surface`, `surface-soft`, `ink`, `muted`, `field`, `form-error`, `button-primary`, `button-dark`, `button-secondary`, `section`, `container`.

- [ ] Build shared shell and localized metadata/canonical/hreflang with URL-controlled HTML lang.
- [ ] Implement early theme script plus accessible system/light/dark control, OS listener and storage fallback.
- [ ] Preserve pill DOM and timings; recalculate geometry on labels/fonts/resize without animating initial positioning.
- [ ] Verify keyboard/menu/focus/width and theme persistence in browser tests in task 6.

### Task 3: Forms and delivery (disjoint sidecar)

Files: forms/*, `src/lib/leads.ts`, `src/lib/form-draft.ts`, `src/data/form-copy.ts`, api/*, `tests/forms.test.cjs`.
Consumes `Locale` and `useLocale`. Produces `LeadForm({defaultCountry?, mode?: 'quick'|'detailed', context?})`. Keep multi-stars and children ages.

- [ ] Write and run failing API/validation tests with mocked external fetch, including no-config, malformed fields, short lead and expanded payload.
- [ ] Implement both scenarios, translated labels/errors, all new notification fields, 30-minute per-tab draft, no PII logging, 503/502 semantics for all forms.
- [ ] Run focused and whole Node test suite. Never use actual Bot API.

### Task 4: Localized content and pages (disjoint sidecars)

Files: destination data, DestinationCard, AccordionGallery; `[locale]/{page,destinations,hot-tours,health-tours,reviews,contacts}`, `page-copy`, `PageHeading`.
Data interface: existing `destinations` remains ru; `getDestinations(locale): Destination[]`; `getDestination(slug, locale = 'ru'): Destination | undefined`.

- [ ] Produce matching ru/kk catalog, replace unsupported prices/entry/flight assertions with useful stable descriptions; preserve original review quotes.
- [ ] Update pages to common layout and two clear actions, shorter hero, one gallery, workflow, agency block, reviews and quick lead.
- [ ] Preserve all 15 slugs/images, add route context to forms and translated metadata.
- [ ] Verify dictionary/catalog consistency, generated routes, translated controls and accessible headings.

### Task 5: Scroll and robust motion/widget shells

Files: `SmoothScroll`, `scroll` helpers, `Reveal`, `ReviewsShowcase`, `ClickSpark`, `TourvisorModule`, dependencies, scroll/widget tests.

- [ ] Write failing scroll decision tests for ordinary navigation, history and language/hash changes.
- [ ] Add one Lenis instance using documented GSAP ticker integration, native touch, reduced-motion handling and scoped exclusions. Keep browser history restoration and offset anchors.
- [ ] Make Reveal fail visible, respect reduced motion and avoid duplicate effects.
- [ ] Bound Tourvisor loader/error timing from attempt start; compact fallback, retry and manager actions. Do not claim live provider repaired.

### Task 6: Verification, review and handoff

Files: browser verification script/fixtures, README, `.env.example`, this plan's progress ledger.

- [ ] Run Node tests, TypeScript, ESLint and production build; fix actual failures.
- [ ] Browser-check seven main route types, ru/kk, three theme modes (system against both OS themes), 375/768/1440 and intermediate header width.
- [ ] Test pill motion, back/forward, hash, language/draft/theme persistence, keyboard/menu, reduced motion and mock deliveries without contacting managers.
- [ ] Request one fresh whole-change review; fix important findings with regression tests.
- [ ] Document verified results, deferred live Tourvisor and owner settings. Leave local changes ready; no push/deploy.

## Progress and rulings

- Baseline: pre-existing changes are `.env.example`, README and Telegram helper; untracked `.codex/` belongs to user.
- Ruling: execute now without additional spec/plan approval gates, per owner message "пока начинай работать в ходе поймём что не так".
- Ruling: keep current checkout because the request explicitly identifies it and its existing changes; no new worktree.
- Pre-flight: shared interfaces are declared above. Forms own form copy; pages own page copy; shell owns ui copy. Sidecar write sets do not overlap.
