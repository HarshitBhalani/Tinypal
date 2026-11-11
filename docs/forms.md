# Form awareness

| What happens               | Event          | Mascot              |
| -------------------------- | -------------- | ------------------- |
| Focus enters a form        | `form:focus`   | curious             |
| Typing                     | `form:input`   | thinking            |
| Submit with invalid fields | `form:invalid` | confused            |
| Submitting                 | `form:submit`  | loading             |
| Submission succeeded       | `form:success` | happy + celebrating |
| Submission failed          | `form:error`   | sad                 |
| Form reset                 | `form:reset`   | idle                |

## Privacy

tinypal only looks at **which** event happened and **what kind** of element it
came from. It never reads `value` or any other field content.

- Password fields are always ignored (no events at all).
- Add `data-tinypal-ignore` to any field to ignore it too.
- Inputs outside a `<form>` are ignored.

## Native HTML forms

```tsx
<ContextMascot enableFormAwareness />
```

This watches every form on the page, including forms added later. Options:

```tsx
<ContextMascot
  enableFormAwareness={{
    ignore: ".newsletter input", // extra fields to ignore
    reactToSubmit: false, // don't show loading on submit
  }}
/>
```

### Success and failure

The browser cannot know whether your server accepted the submission, so tell
the mascot. `trackSubmit` does it for you:

```tsx
import { trackSubmit, useMascot } from "tinypal";

const mascot = useMascot();

const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    await trackSubmit(mascot, () => api.save(new FormData(e.currentTarget)));
  } catch {
    // the mascot already looks sad; show your own error too
  }
};
```

`trackSubmit` emits `form:submit`, then `form:success` or (if the function
throws) `form:error`, and re-throws the error.

Or emit yourself: `mascot.emit("form:success")` / `mascot.emit("form:error")`.

## React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { rhfHandlers, useMascot } from "tinypal";

function Signup() {
  const mascot = useMascot();
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(...rhfHandlers(mascot, save, onInvalid))}>
      <input {...register("email", { required: true })} />
      <button>Sign up</button>
    </form>
  );
}
```

- Valid submit: loading, then happy, or sad if `save` throws.
- Validation failure: confused. Your optional `onInvalid` still runs.

## Formik

```tsx
import { Formik, Form } from "formik";
import { formikInvalid, formikSubmit, useMascot } from "tinypal";

function Signup() {
  const mascot = useMascot();
  return (
    <Formik initialValues={{ email: "" }} validate={validate} onSubmit={formikSubmit(mascot, save)}>
      {({ errors, submitCount }) => (
        <Form>
          <InvalidWatcher errors={errors} submitCount={submitCount} />
          ...
        </Form>
      )}
    </Formik>
  );
}

// Formik doesn't call onSubmit when validation fails, so report it after each attempt:
function InvalidWatcher({ errors, submitCount }: { errors: object; submitCount: number }) {
  const mascot = useMascot();
  useEffect(() => {
    if (submitCount) formikInvalid(mascot, errors as Record<string, unknown>);
  }, [submitCount]);
  return null;
}
```

Neither adapter imports React Hook Form or Formik; they only wrap your callbacks.

## Other validation libraries

tinypal does not try to detect every library automatically. Emit the events
yourself where your library tells you the result:

```ts
mascot.emit("form:invalid");
mascot.emit("form:success");
```
