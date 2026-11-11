import { SaveButton } from "./save-button";

// A server component. Only the interactive bits are client components.
export default function Page() {
  return (
    <main>
      <h1>tinypal + Next.js (App Router)</h1>
      <p>The fox in the corner was rendered on the server and came alive after hydration.</p>
      <SaveButton />
    </main>
  );
}
