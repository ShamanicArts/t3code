---
name: shuv2code
description: The local-first control plane for coding agents.
colors:
  brick-dark: "#d35c46"
  brick-light: "#b64e36"
  midnight-canvas: "#0c1119"
  midnight-pane: "#0f1621"
  midnight-surface: "#161d28"
  midnight-elevated: "#1f2835"
  cool-white: "#e7ecf3"
  slate-muted: "#8995a6"
  paper-canvas: "#faf8f5"
  paper-pane: "#f1eee9"
  paper-raised: "#ffffff"
  warm-ink: "#1c1a17"
  warm-muted: "#76726a"
  warm-selected: "#dbd7cd"
  danger-dark: "#e5484d"
typography:
  title:
    fontFamily: "DM Sans Variable, DM Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "DM Sans Variable, DM Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "DM Sans Variable, DM Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.25
  mono:
    fontFamily: "SF Mono, JetBrains Mono, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  control: "8px"
  surface: "10px"
  card: "18px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary-dark:
    backgroundColor: "{colors.brick-dark}"
    textColor: "{colors.midnight-canvas}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "6px 12px"
    height: "32px"
  button-primary-light:
    backgroundColor: "{colors.brick-light}"
    textColor: "{colors.paper-raised}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "6px 12px"
    height: "32px"
  input-dark:
    backgroundColor: "{colors.midnight-elevated}"
    textColor: "{colors.cool-white}"
    typography: "{typography.body}"
    rounded: "{rounded.surface}"
    padding: "6px 12px"
    height: "30px"
  nav-row-active-dark:
    backgroundColor: "{colors.midnight-elevated}"
    textColor: "{colors.cool-white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "8px 10px"
---

# Design System: shuv2code

## Overview

**Creative North Star: "Midnight Brick Control Room"**

shuv2code is a compact operator workspace used while code, agents, terminals, and previews are all in motion. Its visual system combines quiet midnight navy or warm paper working surfaces with a small amount of brick red for identity, focus, selection, links, and primary action. The devil-terminal mark adds personality; the application chrome remains disciplined and task-first.

The system rejects generic AI dashboard spectacle, SaaS landing-page patterns inside the product, upstream identity leakage, decorative devil imagery, and hidden capability. Familiar controls and stable placement build trust faster than explanatory copy or invented interaction patterns.

**Key Characteristics:**

- Dense but calm product surfaces
- Warm brick accent below roughly ten percent of the working area
- Tonal depth with restrained borders and shadows
- Familiar navigation and controls with complete keyboard and touch behavior
- DM Sans for product UI and JetBrains Mono for code-shaped content

## Colors

Midnight Brick pairs cool navy working surfaces with a warm, scarce interaction accent; light mode translates that hierarchy into paper, warm gray, and ink.

### Primary

- **Production Brick** (`brick-dark`, `brick-light`): identity, primary action, selected emphasis, links, and focus. Use the theme-correct brick token, never both at once.

### Neutral

- **Midnight Canvas, Pane, Surface, Elevated**: the four-step dark hierarchy for app chrome, navigation, muted regions, and raised controls.
- **Cool White and Slate Muted**: dark-mode foreground and supporting text.
- **Paper Canvas, Pane, Raised, Selected**: the warm light-mode hierarchy.
- **Warm Ink and Warm Muted**: light-mode foreground and WCAG AA supporting text.

**The Ten Percent Rule.** Brick stays below roughly ten percent of a working surface. Its rarity makes selection and action legible.

**The Semantic Color Rule.** Warning amber, danger red, success green, and information blue are reserved for genuine status. They never decorate inactive UI.

## Typography

**Display Font:** DM Sans Variable (DM Sans and system UI fallback)  
**Body Font:** DM Sans Variable (DM Sans and system UI fallback)  
**Label/Mono Font:** SF Mono or JetBrains Mono (Consolas and monospace fallback)

**Character:** DM Sans keeps dense product chrome human and unobtrusive. The mono stack appears only where code, paths, identifiers, commands, schedules, or terminal semantics benefit from fixed-width rhythm.

### Hierarchy

