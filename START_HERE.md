# Camerae Design System Foundation — first delivery

This package includes **exactly the 105 local Figma variable values** retrieved from the Camerae design file (4 collections, including all 3 Workflow Theme modes). No colors were invented for this export.

## Your steps (feature/design-system-foundation)

1. Extract this ZIP **at the root** of `~/works/camerae-app`, preserving directories.
2. Run `node scripts/design-tokens/build.mjs --check` — output should confirm that the generated TypeScript matches the snapshot.
3. Run `node --test scripts/design-tokens/build.test.mjs` — 5 tests should pass.
4. Run `npx tsc --noEmit && npm run lint && npm test -- --watch=false`.
5. Review `docs/DESIGN_TOKENS.md` and the diff. Do **not** merge yet; next we will audit the typography and define the first Figma↔React Native Atomic component contract.

The exporter plugin under `tools/figma-token-exporter/` is **optional in this first step**. It enables future repeated export from Figma without writing the values by hand. It exports JSON; automatic processing and review happen in Node and CI.

No changes were made directly to your GitHub repository or Figma document.
