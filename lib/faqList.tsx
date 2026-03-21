import type { ReactNode } from "react";

export const faqItems: [string, ReactNode][] = [
  [
    "What is Lanyard?",
    "Lanyard is a free API that exposes your Discord presence in real-time — including your online status, current activity, and Spotify track — over WebSocket.",
  ],
  [
    "How do I find my Discord user ID?",
    'Enable Developer Mode in Discord (Settings → Advanced → Developer Mode), then right-click your username and select "Copy User ID".',
  ],
  [
    "How do I add a widget to OBS?",
    'Copy your widget URL, add a Browser Source in OBS, paste the URL, set width to ~420px and height to ~120px, and check "Shutdown source when not visible".',
  ],
  [
    "Does it update in real-time?",
    "Yes — widgets connect directly to Lanyard's WebSocket and update instantly as your presence changes, with no polling or refresh needed.",
  ],
  [
    "Do I need to install anything?",
    <>
      No. Join the{" "}
      <a
        href="https://discord.gg/UrXF2cfJ7F"
        target="_blank"
        rel="noopener noreferrer"
        className="lanyard-link"
      >
        Lanyard Discord server
      </a>{" "}
      so the bot can read your presence, then use your user ID here.
    </>,
  ],
];
