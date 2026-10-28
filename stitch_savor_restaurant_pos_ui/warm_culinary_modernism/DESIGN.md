---
name: Warm Culinary Modernism
colors:
  surface: '#f6fbf5'
  surface-dim: '#d7dbd6'
  surface-bright: '#f6fbf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f5f0'
  surface-container: '#ebefea'
  surface-container-high: '#e5e9e4'
  surface-container-highest: '#dfe4df'
  on-surface: '#181d1a'
  on-surface-variant: '#594139'
  inverse-surface: '#2c322e'
  inverse-on-surface: '#edf2ed'
  outline: '#8d7168'
  outline-variant: '#e1bfb5'
  surface-tint: '#ab3600'
  primary: '#a73400'
  on-primary: '#ffffff'
  primary-container: '#cb4914'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59c'
  secondary: '#5b5f5c'
  on-secondary: '#ffffff'
  secondary-container: '#dde0dc'
  on-secondary-container: '#606460'
  tertiary: '#a83206'
  on-tertiary: '#ffffff'
  tertiary-container: '#ca4a20'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#822700'
  secondary-fixed: '#e0e3df'
  secondary-fixed-dim: '#c4c7c3'
  on-secondary-fixed: '#191c1a'
  on-secondary-fixed-variant: '#444844'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59f'
  on-tertiary-fixed: '#3a0a00'
  on-tertiary-fixed-variant: '#852300'
  background: '#f6fbf5'
  on-background: '#181d1a'
  surface-variant: '#dfe4df'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.625rem
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  currency-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 1.75rem
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system reflects a refined, calm, and high-efficiency hospitality environment. Tailored for fast-paced floor operations and calm back-of-house management, the visual voice merges ergonomic utility with boutique warmth. 

The aesthetic is Modern Tactile Minimalism: functional layouts stripped of decorative clutter, paired with soft organic tones, warm paper-like surfaces, and gentle physical affordances. The interface minimizes eye fatigue during long shifts, communicates order states instantly through warm chromatic cues, and elevates transactional hospitality software into a premium culinary tool.

## Colors
The palette uses high-contrast warm neutrals and measured orange accents to direct attention without overwhelming the operator.

- **Background Canvas (`#FDFBF7`)**: Warm porcelain white, reducing glare compared to pure white displays.
- **Surface Tier 1 (`#F7F4EE`)**: Primary card, panel, and ticket background.
- **Surface Tier 2 (`#EFECE6`)**: Secondary containers, input wells, inactive tab rails, and table cell backgrounds.
- **Primary Accent (`#D9531E`)**: Action trigger for key ordering flows, active status indicators, and primary checkout buttons.
- **Secondary Accent (`#FF7043`)**: Hover states, high-priority notifications, and secondary badges.
- **Deep Charcoal Typography (`#1F2421` / `#2D312E`)**: High legibility body and headline text.
- **Structural Borders (`#E6E2D8`)**: Low-contrast boundaries providing subtle visual separation without heavy lines.
- **Semantic Feedback**:
  - Success / Paid: `#2E6930`
  - Warning / Modifiers: `#B25E00`
  - Alert / Void: `#C5221F`

## Typography
Plus Jakarta Sans provides geometric clarity with approachable, humanist curves. 

- **Price Formatting**: All pricing figures must display tabular lining numbers (`font-variant-numeric: tabular-nums`) with the standard Indian Rupee symbol prefix (`₹`).
- **Hierarchy Rules**: Display headings are reserved for register summaries, sales analytics, and daily totals. In order lines, menu titles use `title-sm` with item modifiers styled in `body-sm` using muted charcoal (`#5A605B`).
- **POS Legibility**: Numeric values and order quantities prioritize bold weights (`600` and `700`) to guarantee legibility at arm's length on stationary terminal stands.

## Layout & Spacing
The layout relies on a dual-zone fluid split model designed for touchscreen restaurant terminals and management tablets.

- **Split Screen Hierarchy (POS Mode)**:
  - **Left / Center Zone (60-65% width)**: Fluid grid containing categorized menu catalogs and live floor plan tables. Items scale responsively across a 3 to 4 column layout on tablet/desktop.
  - **Right Zone (35-40% width)**: Fixed-width receipt ledger and persistent order ticket panel.
