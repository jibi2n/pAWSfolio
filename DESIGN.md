# DESIGN.md: AWS Builders - UST

Design guide for **builds.log**, the member showcase for AWS Builders - UST. Use this as the source of truth for every screen and component.

## 1. Brand

- **Name:** AWS Builders - UST
- **Tagline:** BUILD • SHARE • GROW TOGETHER (all caps, wide letter spacing)
- **Headline line:** "What's in the Clouds?"
- **About line:** We're a student-led cloud & AI community at the University of Santo Tomas, part of a global network of builders across the Philippines and beyond.
- **Sign-off line:** "More than ideas. A brighter tomorrow."
- **Feel:** dreamy, friendly, modern. Soft purple skies, rounded shapes, lots of clouds. Clean layouts with playful touches, never cluttered.

## 2. Design principles

1. **Dreamy & Approachable** - soft gradients, clouds, rounded corners, friendly copy.
2. **Modern & Minimal** - clean spacing, few colors per screen, no heavy borders.
3. **Community Focused** - people and their work come first. Show avatars, names, and builds.
4. **Creative & Inspiring** - one playful accent per screen (handwritten line, mascot, cloud shape).
5. **Future-Oriented & Growth** - forward-looking copy, clear calls to action.

## 3. Color

| Token | Hex | Role |
|---|---|---|
| `primary` | `#2E1A5F` | Deep purple. Hero backgrounds, secondary buttons, dark cards, headings on light |
| `secondary` | `#7C3AED` | Vibrant purple. Links, active states, logo tile, focus rings |
| `accent` | `#C084FC` | Lavender. Cloud shapes, highlights, decorative glows |
| `background` | `#E9D5FF` | Light purple. Tags, tertiary buttons, soft section fills |
| `highlight` | `#4ADEB8` | Mint green. Primary buttons, active nav pill, success states |
| `text` | `#0F172A` | Dark text on light surfaces |
| `text-secondary` | `#94A3B8` | Muted text, captions, placeholders, meta info |
| `surface` | `#F8FAFC` | Light page and card surface |
| `white` | `#FFFFFF` | Cards, inputs, text on dark purple |

**Usage rules**

