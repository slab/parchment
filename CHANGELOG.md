# 2.0.0

- Add `ParentBlot`. `ContainerBlot` now inherits `ParentBlot`.
- Add UI node support with `ParentBlot#attachUI()`.
- Fix compatibility with TypeScript 3.7.
- Ensure `Scroll#find()` does not return blots in child scrolls.

## Breaking Changes

- The default export is removed. Use named exports instead:

  Before:

  ```ts
  import Parchment from 'parchment'
  const blot = Parchment.create(/* ... */)
  class MyContainer extends Parchment.Container {}
  ```

  After:

  ```ts
  import { Registry, ContainerBlot } from 'parchment'
  const blot = Registry.create(/* ... */)
  class MyContainer extends Parchment.ContainerBlot {}
  ```

- `ParentBlot.defaultChild` requires a blot constructor instead of a string.
- `Blot#replace()` is removed. Use `Blot#replaceWith()` instead.
- `Blot#insertInto()` is removed. Use `Parent#insertBefore()` instead.
- `FormatBlot` is removed. Now `BlockBlot` and `InlineBlot` implement `Formattable` interface directly.
- **Typing**: `Blot#prev`, `Blot#next` and `Blot#split()` may return `null`.
- **Typing**: Other misc type declaration changes.
