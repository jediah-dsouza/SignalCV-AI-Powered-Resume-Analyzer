# AI-Powered Resume Analyzer — Design Brief

## Direction decision

No explicit visual direction was selected in the Phase 1 brief. Three distinct directions were considered briefly:

1. **Career Signal** — calm editorial product UI with confident navy, warm paper surfaces, and lime signal accents. Probability: 0.06.
2. **Quiet Momentum** — soft neutral workspace with indigo actions, generous whitespace, and subtle progress cues. Probability: 0.05.
3. **Clear Evidence** — crisp technical interface with charcoal ink, cool blue structure, and restrained green outcomes. Probability: 0.04.

**Committed direction: Career Signal.** The product should feel intelligent, trustworthy, career-focused, calm, actionable, technically capable, and approachable without noisy AI clichés or dashboard clutter.

## Design movement

An editorial career-tool interface: information is organized like a well-edited report, while interaction cues feel like a focused workspace rather than an administration dashboard.

## Core principles

- Lead with clarity and the next useful action.
- Use strong hierarchy for upload, analysis, score, and improvement.
- Pair analytical structure with a human, encouraging tone.
- Keep surfaces light and readable; reserve accent color for action and progress.
- Make every state understandable without relying on color alone.

## Color philosophy

Use deep ink/navy for trust and primary text, warm off-white for the page background, white for working surfaces, muted blue-gray for supporting text, and a bright but controlled lime accent for progress and primary action. Use semantic success, warning, error, and info colors with accessible contrast.

## Layout paradigm

Mobile-first capped content containers with generous horizontal padding. Use a restrained two-column layout at desktop widths, but keep page skeletons simple in Phase 1. Navigation is compact and collapses into an accessible mobile menu.

## Signature elements

- A simple resume-sheet mark with a highlighted signal line as the brand symbol.
- Small uppercase labels for product context.
- Thin borders and restrained shadows instead of heavy cards or glass effects.
- Progress and status language that describes what is happening.

## Interaction philosophy

Interactions should feel immediate, legible, and reversible. Use visible focus rings, clear pressed/active states, and concise status feedback. Avoid decorative motion; transitions should communicate navigation, menu state, or status change.

## Animation

Use short ease-out transitions for menu and interactive controls. Respect `prefers-reduced-motion` by reducing transitions and disabling non-essential motion.

## Typography system

Use a high-contrast display serif for major headings paired with a clean sans-serif for navigation, labels, body copy, and controls. Keep reading measure comfortable and scale headings fluidly with `clamp()`.

## Brand essence

**Turn resume uncertainty into clear next steps.**

## Brand voice

Clear, encouraging, direct, and specific. Avoid hype, guaranteed outcomes, or intimidating AI language.

## Wordmark / logo

The wordmark is **SignalCV** for the visual shell, with the product title remaining AI-Powered Resume Analyzer in document metadata. The mark is a simplified resume page with one bold signal line, designed to remain recognizable at favicon size.

## Signature brand color

Signal Lime: `#C7F36B`, used sparingly for primary actions, progress, and meaningful positive emphasis against deep ink.
