import type { ReactNode } from "react";

export type WidgetKey = "spotify" | "discord" | "activities";

export interface WidgetType {
  key: WidgetKey;
  label: string;
  description: string;
  icon: ReactNode;
  color: string;
}

export const widgetTypes: WidgetType[] = [
  {
    key: "spotify",
    label: "Spotify",
    description: "Now playing track with album art, progress bar & lyrics",
    icon: (
      <svg width="14" height="14" viewBox="0 0 168 168" fill="currentColor">
        <path d="M84 0C37.6 0 0 37.6 0 84s37.6 84 84 84 84-37.6 84-84S130.4 0 84 0zm38.5 121.2c-1.5 2.5-4.8 3.3-7.3 1.8-20-12.2-45.1-15-74.8-8.2-2.9.6-5.7-1.2-6.4-4.1-.6-2.9 1.2-5.7 4.1-6.4 32.4-7.4 60.3-4.2 82.6 9.6 2.5 1.5 3.3 4.8 1.8 7.3zm10.3-22.8c-1.9 3.1-6 4.1-9 2.2-22.8-14-57.6-18.1-84.6-9.9-3.5 1.1-7.2-.9-8.3-4.4-1.1-3.5.9-7.2 4.4-8.3 30.9-9.4 69.3-4.8 95.3 11.3 3.1 1.9 4.1 6 2.2 9.1zm.9-23.8c-27.4-16.3-72.7-17.8-98.9-9.8-4.2 1.3-8.6-1.1-9.9-5.2-1.3-4.2 1.1-8.6 5.2-9.9 30-9.1 79.9-7.3 111.4 11.3 3.8 2.2 5 7.1 2.7 10.9-2.2 3.7-7.1 5-10.9 2.7h.4z" />
      </svg>
    ),
    color: "#1DB954",
  },
  {
    key: "discord",
    label: "Discord",
    description: "Real-time Discord status, custom status & current activity",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    color: "#5865F2",
  },
  {
    key: "activities",
    label: "Activities",
    description: "Current game or activity with elapsed time",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <path d="M7 12h4M9 10v4" />
        <circle cx="15.5" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="13.5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
    color: "#f59e0b",
  },
];
