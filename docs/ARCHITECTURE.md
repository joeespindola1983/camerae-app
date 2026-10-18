# Camerae — Architecture decisions (initial)

Status: **provisional / incremental**  
Scope: Camerae rewrite, QA builds, first capture-and-repeat workflow

## Product contract for MVP

A user can capture an original photo, close and reopen the app, find that capture, select it as a reference, adjust overlay opacity over the live camera preview, and save a new photo that points to the reference capture.

The initial version requires no user account, backend, network connection, upload, or cloud synchronization. The app must not overwrite an existing original when creating a repeat.

## Architectural boundaries

Keep only boundaries that solve an actual problem; avoid pre-generating large numbers of empty folders.

```text
App.tsx                         # App composition / entry point (will evolve)
src/
  app/                          # Navigation and dependency composition (planned)
  features/
    capture/
      domain/
        Capture.ts              # Capture data shape; no RN imports
      application/
        SaveCapture.ts          # Use case; depends on interfaces
        __tests__/
          SaveCapture.test.ts   # Unit tests against fakes
      infrastructure/           # Camera / file / database adapters (when implemented)
    library/                    # Browse prior captures (future)
    repeat-capture/             # Overlay and linked retakes (future)
  shared/                       # Only when cross-feature reuse becomes real
```

**Dependency rule:** user interface → application use cases → domain contracts. Infrastructure implements contracts; the domain and use cases must not import camera or SQLite packages. Avoid a giant global services singleton.

## Local data strategy

| Kind | Intended home | Durability |
| --- | --- | --- |
| Original JPEG/HEIC photo | App-owned persistent file directory | Critical; never use cache as sole copy |
| Capture ID, local relative file location, timestamp, optional reference ID | SQLite | Critical |
| Temporary image from native camera | Camera temporary/cache path | Disposable after successful permanent copy |
| Thumbnail / derived preview | Re-creatable cache | Disposable |
| Live camera status, overlay opacity while editing, in-progress selection | React state | Temporary unless a future explicit requirement says otherwise |
| Capture preferences (if user wants them remembered) | Small persisted settings store, later | Persisted by product decision |

Use stable capture identifiers and app-relative paths in persistent records where practical. Absolute sandbox paths can change across reinstall/restore scenarios. Dates should be stored in an unambiguous format (e.g. UTC ISO 8601), with local timezone used only for display.

Data migration must preserve existing photos and associations once real persistence is introduced.

## Current use case: SaveCapture

`SaveCapture` receives an already captured temporary image URI, an ID, timestamp, and optional reference ID. It asks `PhotoStorage` to persist the image, inserts metadata through `CaptureRepository`, and returns the saved model.

Covered unit behavior:

- Image persistence occurs before metadata insertion.
- If metadata insertion fails, the use case attempts to delete the newly persisted image and rethrows the original database error.

**Known limitations / future tests:** This is a compensation strategy, not an atomic transaction between the filesystem and SQLite. A crash can occur between operations; a database error may occur after a successful commit but before acknowledgment; cleanup may itself fail. Do not assume retrying is always safe. Before shipping, add deterministic filenames/operation IDs, reconciliation of orphaned or missing files, and recovery tests. Never delete the source temporary photo until safe ownership transfer is confirmed.

No native camera, filesystem, or database implementation is implied by passing mocked unit tests.

## Overlay workflow (planned)

1. Load a reference capture and verify its original image exists.
2. Start the camera preview and request camera permissions.
3. Render the reference image as an adjustable-opacity overlay above the preview without modifying either image.
4. Capture a new photograph, retaining the original unmodified pixels.
5. Persist new metadata with `referenceCaptureId` pointing to the chosen capture.

Overlay is a view-time aid. Composition, rotation, aspect ratios, image orientation, safe areas, and camera field of view require device tests; a simple overlay does not guarantee geometric alignment. Do not claim pixel-perfect match without optical or geometric validation.

## UI / Figma

Figma is the source of truth for layout, colors, spacing, typography, and component states. Implementation details (permission handling, accessibility, safe areas, loading/error states, and native camera constraints) must be reconciled against platform behavior rather than silently invented. Link the selected frames in the implementation PR.

## Testing policy

1. Write or update failing tests for observable behavior (RED).
2. Implement minimum production code (GREEN).
3. Refactor while keeping tests green.
4. For React Native UI, add rendering and interaction tests; for file/SQLite adapters, add integration tests and real-device checks.
5. Run `npx tsc --noEmit`, `npm test -- --watch=false`, and `npm run lint` before PRs.

Mocks test orchestration but do not prove actual file durability or correct permissions on device.

## Open-source and release constraints

- Code: MIT; review third-party license terms before adoption.
- Do not commit signing certificates, production keystores, tokens, user photos, or proprietary artwork.
- QA IDs: `com.espindola.camerae.qa` on both platforms; production IDs remain out of scope for the initial iteration.
- Git: feature branches from `develop`, PRs into `develop`, releases into `main`.

## Next milestone

A minimally designed camera screen sourced from Figma, followed by a real camera adapter and a durable local file/database implementation; all changes behind small testable boundaries.
