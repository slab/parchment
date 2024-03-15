# [Unreleased]

# 3.0.0-beta.0

- Make the bundle a valid ESM page
- Improve typings for Blot

# 3.0.0-alpha.2

- Improved typing for Attributor and Registry.

# 3.0.0-alpha.1

- Fix ESM bundle not exposed in package.json.

# 3.0.0-alpha.0

- BREAKING: Types are now directly exposed from `parchment`.
- Added ESM bundle.
- Fixed typing for `Parent#descendants`.
- Updated `Blot.tagName` to allow `string[]`.

# 2.0.1

- `Registry.find()` handles restricted nodes on Firefox.

# 2.0.0

- Add `ParentBlot`. `ContainerBlot` now inherits `ParentBlot`.
- Add UI node support with `ParentBlot#attachUI()`.
- Fix compatibility with TypeScript 3.7.
- Ensure `Scroll#find()` does not return blots in child scrolls.

## Breaking Changes

- The default export is removed. Use named exports instead:

  Before:

  ```ts
  import Parchment from 'parchment';
  const blot = Parchment.create(/* ... */);
  class MyContainer extends Parchment.Container {}
  ```

  After:

  ```ts
  import { Registry, ContainerBlot } from 'parchment';
  const blot = Registry.create(/* ... */);
  class MyContainer extends Parchment.ContainerBlot {}
  ```

- `ParentBlot.defaultChild` requires a blot constructor instead of a string.
- `Blot#replace()` is removed. Use `Blot#replaceWith()` instead.
- `Blot#insertInto()` is removed. Use `Parent#insertBefore()` instead.
- `FormatBlot` is removed. Now `BlockBlot` and `InlineBlot` implement `Formattable` interface directly.
- **Typing**: `Blot#prev`, `Blot#next` and `Blot#split()` may return `null`.
- **Typing**: Other misc type declaration changes.
