# Camerae

**Camerae** is an open-source, local-first mobile photography application for capturing a scene and reproducing the same framing later.

The first milestone is deliberately small:

1. Capture a photograph.
2. Keep its original image and metadata on the device.
3. Find a previous capture.
4. Open the camera with that capture as a semi-transparent reference overlay.
5. Create a new capture linked to its reference.

Advanced perspective correction, camera alignment assistance, cloud sync, accounts, and automated image processing are outside the initial scope.

> **Status:** early development. The React Native template runs on iOS and Android, and the first `SaveCapture` use case is under test. The actual camera and storage adapters have **not** been implemented yet.

## Technology

- React Native Community CLI **0.87.1** (no Expo)
- TypeScript
- iOS and Android native projects
- Jest and ESLint
- Native camera, filesystem, and SQLite adapters: **planned, not yet installed**
- Figma: source of truth for UI screens, components, and visual decisions

## Local environment

- Node version: see `.nvmrc` (initially `24.22.0`)
- npm, with the committed `package-lock.json`
- macOS and Xcode for iOS builds
- Android SDK, Java 17, and an emulator/device for Android builds
- Bundler/CocoaPods for native iOS dependencies

Install JavaScript dependencies:

```sh
fnm use # if you use fnm; other .nvmrc-compatible managers are fine
npm ci
```

For iOS on macOS:

```sh
bundle install
cd ios && bundle exec pod install && cd ..
```

Run Metro in one terminal:

```sh
npm start
```

Then, in a second terminal, run either:

```sh
npm run ios
# or
npm run android
```

### Application IDs

The current development builds use the dedicated **QA** identifier on both platforms:

`com.espindola.camerae.qa`

The production identifier, `com.espindola.camerae`, is not yet configured in this rewrite. Do not change identifiers to production or introduce production signing material in routine development.

## Quality checks

Run before opening a pull request:

```sh
npx tsc --noEmit
npm test -- --watch=false
npm run lint
```

## Architecture and data ownership

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Camerae is **local-first**. Original photographs must be held in app-managed persistent storage; structured metadata belongs in the local database. Temporary camera paths, cached previews, and UI state are not durable sources of truth.

The first application use case (`SaveCapture`) is deliberately independent of React Native APIs. Native integrations will implement its interfaces and be tested separately.

## Development process

- `main`: stable baseline and releases
- `develop`: integrated work
- `feature/*`: new functionality, branched from `develop`
- `release/*`: release preparation (as needed)
- `hotfix/*`: fixes to stable releases (as needed)

Make changes through pull requests. See [CONTRIBUTING.md](CONTRIBUTING.md) for repository rules and review expectations.

## Licensing

Source code is distributed under the terms in [LICENSE](LICENSE) (MIT). Third-party packages retain their own licenses. Before adding a dependency or publishing imagery, icons, fonts, or brand assets, verify that their terms allow distribution in an open-source application. No production signing keys or user photographs should be committed.
