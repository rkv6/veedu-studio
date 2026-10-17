# Veedu Studio: Design

A concept site for a fictional interiors and homes-for-sale studio in Thiruvananthapuram. Mode: Persuade (the visitor decides to enquire). Everything on the page is invented content.

## Idea
The studio "rolls out the plans". A strip of film unrolls down the page and stops at each finished home, and the hero is drawn by hand in front of you. Playful copy, bold type, one live interaction (pull the tape).

## Colour
One ground, one ink, one accent. Surfaces step in tone, never with lines or shadows.

| Token | Value | Use |
|---|---|---|
| `--lime` | `#e8ece2` | Page ground (cool chalk green) |
| `--lime2` | `#d5dccb` | Header, footer, tinted sections, cards, form |
| `--ink` | `#14201b` | Text, film strip, headings |
| `--soft` | `#2f3d36` | Secondary text (still 7:1 or better) |
| `--laterite` (accent) | `#0f6b57` | Buttons, links, dates, prices, marquee band |
| `--laterite-d` | `#0b5444` | Accent hover |
| `--brass` | `#f0a81c` | Saffron: pull tab, step titles, sun |
| `--sage` | `#6f7d62` | Plants, lawns, quiet fills |
| `--night` | `#10261f` | Dark "Process" section |

Sketch wash colours: teal `#9fd0c0`, sun `#f6d58a`, clay `#e0a184`, sage `#bccaa6`, water `#8cc7c0`, stone `#c9cdc2`, wood `#d9b27c`, glass `#cfe6e0`, paper `#f6f7f1`. Roofs in the old house drawing keep terracotta `#a4452a`.

Rules: accent only on actions, dates, prices and the marquee. Running text in full ink. No gradients. No yellow-cream ground.

## Type
- **Display:** Archivo Variable, weight 900, `font-stretch: 112%`, uppercase, letter-spacing -0.01 to -0.015em, line-height about 1.
- **Body:** DM Sans Variable, 16px or larger, line-height 1.6.
- Scale: h1 `clamp(2.5rem, 4vw, 3.6rem)` (30px on mobile); h2 `clamp(1.9rem, 3.8vw, 3.1rem)` (27px on mobile); h3 1.4rem; price 1.9rem; project name `clamp(1.7rem, 2.9vw, 2.6rem)`; lead paragraph about 1.25rem.
- Every headline fits two lines at every width. Keep them short ("Drawn for how you live.", "Pull the tape.", "One team, sketch to switch.", "Tell us the dream.").
- No monospace, no eyebrows, no tiny uppercase labels. Nothing meant to be read is under 13px.

## Shape and space
- Buttons and chips: fully round (pill). Cards: 16–20px radius. The tall hero tile has one big 90px bottom-left curve.
- Page gutter: `max(clamp(1.25rem, 5vw, 4rem), (100% - 1320px) / 2 + that)`. Sections have 3 to 6.5rem of vertical padding.
- No box shadows on things at rest, no thin rules, no glass or blur. The project dialog is the only floating element and may have a shadow.
- Section composition changes each time: split hero, tape with alternating sides, solid band, card grid, two-column text with stacked boxes, four-up steps on dark, split enquiry.

## Components
- **Header:** sticky, flat `--lime2`, logo (bold "VEEDU" + small "STUDIO"), four links with a grow-from-left underline, round accent "Enquire" button. Links hide under 720px.
- **Buttons:** solid accent with lift of 2px on hover; ghost variant is an outline that fills on hover.
- **Chips and select:** pill, ink outline; pressed chip fills with ink.
- **Home card:** floor-plan tile on a darker tone, price, title, "place, type", description, facts, ghost button. Lifts 4px on hover.
- **Project item (on the tape):** name, month in accent, "place, scope, time", one-line note, underlined "See the whole story →".
- **Dialog:** native `<dialog>`, art on one side, facts grid, brief, three bullets, button. Hash route `#project-<id>`.
- **Form:** tone-step panel, 12px-radius inputs with a 1.5px outline (real form fields may have lines), inline error text.

## Imagery
- Hero: three self-drawing pen-and-marker house sketches (arched townhouse, isometric villa on stilts, cantilever house over a waterfall). Ink at 1.7px (1px for detail), flat colour washes, a slight displacement wobble for a hand feel. Original designs drawn in SVG.
- Floor plans: simple labelled rectangles in SVG.
- No photographs yet; real photos or a video loop are the next upgrade.

## Motion
One frame loop: Lenis on GSAP's ticker.
- **Intro (once per session):** word "VEEDU", a tape grows and sways, overlay slides up. About 2 seconds.
- **Hero:** headline words rise from a mask (115% down, 4° tilt, 0.07s stagger); sketches draw their ink then fade in washes.
- **Film strip:** sampled-polygon SVG strip with perforation dashes; head follows scroll with damping (`1 - exp(-dt * 6.5)`); sway and twist grow with scroll speed; spool shrinks from 76px to 30px radius and spins; project items reveal when the head passes them; pull tab labels "Pull me" then "Keep pulling" and is draggable.
- **Section entrances:** headings word-by-word; other parts rise 26px with fade, 0.08s stagger, once.
- **Marquee:** drifts, speeds up and flips direction with scroll velocity.
- Transform and opacity only. Easing mostly `expo.out`.
- **Reduced motion:** no intro, no smooth scroll, strip fully out and straight, sketches shown finished, everything visible.

## Responsive
- Under 960px: hero stacks (text then picture at 460px tall), steps go two-up, studio and enquiry go single column.
- Under 760px: tape sits at the left edge (64px from the left) with all projects in one column to its right, smaller type, smaller pull tab.
- Under 720px: nav links hide, form rows stack.

## Accessibility
Real headings (split-word headings carry the full text as `aria-label`), skip link, visible 3px focus ring, alt text on art, errors linked with `aria-describedby`, dialog closes on Esc.

## Do not
Eyebrow labels, index numbers (01/02), icon cards, hairline dividers, gradients, drop shadows at rest, glass, violet, cream and terracotta pairing, emoji, more than two typefaces.
