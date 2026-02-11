# AI Curling Championship - Tasks

> **Goal**: Make this a polished, mobile-first game that's shareable on LinkedIn and drives discovery calls for BrandedAI.
> **Live URL**: https://curling.brandedai.net/
> **Repo**: https://github.com/SCEVLTD/ai-curling

---

## Critical Issues (Game-Breaking on Mobile)

### T1: Responsive rink — fit viewport height without scrolling
- **Priority**: P0 (blocks everything)
- **Problem**: Rink is hardcoded at `370x800px`. On iPhone (375x812), HUD + label + rink + footer = ~938px total — requires scrolling. You can't see the stone AND the target simultaneously, making the game unplayable.
- **Fix**: Calculate rink dimensions dynamically from available viewport height (`100dvh` minus HUD/label/footer). Use CSS `aspect-ratio` or JS to maintain the ~0.46 width:height ratio. All physics constants (`RINK_W`, `RINK_H`, `TARGET_X`, `TARGET_Y`, `START_X`, `START_Y`, `STONE_R`, zone radii) must become proportional to actual rink size, not fixed px.
- **Acceptance**: Entire game (HUD, label, rink, footer) visible without scrolling on 360x640 (smallest common Android) through 430x932 (iPhone 15 Pro Max).
- **Depends on**: Nothing
- **Touches**: `AICurlingGame.jsx` (constants, all positioning logic, zone radii)

### T2: Scale all physics coordinates to dynamic rink size
- **Priority**: P0
- **Problem**: `TARGET_X=185`, `TARGET_Y=155`, `START_Y=720`, `STONE_R=22`, zone radii (32/62/95/130) are all hardcoded px. When the rink resizes, these must scale proportionally or everything breaks.
- **Fix**: Define all positions as ratios (e.g. `TARGET_Y_RATIO = 155/800 = 0.194`) and multiply by actual rink dimensions. Same for `STONE_R`, zone radii, wall bounds, collision distances. `scaleCoord()` already maps pointer coords to rink space — that pattern extends naturally.
- **Acceptance**: Physics feel identical across all screen sizes. Scoring zones are proportionally sized. Stone radius is visually appropriate (not tiny on small screens, not huge on tablets).
- **Depends on**: T1

### T3: Lock page scroll during gameplay
- **Priority**: P0
- **Problem**: Even with T1 fixing the height, touch drag gestures can still trigger iOS Safari scroll/bounce, rubber-banding, or pull-to-refresh. This breaks drag-to-aim completely.
- **Fix**: Add `overflow: hidden` to `html`/`body` when on game screen. Add `touch-action: none` to the outer game container (not just the rink). Use `e.preventDefault()` on `touchstart`/`touchmove` at the document level during gameplay. Restore on exit.
- **Acceptance**: No page scroll, rubber-banding, pull-to-refresh, or accidental navigation during gameplay on iOS Safari and Chrome Android.
- **Depends on**: T1

### T4: Fix touch coordinate scaling after responsive resize
- **Priority**: P0
- **Problem**: `scaleCoord()` maps pointer position using `RINK_W / rect.width`. After T1, the rink dimensions are dynamic, so the scaling factor in `scaleCoord` must use the actual current rink dimensions, not the old constants.
- **Fix**: `scaleCoord` should use the dynamic rink size (from state or ref) rather than the constants `RINK_W`/`RINK_H`. The pointer-to-physics coordinate mapping must match whatever the current rink dimensions are.
- **Acceptance**: Drag-to-aim works accurately on all screen sizes. Stone follows finger precisely.
- **Depends on**: T1, T2

---

## High Priority (UX/Polish — Ship-Blocking)

### T5: Prevent body scroll bounce on iOS Safari
- **Priority**: P1
- **Problem**: iOS Safari has elastic overscroll on `<html>`. Even `overflow:hidden` on body doesn't fully prevent it. The address bar also resizes dynamically.
- **Fix**: Use `100dvh` for the game container (not `100vh`), and add `position: fixed; inset: 0` to the game screen wrapper to prevent all scroll. Test with iOS Safari's dynamic toolbar.
- **Acceptance**: No elastic bounce or address bar shift during gameplay.
- **Depends on**: T1, T3

### T6: Increase touch target for stone grab
- **Priority**: P1
- **Problem**: The grab detection radius is `55px` in rink-coordinate space. After responsive scaling, the actual touch target on a small phone could be as small as ~45px CSS pixels — below the recommended 48px minimum. Also, users instinctively tap the stone emoji, not the surrounding area.
- **Fix**: Scale the grab detection radius proportionally with rink size. Consider a larger invisible hit area (80-100 rink-px). Add a visible pulsing "grab here" affordance ring that's bigger than the stone.
- **Acceptance**: Easy to grab on first attempt on small phones (360px wide). No frustration.
- **Depends on**: T2

