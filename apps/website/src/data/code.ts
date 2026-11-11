export interface CodeExample {
  id: string;
  label: string;
  file: string;
  code: string;
}

export const CODE_EXAMPLES: CodeExample[] = [
  {
    id: "basic",
    label: "Basic React",
    file: "App.tsx",
    code: `import { ContextMascot } from "tinypal";

export default function App() {
  return (
    <>
      <YourApp />
      <ContextMascot
        character="robot"
        position="bottom-right"
        size={150}
        trackCursor
        enableFormAwareness
        enableIdleAnimation
      />
    </>
  );
}`,
  },
  {
    id: "form",
    label: "Form integration",
    file: "ContactForm.tsx",
    code: `import { useForm } from "react-hook-form";
import { MascotProvider, useMascot, rhfHandlers } from "tinypal";

function ContactForm() {
  const mascot = useMascot();
  const { register, handleSubmit } = useForm();

  // valid -> loading -> happy (or sad if save() throws)
  // invalid -> confused
  return (
    <form onSubmit={handleSubmit(...rhfHandlers(mascot, save))}>
      <input {...register("email", { required: true })} />
      <button>Send</button>
    </form>
  );
}

export default function App() {
  return (
    <MascotProvider character="cat" messages={{ success: "Message sent!" }}>
      <ContactForm />
    </MascotProvider>
  );
}`,
  },
  {
    id: "api",
    label: "API integration",
    file: "api.ts",
    code: `import { useMascot, createMascotFetch } from "tinypal";

function SaveButton() {
  const mascot = useMascot();

  // Drop-in fetch: start -> loading, then success / error /
  // network-error / cancelled. You decide what counts as an error.
  const api = createMascotFetch(mascot, {
    isError: (res) => res.status >= 500, // a 404 is fine here
  });

  return <button onClick={() => api("/api/save", { method: "POST" })}>Save</button>;
}

// Or trigger reactions yourself:
mascot.emit("api:loading");
mascot.emit("api:success");
mascot.say("All saved!");`,
  },
  {
    id: "next",
    label: "Next.js",
    file: "app/providers.tsx",
    code: `"use client";
import { MascotProvider } from "tinypal";

// Server-safe: the mascot renders on the server and appears after hydration.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MascotProvider character="fox" position="bottom-right" theme="auto">
      {children}
    </MascotProvider>
  );
}

// app/layout.tsx
// <body><Providers>{children}</Providers></body>`,
  },
];

export const STEPS = [
  {
    title: "Install the package",
    body: "One dependency, no assets to host. Characters are tiny inline SVGs.",
    code: "npm install tinypal",
  },
  {
    title: "Add the mascot",
    body: "Drop in the component or wrap your app in a provider.",
    code: '<ContextMascot character="cat" />',
  },
  {
    title: "Connect your events",
    body: "Forms, fetch, Axios, or plain calls like play() and say().",
    code: 'mascot.emit("api:success")',
  },
];
