import { useState } from "react";
import { MascotProvider, characterList, useMascot } from "tinypal";
import type { CharacterId } from "tinypal";

function Controls() {
  const mascot = useMascot();
  return (
    <>
      <div className="row">
        <button onClick={() => mascot.play("happy", { duration: 2500 })}>Happy</button>
        <button onClick={() => mascot.play("sad", { duration: 2500 })}>Sad</button>
        <button onClick={() => mascot.play("thinking", { duration: 2500 })}>Thinking</button>
        <button onClick={() => mascot.play("loading")}>Loading</button>
        <button onClick={() => mascot.play("celebrating", { duration: 2500 })}>Celebrate</button>
        <button onClick={() => mascot.play("idle")}>Reset</button>
      </div>
      <div className="row">
        <button onClick={() => mascot.say("Hello from useMascot()!")}>Say hello</button>
        <button onClick={() => mascot.emit("api:success")}>emit("api:success")</button>
        <button onClick={() => mascot.emit("api:error")}>emit("api:error")</button>
      </div>
    </>
  );
}

export function App() {
  const [character, setCharacter] = useState<CharacterId>("robot");

  return (
    <MascotProvider character={character} position="bottom-right" size={140} draggable>
      <main>
        <h1>Basic React</h1>
        <p>
          A mascot from <code>MascotProvider</code>, controlled anywhere with{" "}
          <code>useMascot()</code>. Move your cursor, click the mascot, or leave the page alone for
          30 seconds.
        </p>
        <label>
          Character:{" "}
          <select value={character} onChange={(e) => setCharacter(e.target.value as CharacterId)}>
            {characterList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <Controls />
      </main>
    </MascotProvider>
  );
}
