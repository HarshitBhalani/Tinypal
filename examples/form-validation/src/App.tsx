import { useState } from "react";
import type { FormEvent } from "react";
import { MascotProvider, trackSubmit, useMascot } from "tinypal";

/** Pretend API: fails when the email contains "fail". */
async function saveSignup(email: string) {
  await new Promise((r) => setTimeout(r, 1200));
  if (email.includes("fail")) throw new Error("Email already registered");
}

function SignupForm() {
  const mascot = useMascot();
  const [status, setStatus] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // The browser already blocked invalid submits (and tinypal reacted with
    // "confused"), so here the form is valid.
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;
    setStatus("Sending...");
    try {
      // loading -> happy, or sad if saveSignup throws
      await trackSubmit(mascot, () => saveSignup(email));
      setStatus("Signed up!");
      // Not calling form.reset() here: it fires "form:reset", which would end
      // the celebration immediately.
    } catch (err) {
      setStatus((err as Error).message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <p>
        <label>
          Name
          <br />
          <input name="name" required minLength={2} />
        </label>
      </p>
      <p>
        <label>
          Email (type one containing <code>fail</code> to see an error)
          <br />
          <input name="email" type="email" required />
        </label>
      </p>
      <p>
        <label>
          Password (tinypal ignores password fields completely)
          <br />
          <input name="password" type="password" required minLength={6} />
        </label>
      </p>
      <div className="row">
        <button type="submit">Sign up</button>
        <button type="reset">Reset</button>
      </div>
      <p aria-live="polite">{status}</p>
    </form>
  );
}

export function App() {
  return (
    <MascotProvider
      character="cat"
      position="bottom-right"
      enableFormAwareness
      messages={{
        invalid: "Almost! A few fields need fixing.",
        success: "Welcome aboard!",
        error: "Hmm, that email didn't work.",
      }}
    >
      <main>
        <h1>Form validation</h1>
        <p>
          <code>enableFormAwareness</code> watches native forms: focus makes the cat curious, typing
          makes it think, and submitting with empty fields confuses it. <code>trackSubmit()</code>{" "}
          handles loading, success and failure.
        </p>
        <SignupForm />
      </main>
    </MascotProvider>
  );
}