- Light screens: `surface` page, `white` cards, `text` for body, `primary` for headings.
- Dark sections (hero, info cards, footer): `primary` background, `white` text, `highlight` for labels and CTAs.
- Mint green (`highlight`) is for the main action only. One primary button per view.
- Text on mint green is always `text` (#0F172A), never white.
- `text-secondary` is for small meta text only. Do not use it for body copy on light purple (low contrast).

**Gradients**

- Hero / background: `#2E1A5F` to `#7C3AED`, with `#C084FC` cloud layers on top.
- Cloud shapes: `#C084FC` to `#E9D5FF`, soft edges.

## 4. Typography

**Main font:** Poppins (modern, friendly, clean).

| Style | Font | Weight | Size | Line height | Example |
|---|---|---|---|---|---|
| H1 | Poppins | Bold 700 | 64px | 1.1 | What's in the Clouds? |
| H2 | Poppins | SemiBold 600 | 32px | 1.25 | Explore opportunities |
| H3 | Poppins | Medium 500 | 20px | 1.35 | Build. Share. Grow. |
| Body | Poppins | Regular 400 | 16px | 1.6 | We're a student-led community... |
| Small | Poppins | Regular 400 | 14px | 1.5 | Applications close in 60 days |
| Eyebrow | Poppins | SemiBold 600 | 12px | 1.2 | BRAND IDENTITY (caps, letter spacing 0.15em) |

**Supporting fonts**

- **Monospace** (buttons, tags, info card labels): JetBrains Mono or Space Mono, Regular 400 / Medium 500, 13-15px. Gives a builder / code feel.
- **Handwritten accent** (hero line and sign-off only): a rounded handwritten font such as Gochi Hand or Caveat Brush. Use once per screen at most, never for body text.

**Mobile scale:** H1 40px, H2 26px, H3 18px, Body 16px, Small 14px.

## 5. Layout, spacing, and shape

- **Grid:** 12 columns, max content width 1200px, 24px gutters, 80px side margins on desktop. 4 columns with 20px margins on mobile.
- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64, 96. Sections use 64-96px vertical padding.
- **Corner radius:**
  - Small (inputs, tags): 10-12px
  - Medium (buttons, cards): 14-16px
  - Large (hero panels, big cards, logo tile): 24-28px
  - Pill (nav, eyebrow labels): 999px
- **Shadows:** soft and purple-tinted. Cards: `0 8px 24px rgba(46,26,95,0.10)`. Primary buttons: `0 6px 20px rgba(74,222,184,0.35)`.
- **Borders:** mostly none. When needed, 1px `#E9D5FF`.

## 6. Components

### Buttons

All buttons: monospace label 14-15px, radius 14px, height 48px, padding 0 28px.

| Variant | Fill | Text | Use |
|---|---|---|---|
| Primary | `#4ADEB8` | `#0F172A` | Main action ("Apply now", "Post a build") |
| Secondary | `#2E1A5F` | `#FFFFFF` | Second action ("Explore careers", "Edit") |
| Tertiary | `#E9D5FF` | `#2E1A5F` | Low-priority ("Know more about us!", "Cancel") |
| Danger | `#FFFFFF` with 1px `#F43F5E` border | `#E11D48` | Delete actions only |

States: hover lifts 2px and deepens shadow. Pressed scales to 0.98. Disabled at 40% opacity. Focus shows a 2px `#7C3AED` ring with 2px offset.

### Navigation

- White pill bar, radius 999px, soft shadow, padding 4px.
- Items: Poppins Regular 14px, `text` color.
- Active item: mint green (`#4ADEB8`) pill with `text` color and Medium weight.
- Items: Home, About, Events, People, Careers, Contact (for builds.log: Feed, Post a build, My builds).

### Search field

- White fill, radius 12px, height 44px, 1px `#E9D5FF` border.
- Search icon on the left in `text-secondary`.
- Placeholder "Search..." in `text-secondary`.

### Tags / labels

- `#E9D5FF` fill, `#7C3AED` text, monospace 13px, radius 10px, padding 6px 12px.
- Written as hashtags: #Cloud, #AI, #Community, #UST, #S3, #Lambda.

### Info card

- `#2E1A5F` fill, radius 16px, padding 20px.
- Title in mint green monospace caps ("APPLICATIONS CLOSE IN 60 DAYS").
- Body in white Poppins 14px.
- Small primary button on the right.

### Content card (builds.log post card)

- White fill, radius 20px, card shadow, overflow hidden.
- Top: image or GIF, 16:10 ratio, rounded top corners.
- Body padding 20px: status tag, title (H3), 2-line description (Body, `text-secondary` allowed only at 14px+), tags row.
- Footer: avatar (32px circle) + @handle + time ago on the left. Comment count and bump button on the right.
- Bump button: pill, `#E9D5FF` fill and `#2E1A5F` text by default. Mint green fill when bumped.

### Comment

- White or `surface` fill, radius 14px, padding 16px.
- Avatar, @handle (Medium), time ago (Small, muted), comment text (Body).
- "Builder" tag next to the post owner's name in mint green.
- Delete action as a small text button, only shown to the commenter or post owner.

### Forms

- Labels: Poppins Medium 14px, `text`.
- Inputs: white fill, 1px `#E9D5FF` border, radius 12px, height 48px. Focus border `#7C3AED`.
- Textarea: same style, min height 140px.
- Required mark: `#7C3AED` asterisk.
- Error: `#E11D48` text 14px under the field, input border turns `#F43F5E`.
- Image upload: dashed 2px `#C084FC` border, radius 16px, `#F8FAFC` fill, cloud upload icon, "Drop an image or GIF, or browse".

### Status badges

| Status | Fill | Text |
|---|---|---|
| Live | `#4ADEB8` at 20% | `#0F766E` |
| In progress | `#E9D5FF` | `#7C3AED` |
| Archived | `#F1F5F9` | `#64748B` |

## 7. Icons

- Outline style, rounded caps and joins, 2px stroke, 24px grid (like Lucide).
- Color: `primary` on light, `white` on dark.
- Set: Home, People, Events (calendar), Careers (briefcase), Contact (mail), Search, Cloud / AWS, Apply (paper plane), Link, Scroll (chevron down).
- Label under icon: Poppins Regular 13px.

## 8. Logo

- **Mark:** white cloud with a "• ― •" face line inside, on a `#7C3AED` rounded square tile (radius about 24% of tile size), soft purple shadow.
- **Lockup:** mark on the left, "AWS Builders - UST" in Poppins Bold, tagline below in small caps with wide spacing.
- **Variations:**
  - Icon (Primary): purple tile with white cloud
  - Monochrome (Dark): solid `#0F172A` cloud
  - Outline (Light): `#2E1A5F` outlined cloud on white
- Keep clear space around the logo equal to the height of the cloud's face line gap. Never stretch or recolor outside these variations.

## 9. Visual elements

- **Cloud illustration (mascot):** puffy white cloud with the logo face, soft purple glow. Use on empty states, 404, success screens.
- **Cloud shapes:** lavender to light purple puffy clouds as background decoration, bottom of hero sections, edges of pages.
- **Grain texture:** subtle purple noise overlay (5-10% opacity) on gradient areas only.

## 10. Background style

Layered clouds with gradients and subtle grain for a dreamy, cloud-like feel.

- Hero bands: `#2E1A5F` to `#7C3AED` gradient, 2-3 layers of cloud shapes along the bottom edge, grain on top.
- Content areas stay light (`#F8FAFC`) so posts and text are easy to read.
- Soft cloud shapes can peek in from corners of light sections at low opacity.

## 11. Voice and copy

- Short, warm, and encouraging. Talk like a friendly org member.
- Use "we" and "you". Avoid jargon in headings.
- Empty feed: "No builds yet. Be the first to share what you made."
- After posting: "Your build is live! ☁"
- Delete confirm: "Delete this build and its comments? This can't be undone."

## 12. Screens for builds.log

1. **Feed (desktop 1440 and mobile 390):** dark purple hero with cloud layers, H1 "What's in the Clouds?" in the handwritten accent, short intro, primary button "Post a build". Below: search field, service tags as filters, 3-column grid of post cards (1 column on mobile), pagination.
2. **Single build:** large image or GIF, title (H2), author row, status badge, link card (GitHub or live site), tags, description, bump button. Owner sees Edit (secondary) and Delete (danger). Comments section with add-comment box and comment list below.
3. **Create / Edit build form:** title, link (optional), image or GIF upload, description, AWS service tags (toggle), status (Live / In progress / Archived). Primary "Publish build" and tertiary "Cancel".
4. **Empty and success states:** cloud mascot, short friendly line, one button.
5. **Delete confirmation modal:** white card, radius 20px, danger button plus tertiary cancel.

## 13. Accessibility

- Body text contrast at least 4.5:1. Dark text on mint and white on deep purple both pass.
- Touch targets at least 44x44px.
- Visible focus ring on every interactive element.
- Icon-only buttons need a text label for screen readers.
- Do not rely on color alone for status. Always show the status word.
