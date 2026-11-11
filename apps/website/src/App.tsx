import { useState } from "react";
import { MascotProvider } from "@tinypal/react";
import { Nav } from "./components/Nav";
import { Hero } from "./sections/Hero";
import { Gallery } from "./sections/Gallery";
import { EventDemo } from "./sections/EventDemo";
import { Playground } from "./sections/Playground";
import { CodeExamples, Docs, Features, Footer, HowItWorks, Install } from "./sections/Content";
import { useTheme } from "./hooks/useTheme";
import { DEFAULT_CONFIG, toPosition } from "./data/playground";

export default function App() {
  const { theme, toggle } = useTheme();
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [mascotHidden, setMascotHidden] = useState(false);

  return (
    <MascotProvider
      character={config.character}
      position={toPosition(config)}
      size={config.size}
      theme={theme}
      trackCursor={config.trackCursor}
      trackingIntensity={config.trackingIntensity}
      trackingSpeed={config.trackingSpeed}
      headTracking={config.headTracking}
      showSpeechBubble={config.showSpeechBubble}
      draggable={config.draggable}
      idle={config.quickSleep ? { sleepyAfter: 3000, sleepAfter: 6000 } : undefined}
      messages={config.messages}
      hidden={mascotHidden}
    >
      <Nav
        theme={theme}
        onToggleTheme={toggle}
        mascotHidden={mascotHidden}
        onToggleMascot={() => setMascotHidden((h) => !h)}
      />
      <main>
        <Hero theme={theme} />
        <Gallery
          selected={config.character}
          onSelect={(character) => setConfig((c) => ({ ...c, character }))}
          theme={theme}
        />
        <HowItWorks />
        <EventDemo theme={theme} />
        <Playground config={config} onChange={setConfig} />
        <CodeExamples />
        <Features />
        <Install />
        <Docs />
      </main>
      <Footer />
    </MascotProvider>
  );
}