### T7: Replace `alert()` with toast notification for share
- **Priority**: P1
- **Problem**: "Copy & Share on LinkedIn" button uses `alert("Copied! Share on LinkedIn")` which looks amateur and blocks the thread.
- **Fix**: Add a simple toast/snackbar component that slides in from bottom for 2-3s. Style it to match the game's dark theme.
- **Acceptance**: Smooth, non-blocking feedback. No native browser alert dialogs anywhere in the app.
- **Depends on**: Nothing

### T8: Use Web Share API on mobile, LinkedIn deep link on desktop
- **Priority**: P1
- **Problem**: Clipboard copy is the only share option. Mobile users expect the native share sheet. Desktop LinkedIn users want a direct LinkedIn post.
- **Fix**: On mobile, use `navigator.share()` with the share text + URL. Fallback to clipboard if share API unavailable. On desktop, open LinkedIn share URL in new tab: `https://www.linkedin.com/sharing/share-offsite/?url=...`. Keep clipboard copy as secondary option.
- **Acceptance**: Mobile: native share sheet appears. Desktop: LinkedIn compose opens in new tab. Clipboard fallback works everywhere.
- **Depends on**: T7

### T9: Fix share URL to use curling.brandedai.net
- **Priority**: P1
- **Problem**: Share text links to `https://www.brandedai.net` instead of `https://curling.brandedai.net/`.
- **Fix**: Update `shareText` URL to `https://curling.brandedai.net/`.
- **Acceptance**: Shared links go directly to the game, not the main website.
- **Depends on**: Nothing

### T10: Skip tutorial for returning players
- **Priority**: P1
- **Problem**: Every session shows the 3-step tutorial, even for repeat visitors. Annoying on replay.
- **Fix**: Store `tutorialSeen` in `localStorage`. On first visit, show tutorial. On return visits, skip directly to gameplay. Add a small "?" help button on the game screen to re-show tutorial if needed.
- **Acceptance**: Tutorial shows only on first visit. "?" icon available during gameplay to relaunch it.
- **Depends on**: Nothing

---

## Medium Priority (Polish & Engagement)

### T11: Add sound effects
- **Priority**: P2
- **Problem**: Game feels flat. No audio feedback for throw, slide, collision, sweep, or score.
- **Fix**: Add short Web Audio API sounds (no audio files needed — generate with oscillator): stone release "whoosh", sweep "brush" sound, collision "clack", score reveal "ding/fanfare". Include a mute/unmute toggle. Default to muted (autoplay policies).
- **Acceptance**: Each interaction has distinct audio. Mute toggle visible and persistent. No autoplay issues.
- **Depends on**: Nothing

### T12: Add haptic feedback on mobile
- **Priority**: P2
- **Problem**: No tactile feedback when sweeping, colliding, or scoring.
- **Fix**: Use `navigator.vibrate()` — short pulse (10ms) on sweep tap, medium pulse (30ms) on collision, long pulse (50ms) on score reveal. Wrap in try/catch for unsupported devices.
- **Acceptance**: Haptic feedback on supported Android devices. Silent no-op on iOS (vibrate not supported on iOS Safari). No errors.
- **Depends on**: Nothing

### T13: Persist high score in localStorage
- **Priority**: P2
- **Problem**: No persistence — users can't track improvement or compete with themselves.
- **Fix**: Save best score and grade to `localStorage`. Show "BEST: X" on title screen and results screen. Highlight "NEW HIGH SCORE!" when beaten.
- **Acceptance**: High score survives page reload. Displayed on title and results screens.
- **Depends on**: Nothing

### T14: Add score popup that shows stone position on rink
- **Priority**: P2
- **Problem**: After each stone, a large popup covers the entire rink. Users can't see where their stone landed relative to the target or other stones.
- **Fix**: Make the score popup smaller and position it to the side or top of the rink. Or make the rink visible behind a semi-transparent overlay with the stone position highlighted. Show a mini-map or reduce popup size.
- **Acceptance**: User can see stone's final position and other landed stones while viewing their score.
- **Depends on**: T1

