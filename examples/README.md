# Examples

| Example                              | Shows                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| [basic-react](basic-react)           | `MascotProvider`, `useMascot()`, switching characters, `play` / `say` / `emit`     |
| [form-validation](form-validation)   | `enableFormAwareness` on a native form, `trackSubmit()`, custom messages           |
| [api-interactions](api-interactions) | `createMascotFetch()` with a custom `isError`, cancellation, manual `api:*` events |
| [nextjs-example](nextjs-example)     | App Router setup with a client `Providers` component                               |

## Running the Vite examples

From the repository root:

```bash
npm install
npm run dev -w @tinypal/example-basic-react
npm run dev -w @tinypal/example-form-validation
npm run dev -w @tinypal/example-api-interactions
```

They import `tinypal` exactly as an app would. Inside this repo, a Vite alias
(`examples/vite.shared.ts`) points that import at the local source.

## Next.js example

The Next.js example is not part of the workspace, so `npm install` at the root
does not download Next.js. It installs `tinypal` from npm, so it runs once the
package is published:

```bash
cd examples/nextjs-example
npm install
npm run dev
```

The setup it shows is also described in [docs/nextjs.md](../docs/nextjs.md).
