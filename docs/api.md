# API awareness

| Event                       | Mascot              | Default message                       |
| --------------------------- | ------------------- | ------------------------------------- |
| `api:start` / `api:loading` | thinking + loading  | "Give me a moment..."                 |
| `api:success`               | happy + celebrating | "You did it!"                         |
| `api:error`                 | sad                 | "Oops! Something went wrong."         |
| `api:network-error`         | sad                 | "I can't reach the server right now." |
| `api:cancelled`             | idle                | "Okay, cancelled."                    |

## Manual events

```ts
mascot.emit("api:loading");
mascot.emit("api:success");
mascot.emit("api:error");
```

## `fetch`

`createMascotFetch` returns a drop-in replacement for `fetch`. Responses and
errors are passed through unchanged.

```tsx
import { createMascotFetch, useMascot } from "tinypal";

function useApi() {
  const mascot = useMascot();
  return useMemo(() => createMascotFetch(mascot), [mascot]);
}

const api = useApi();
const res = await api("/api/orders", { method: "POST", body });
```

### What counts as an error

By default any response that isn't `ok` (status outside 200–299) counts as an
error. You decide:

```ts
createMascotFetch(mascot, {
  isError: (res) => res.status >= 500, // 404 "not found" is fine for us
});
```

- A rejected fetch caused by `AbortController` becomes `api:cancelled`.
- Any other rejected fetch becomes `api:network-error`.

### Skipping requests

```ts
createMascotFetch(mascot, {
  filter: (input) => !String(input).includes("/analytics"),
});
```

### Using your own fetch

```ts
createMascotFetch(mascot, { fetch: myFetchWithAuth });
```

## Axios

```ts
import axios from "axios";
import { attachAxios } from "tinypal";

const client = axios.create({ baseURL: "/api" });
const detach = attachAxios(client, mascot, {
  isError: (status) => status >= 500,
  filter: (config) => config.url !== "/ping",
});

// later, e.g. on unmount
detach();
```

Cancellations (`AbortController` or Axios cancel tokens) become
`api:cancelled`, requests with no response become `api:network-error`, and
statuses are judged by `isError` (default `status >= 400`). If `isError` says a
status Axios rejected is fine, the mascot treats it as a success.

tinypal does not depend on Axios; `attachAxios` only uses the interceptors API.

## Overlapping requests

Both adapters aggregate concurrent requests: the mascot shows **one** loading
state while any request is running, and reacts **once** when the last one
finishes, using the most serious outcome
(network error > error > success > cancelled).
