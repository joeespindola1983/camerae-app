# Camerae — Figma design tokens

## Status

This is the first, one-way design-system synchronization. **Figma remains the design source of truth.** `design-tokens/figma.snapshot.json` is a reviewed, versioned snapshot of the actual Figma local variables. React Native consumes a deterministic, generated TypeScript representation of that snapshot. Changes in Figma **do not automatically push to GitHub**. Exporting and opening a PR remain deliberate actions.

- Figma: https://www.figma.com/design/c8gsnSu31erYFG3u3QMQgN/Camerae?node-id=15-3
- React Native app: Community CLI, no Expo.
- Captured collections (18 October 2026): `Primitives` (22), `Color` (42), `Dimensions` (24), `Workflow Theme` (17) = **105 variables**.
- Preserved workflow modes: `Repeatable`, `Astro`, `Editor`.
- Figma aliases are preserved in the JSON as `$alias` references, resolved only at TypeScript generation time.
- Eight-digit hex colors include alpha, e.g. `#FFFFFFB2`.
- The `Dimensions` entries are numeric Figma pixels, suitable for React Native dp design values when used in a scale-independent UI. `size/device-width` and `size/device-height` are **reference frames, not screen sizes**; use `useWindowDimensions()` for responsive layouts.

## Structure

```
design-tokens/figma.snapshot.json          # exported Figma source, code-reviewed
scripts/design-tokens/build.mjs          # alias validation & TS generation
scripts/design-tokens/build.test.mjs     # node:test, zero npm deps
src/design-system/tokens/generated.ts    # generated; do not edit
.github/workflows/design-tokens.yml      # PR validation
```

## First import

Copy these files to their corresponding paths at repository root. Run:

```sh
node scripts/design-tokens/build.mjs --check
node --test scripts/design-tokens/build.test.mjs
npx tsc --noEmit
npm run lint
```

If you need to regenerate output after a reviewed Figma export:

```sh
node scripts/design-tokens/build.mjs
node scripts/design-tokens/build.mjs --check
```

## Updating from Figma (manual approval, automated transformation)

1. Open the Camerae Figma file, not a duplicate; ensure you have access to its local variables.
2. In Figma Desktop, import the **local development plugin** at `tools/figma-token-exporter/manifest.json` from Plugins > Development > Import plugin from manifest. Some Figma installations may ask you to generate a local plugin ID in the manifest first. The plugin itself is an optional convenience, not required to build the app.
3. Run **Camerae Token Exporter**, select **Read Figma variables**, download `figma.snapshot.json` (or copy the JSON). Replace `design-tokens/figma.snapshot.json`.
4. Run the generator, tests and typecheck. Review diffs for colors, aliases, variable removals and theme modes.
5. Commit source snapshot **together with** the generated TS file in a feature PR. GitHub Actions blocks out-of-sync output.

### Limitations

- This is **not** automatic two-way Figma synchronization and does not track design edits until exported. We intentionally avoid Enterprise-only APIs and secrets in CI.
- Component variants, text styles, fonts, effects and auto-layout constraints are not Figma variables; they will be audited and mapped in a separate step. Do not infer typography from token names.
- New or renamed Figma collection names must be reviewed and reflected in `build.mjs`, which currently generates the four known Camerae collections.
- No arbitrary Figma-generated application code is committed; RN components remain authored and tested code.

## React Native usage

```ts
import {designTokens} from './tokens/generated';

const {color, dimensions, workflow} = designTokens;
const captureTheme = workflow.repeatable;
const canvas = color.bg.canvas;
const gap = dimensions.spacing.md; // 16
const touchTarget = dimensions.size.touch; // 44
```

Do not duplicate hex colors inside view components. Use semantic tokens and workflow modes; build semantic theme hooks and Atomic Design components in later features.

## Atomic Design boundaries

- **Foundations**: these tokens, typography/effects (next step).
- **Atoms**: text, buttons, touch targets, icons, surfaces.
- **Molecules**: opacity control, reference badge, camera setting row.
- **Organisms**: capture control bar, reference picker, preview overlay.
- **Templates/screens**: feature-owned capture screen, capture library.

Component definitions should ultimately map to Figma component or set IDs and approved variants, not screenshots. Legacy/discarded pages (notably `99 · Descarte · Não implementar`) are excluded from implementation.