- **Breakpoints**:
  - `Mobile / Handheld POS (< 768px)`: Single column stacking with a collapsible bottom-sheet order drawer. Margins collapse to `margin: 1rem`.
  - `Tablet / Terminal (768px - 1199px)`: Split-screen interface with 12px item grid gutters and persistent 360px cart rail.
  - `Desktop Management (>= 1200px)`: Full 12-column layout with fixed navigation sidebar, fluid data grids, and `margin-desktop: 2rem`.
- **Rhythm**: All paddings adhere strictly to the 4px baseline (`space-xs` through `space-xl`). Touch targets demand a minimum footprint of 48px × 48px.

## Elevation & Depth
Depth is created using warm ambient drop shadows paired with soft boundary strokes rather than aggressive elevation tiers.

- **Surface Tier 0 (Canvas)**: `#FDFBF7`, flat.
- **Surface Tier 1 (Menu Cards & Tables)**: Background `#F7F4EE`, border `1px solid #E6E2D8`, shadow `0 1px 3px rgba(31, 36, 33, 0.04)`.
- **Surface Tier 2 (Order Summary & Modals)**: Background `#FFFFFF`, border `1px solid #E6E2D8`, shadow `0 4px 16px -2px rgba(31, 36, 33, 0.08)`.
- **Floating Overlays & Action Bars**: Shadow `0 12px 32px -4px rgba(31, 36, 33, 0.12)`.
- **Tactile Depress (Active State)**: When buttons or POS items are pressed, remove ambient shadow and apply `transform: scale(0.98)` with an inner inset border to mimic physical hardware keys.

## Shapes
A roundedness factor of `2` provides smooth, approachable contours suited for high-contact touch devices:

- Standard input fields, menu cards, and ticket line items: `rounded-base` (`0.5rem` / `8px`).
- Modal dialogs, primary ticket containers, and floor layout tables: `rounded-lg` (`1rem` / `16px`).
- Floor plan badges, status pills, and counter stepper ends: `rounded-full` (`9999px`).
- Structural containment maintains consistent corner radius pairing (nested elements inside cards use `rounded-base` against parent `rounded-lg`).

## Components

### Buttons
- **Primary (POS Charge / Confirm)**: Background `#D9531E`, text `#FFFFFF`, border none, height 48px minimum. Hover: `#FF7043`. Active: `#B83E12`.
- **Secondary (Modifiers / Split Bill)**: Background `#F7F4EE`, border `1px solid #E6E2D8`, text `#1F2421`. Active: `#EFECE6`.
- **Destructive (Void / Cancel)**: Background transparent, border `1px solid #C5221F`, text `#C5221F`. Active: `#FDE8E8`.

### Quantity Counters & Steppers
- Distinct tactile unit composed of three connected blocks: Minus (`-`), Numeric Value, Plus (`+`).
- Height 40px, rounded corners (`8px`), background `#EFECE6`, border `1px solid #E6E2D8`.
- Stepper buttons feature bold charcoal glyphs, instant touch feedback via background darken, and numeric display styled with `currency-display` sizing at `1rem`.

### Menu Item Cards
- Surface background `#F7F4EE`, border `1px solid #E6E2D8`, radius `16px`.
- Comprises item name (`title-sm`), brief description or dietary badges, and price in bottom-right (`currency-display`).
- Fast-tap feedback: momentary orange stroke flash (`#D9531E`) on item selection.

### Chips & Filter Tabs
- Category filters (e.g., Starters, Mains, Beverages, Desserts).
- Unselected: Background `#F7F4EE`, border `1px solid #E6E2D8`, text `#2D312E`.
- Selected: Background `#1F2421`, border `1px solid #1F2421`, text `#FFFFFF`.

### Inputs & Keypad Form Fields
- Surface background `#FFFFFF`, border `1px solid #E6E2D8`, radius `8px`, height 44px.
- Focus state: border `1.5px solid #D9531E`, soft orange glow ring (`box-shadow: 0 0 0 3px rgba(217, 83, 30, 0.15)`).

### Checkboxes & Radios
- Size 20px × 20px, radius `4px` (checkbox) or circular (radio), border `1.5px solid #E6E2D8`.
- Checked state: Fill `#D9531E` with crisp white checkmark or center pip.

### Table Map Markers
- Interactive table nodes indicating occupancy:
  - Vacant: Border `1.5px solid #E6E2D8`, background `#FDFBF7`, text `#1F2421`.
  - Occupied: Border `1.5px solid #D9531E`, background `#FDF6F0`, text `#D9531E`.
  - Bill Printed: Border `1.5px solid #2E6930`, background `#F0F7F1`, text `#2E6930`.