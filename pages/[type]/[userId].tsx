import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const SpotifyWidget = dynamic(() => import("@/components/widgets/SpotifyWidget"), { ssr: false });
const DiscordWidget = dynamic(() => import("@/components/widgets/DiscordWidget"), { ssr: false });
const ActivitiesWidget = dynamic(() => import("@/components/widgets/ActivitiesWidget"), { ssr: false });
const ProfileWidget = dynamic(() => import("@/components/widgets/ProfileWidget"), { ssr: false });

const widgetMap: Record<string, React.ComponentType> = {
  spotify: SpotifyWidget,
  discord: DiscordWidget,
  activities: ActivitiesWidget,
  profile: ProfileWidget,
};

export default function WidgetDispatcherPage() {
  const router = useRouter();

  if (!router.isReady) return null;

  const { type, userId } = router.query;

  if (!type || !userId || typeof type !== "string" || typeof userId !== "string") {
    return <div style={{ color: "#fff", padding: 32 }}>Invalid widget URL.</div>;
  }

  const WidgetComponent = widgetMap[type.toLowerCase()];
  if (!WidgetComponent) {
    return <div style={{ color: "#fff", padding: 32 }}>Unknown widget type: {type}</div>;
  }

  return <WidgetComponent />;
}
