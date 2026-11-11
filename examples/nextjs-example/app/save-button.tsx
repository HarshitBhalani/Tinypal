"use client";

import { useMascot } from "tinypal";

export function SaveButton() {
  const mascot = useMascot();

  const save = async () => {
    mascot.emit("api:loading");
    await new Promise((r) => setTimeout(r, 1200));
    mascot.emit("api:success");
  };

  return <button onClick={save}>Save something</button>;
}