### T15: Deduplicate CSS and move to stylesheet
- **Priority**: P2
- **Problem**: The `CSS` string with `@import` + keyframes is rendered inside `<style>` tags on every screen. The font `@import` is redundant (already in `index.html`). CSS is duplicated across screen renders.
- **Fix**: Move all keyframe animations to a `styles.css` file imported by `main.jsx`. Remove the `@import url(fonts)` from the JS string (it's already in HTML). Remove `<style>{CSS}</style>` from each screen.
- **Acceptance**: Single CSS file. No `@import` in JS. No duplicate style tags. Same visual result.
- **Depends on**: Nothing

### T16: Optimise animation loop — reduce React re-renders
- **Priority**: P2
- **Problem**: `setStonePos()`, `setTrail()`, `setSweepMarks()` are called every `requestAnimationFrame` (~60fps), causing full React re-renders 60x/sec. On low-end mobile this will stutter.
- **Fix**: Use refs for stone position and trail during animation. Update the DOM directly for the stone element (via ref) during the physics loop. Only call `setState` when animation ends. Or switch the rink to a `<canvas>` element for the game screen.
- **Acceptance**: Smooth 60fps animation on mid-range Android phones. No jank on iPhone SE.
- **Depends on**: T1, T2

---

## Low Priority (Nice-to-Have / Marketing)

### T17: Add analytics
- **Priority**: P3
- **Problem**: No tracking — can't tell if people play, complete, share, or click CTA.
- **Fix**: Add simple analytics events (can use a lightweight solution like Plausible or Vercel Analytics): `game_start`, `tutorial_complete`, `stone_thrown` (with score), `game_complete` (with total score + grade), `share_clicked`, `cta_clicked`.
- **Acceptance**: Key funnel events tracked. Dashboard shows conversion from play to CTA click.
- **Depends on**: Nothing

### T18: Point "Book a Discovery Call" CTA to booking page
- **Priority**: P3
- **Problem**: CTA links to `brandedai.net` homepage — not a booking page. Users have to navigate further to actually book.
- **Fix**: Link to a Calendly or direct booking URL if available. If not, at minimum append an anchor or query param so the landing page can show the booking form directly.
- **Acceptance**: One click from results screen to actual booking action.
- **Depends on**: Nothing (needs booking URL from Scott)

### T19: Widen rink on desktop
- **Priority**: P3
- **Problem**: On 1280px+ screens, the 370px rink looks comically narrow. Wastes 70% of screen width.
- **Fix**: Scale rink width up on desktop (e.g. max 500-600px) while maintaining proportions. Or add side panels showing stone info, leaderboard, BrandedAI branding.
- **Acceptance**: Game feels appropriately sized on desktop without looking stretched or distorted.
- **Depends on**: T1, T2

### T20: Add proper favicon and PWA manifest
- **Priority**: P3
- **Problem**: Favicon is an inline SVG emoji. No PWA manifest. Can't install to home screen.
- **Fix**: Generate proper favicon files (16, 32, 180, 192, 512px). Add `manifest.json` with theme color and icons. Add `<link rel="apple-touch-icon">`.
- **Acceptance**: Proper icon in browser tab and when saved to home screen.
- **Depends on**: Nothing

### T21: Add keyboard controls for desktop
- **Priority**: P3
- **Problem**: Desktop users can only use mouse drag. Arrow keys or WASD would feel more natural for some.
- **Fix**: Add keyboard aim (arrow keys to set direction), spacebar hold-to-charge-power, release to throw, spacebar tap to sweep.
- **Acceptance**: Full game playable with keyboard only. No conflict with mouse controls.
- **Depends on**: T2

---

## Dependency Graph

```
T1 (responsive rink)
├── T2 (scale physics) ──┬── T4 (fix touch coords)
│                        ├── T6 (bigger touch targets)
│                        ├── T16 (perf optimisation)
│                        ├── T19 (desktop widen)
│                        └── T21 (keyboard controls)
├── T3 (lock scroll) ──── T5 (iOS bounce fix)
└── T14 (score popup)

Independent (can be done in parallel, any time):
T7 (toast) ──── T8 (web share API)
T9 (share URL fix)
T10 (skip tutorial)
T11 (sounds)
T12 (haptics)
T13 (high score)
T15 (CSS cleanup)
T17 (analytics)
T18 (CTA link)
T20 (favicon/PWA)
```

## Execution Order (Recommended)

**Wave 1 — Make it playable on mobile** (T1 + T2 + T3 + T4 + T5 + T6):
These are all interrelated. T1 is the foundation. T2-T6 follow immediately.

**Wave 2 — Quick wins in parallel** (T7 + T9 + T10 + T15):
Small, independent fixes that improve polish fast.

**Wave 3 — Engagement** (T8 + T11 + T12 + T13 + T14):
Features that make people share and come back.

**Wave 4 — Marketing/Desktop** (T16 + T17 + T18 + T19 + T20 + T21):
Optimisation and platform-specific improvements.
