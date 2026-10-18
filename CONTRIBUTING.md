# Contributing to Camerae

Thank you for considering a contribution to Camerae. The project is an open-source, local-first photography app built using **React Native Community CLI** (no Expo) for iOS and Android.

## Development principles

- Keep contributions small, focused, and easy to review.
- Follow **test-driven development (TDD)**: write a failing test, implement the minimum behavior, then refactor.
- Keep business rules independent of React Native and native camera/storage libraries whenever possible.
- Use the project's Figma designs as the source of truth for UI. Ask for access or a design reference before implementing screens; do not invent a replacement design.
- Prefer local-first functionality. Do not introduce servers, analytics, cloud dependencies, or tracking without an explicit architectural decision.
- Do not commit credentials, signing keys, private provisioning files, captured photographs, or personal data.

## Environment

- macOS with Xcode for iOS development; Android development is also possible on supported non-macOS systems.
- Node.js as specified in `.nvmrc` (currently `24.22.0`). A version manager such as `fnm` is recommended.
- npm; use the committed `package-lock.json` for reproducible dependency installs.
- JDK 17, Android SDK, and an emulator or device for Android development.
- Xcode and CocoaPods for iOS development.

On a fresh clone:

```bash
fnm use             # if you use fnm
npm ci
bundle install      # macOS / iOS only
cd ios && bundle exec pod install && cd ..
```

Run the app:

```bash
npm run android
npm run ios         # macOS / iOS only
```

The initial development app identifier is `com.espindola.camerae.qa` on both platforms. Production identifiers and release signing are managed separately. Contributors may need to select their own Apple development team and use local-only signing adjustments; do not commit personal credentials or provisioning profiles.

## Branches and pull requests

- `main`: stable releases. Do not push feature work directly to `main`.
- `develop`: integration branch; open feature pull requests against `develop`.
- `feature/<topic>`: focused changes branched from `develop`.
- `release/<version>`: release preparation when needed.
- `hotfix/<topic>`: urgent fixes branched from `main`; propagate fixes back to `develop`.

Example feature workflow:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/my-change
# develop, test, and commit your change
git push -u origin feature/my-change
```

Open a pull request into `develop` with a summary, testing evidence, and screenshots for UI changes. Use clear, scoped commit messages such as `feat: add capture metadata model` or `test: cover missing reference photo`.

## Quality checks

Run these before requesting a review:

```bash
npm run lint
npm test -- --watch=false
npx tsc --noEmit
```

For changes to native Android/iOS integration, also describe which device or simulator was tested and the result. New behavior should have a test when practical; explain any limitations when native-device behavior cannot be tested automatically.

## Photography and data safety

- Treat original photographs as immutable; never overwrite or transform the only original copy.
- Distinguish temporary camera output from durable app-managed storage.
- Capture metadata and file references should remain consistent even when permissions fail, storage is full, or the app is interrupted.
- Never include real users' photos, location history, or other sensitive data in fixtures or bug reports without permission.

## Licensing

By submitting a contribution, you agree that your contribution may be distributed under this repository's [MIT License](LICENSE). Only contribute code and assets that you have the right to license; attribution and third-party license requirements must be respected.
