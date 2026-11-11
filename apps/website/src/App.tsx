import { useState } from "react";
import { MascotProvider } from "@tinypal/react";
import type { CharacterId } from "@tinypal/react";
import { Nav } from "./components/Nav";
import { Hero } from "./sections/Hero";
import { Gallery } from "./sections/Gallery";
import { EventDemo } from "./sections/EventDemo";
import { CodeExamples, Docs, Features, Footer, HowItWorks, Install } from "./sections/Content";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, toggle } = useTheme();
  const [character, setCharacter] = useState<CharacterId>("robot");
  const [mascotHidden, setMascotHidden] = useState(false);

  return (
    <MascotProvider
      character={character}
      position="bottom-right"
      size={110}
      theme={theme}
      draggable
      hidden={mascotHidden}
      messages={{ sleepy: ["Is anyone there?", "Scroll down, there's more to see..."] }}
    >
      <Nav
        theme={theme}
        onToggleTheme={toggle}
        mascotHidden={mascotHidden}
        onToggleMascot={() => setMascotHidden((h) => !h)}
      />
      <main>
        <Hero theme={theme} />
        <Gallery selected={character} onSelect={setCharacter} theme={theme} />
        <HowItWorks />
        <EventDemo theme={theme} />
        <CodeExamples />
        <Features />
        <Install />
        <Docs />
      </main>
      <Footer />
    </MascotProvider>
  );
}