- **Title** (600, 16px, 1.25): page and compact panel titles.
- **Body** (400, 14px, 1.45): settings, messages, and supporting prose; cap prose at 65 to 75 characters.
- **Label** (500, 13px, 1.25): controls, navigation rows, metadata, and dense toolbars.
- **Mono** (400, 13px, 1.45): code-shaped values and terminal-adjacent data.

**The One Sans Rule.** Do not introduce display typography into product UI. Hierarchy comes from weight, size, spacing, and placement.

## Elevation

Depth is primarily tonal: adjacent navy or paper layers, restrained borders, and inset highlights separate regions. Small shadows are allowed on raised controls, cards, popovers, and floating surfaces; they must never become a decorative haze. Grain may unify large chrome surfaces, but it is not a substitute for hierarchy.

**The Tonal First Rule.** Choose the correct adjacent surface token before adding shadow. If the surface only works with a large shadow, its hierarchy is wrong.

## Components

### Buttons

- **Shape:** compact gently curved controls (`8px`) with a visible border and medium label weight.
- **Primary:** theme-correct brick with the corresponding high-contrast foreground, normally `32px` tall on desktop.
- **Hover / Focus:** a subtle tonal shift; keyboard focus uses the brick ring with offset. Coarse pointers receive at least a `44px` effective target.
- **Secondary / Ghost:** secondary fills mark durable state; ghost buttons keep inactive toolbar actions quiet.

### Chips

- **Style:** compact (`4px`) rounded badges with semantic tint only when the value is a real status.
- **State:** selected chips may use primary or secondary fill; inactive chips remain neutral.

### Cards / Containers

- **Corner Style:** rounded cards (`18px`) for genuinely grouped, independently actionable content.
- **Background:** raised theme surface with a low-contrast border.
- **Shadow Strategy:** tiny structural shadow or inset highlight only.
- **Internal Padding:** `16px` to `24px`, varied by information density.

### Inputs / Fields

- **Style:** compact tonal field, `10px` radius, one-pixel border, and `30px` desktop height.
- **Focus:** brick border plus a restrained three-pixel translucent ring.
- **Error / Disabled:** error uses the danger semantic token; disabled controls preserve legibility and reduce opacity without losing their label.

### Navigation

- Settings and workspace navigation use familiar sidebar rows with icon, label, hover, active, and selected states drawn from one shared token family.
- Every shipped top-level capability must appear in its expected navigation or toolbar location. A direct route alone is not discoverability.
- Mobile navigation uses the same ordering and vocabulary in an off-canvas sheet with safe-area padding.

### Composer Actions

- Primary thread actions sit together at the right edge of the composer footer.
- Optional controls remain icon-forward with accessible names and match the compact state of adjacent send and stop controls.
- Controls that start persistent session state, such as voice, stay visible whenever prerequisites are satisfied and expose active state through pressed styling and the global session tray.

## Do's and Don'ts

### Do:

- **Do** preserve the existing information architecture, density, spacing, and control alignment when restoring a lost capability.
- **Do** use brick only for identity, focus, selection, links, and primary action.
- **Do** keep primary controls keyboard-operable, visibly focused, responsively reachable, and at least `44px` effective size for coarse pointers.
- **Do** use existing sidebar, button, input, badge, and composer patterns before creating a new affordance.
- **Do** respect reduced-motion preferences and use motion only to communicate state.

### Don't:

- **Don't** use generic AI dashboard spectacle: oversized gradients, glowing empty space, or decorative agent metaphors that compete with the work.
- **Don't** use SaaS landing-page patterns inside the product: hero metrics, promotional cards, or explanatory copy that narrates obvious controls.
- **Don't** allow upstream identity leakage: T3 Code names, assets, routes, or language must not appear as shuv2code product identity.
- **Don't** add decorative devil imagery: faces, flames, pitchforks, badges, or oversized horns and tails are prohibited.
- **Don't** ship hidden capability: direct routes, orphaned components, and undiscoverable gestures are not acceptable entry points.
- **Don't** use thick side-stripe accents, gradient text, decorative glassmorphism, or nested cards.
