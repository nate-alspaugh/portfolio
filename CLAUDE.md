# Repo conventions

## Design system

This repo uses a `DESIGN.md` file at the root, following the [Stitch DESIGN.md spec](https://github.com/google-labs-code/design.md). It documents the design language ("Naterade") — colors, typography, spacing, components, and the rules behind them.

Read `DESIGN.md` before any UI or styling work. Look up tokens there instead of guessing values from the CSS. When a task legitimately needs a new token (color, radius, font size, component spec), update `DESIGN.md` in the same change — don't smuggle magic numbers into `style.css`.

If `DESIGN.md` and the actual code disagree, treat `DESIGN.md` as authoritative and flag the drift.
