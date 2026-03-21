import type { ReactNode } from "react";

export const getFaqItems = (lang: "en" | "es"): [string, ReactNode][] => {
  if (lang === "es") {
    return [
      [
        "¿Qué es Lanyard?",
        "Lanyard es una API gratuita que expone tu presencia de Discord en tiempo real — incluyendo tu estado en línea, actividad actual y pista de Spotify — a través de WebSocket.",
      ],
      [
        "¿Cómo encuentro mi ID de usuario de Discord?",
        'Habilita el Modo Desarrollador en Discord (Ajustes → Avanzado → Modo Desarrollador), haz clic derecho en tu nombre de usuario y selecciona "Copiar ID de usuario".',
      ],
      [
        "¿Cómo agrego un widget a OBS?",
        'Copia la URL de tu widget, agrega una Fuente de Navegador en OBS, pega la URL, establece el ancho en ~420px y la altura en ~120px, y marca "Apagar la fuente cuando no sea visible".',
      ],
      [
        "¿Se actualiza en tiempo real?",
        "Sí — los widgets se conectan directamente al WebSocket de Lanyard y se actualizan instantáneamente a medida que cambia tu presencia, sin necesidad de recargar.",
      ],
      [
        "¿Necesito instalar algo?",
        <>
          No. Únete al{" "}
          <a
            href="https://discord.gg/UrXF2cfJ7F"
            target="_blank"
            rel="noopener noreferrer"
            className="lanyard-link"
          >
            servidor de Discord de Lanyard
          </a>{" "}
          para que el bot pueda leer tu presencia, luego usa tu ID de usuario aquí.
        </>,
      ],
    ];
  }

  return [
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
};
