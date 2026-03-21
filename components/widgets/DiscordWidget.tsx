import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { fontshareUrl } from "@/lib/fonts";
import { useLanyardSocket } from "@/lib/useLanyardSocket";
import { useWidgetVisibility } from "@/lib/useWidgetVisibility";
import { useWidgetHeightReporter, useDarkTheme } from "@/lib/useWidgetSetup";
import { buildWidgetOverrideCss, fontSlugToFamilyName, widgetPageCss } from "@/lib/widgetUtils";

const statusColors: Record<string, string> = {
  online: "#7bcf9a",
  idle: "#ffc052",
  dnd: "#e96969",
  offline: "#71717a",
};

const statusLabels: Record<string, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

interface Activity {
  type: number;
  name: string;
  state?: string;
  emoji?: { name: string; id?: string };
}

interface LanyardData {
  discord_user: { id: string; username: string; global_name?: string; avatar?: string };
  discord_status: string;
  activities: Activity[];
}

export default function DiscordWidget() {
  const { query } = useRouter();
  const userId = query.userId as string | undefined;
  const isDark = query.theme === "dark";
  const fontSlug = query.font as string | undefined;
  const bgHex = query.bg as string | undefined;
  const textHex = query.color as string | undefined;
  const shouldHideIcon = query.noicon === "1";
  const widgetStyle = (query.style as string | undefined) ?? "default";
  const widthParam = query.width ? parseInt(query.width as string, 10) : undefined;
  const heightParam = query.height ? parseInt(query.height as string, 10) : undefined;

  const [data, setData] = useState<LanyardData | null>(null);
  const { isVisible, isExiting, showWidget, hideWidget } = useWidgetVisibility();

  useLanyardSocket(userId, (d) => {
    if (!d) {
      hideWidget();
      setData(null);
      return;
    }
    setData(d as unknown as LanyardData);
    showWidget();
  });

  useDarkTheme(isDark);
  useWidgetHeightReporter();

  const user = data?.discord_user;
  const status = data?.discord_status ?? "offline";
  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : null;

  const customStatus = data?.activities.find((a) => a.type === 4);
  const gameActivity = data?.activities.find((a) => a.type === 0);

  const subtitle = customStatus
    ? [customStatus.emoji?.name, customStatus.state].filter(Boolean).join(" ")
    : gameActivity
    ? `Playing ${gameActivity.name}`
    : statusLabels[status] ?? status;

  const cardClass = [
    "card",
    "widget-discord",
    isVisible ? "visible" : "",
    isExiting ? "exiting" : "",
    widgetStyle !== "default" ? `style-${widgetStyle}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const overrideCss = buildWidgetOverrideCss(bgHex, textHex, shouldHideIcon, widthParam, heightParam);

  return (
    <>
      <Head>
        <title>Discord</title>
        <style>{widgetPageCss}</style>
        {fontSlug && <link rel="stylesheet" href={fontshareUrl(fontSlug)} />}
        {fontSlug && (
          <style>{`body { font-family: "${fontSlugToFamilyName(fontSlug)}", sans-serif; }`}</style>
        )}
        {overrideCss && <style>{overrideCss}</style>}
      </Head>

      <div
        className={cardClass}
        style={{ display: !isVisible && !isExiting ? "none" : undefined }}
      >
        <div className="card-inner">
          {widgetStyle === "blurred" && avatarUrl && (
            <div className="blur-bg">
              <img src={avatarUrl} alt="" />
            </div>
          )}

          <svg className="bg-logo" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>

          <div className="avatar-wrap">
            <div className="album-art">
              {avatarUrl
                ? <img src={avatarUrl} alt="" />
                : <div style={{ width: "100%", height: "100%", background: "#e4e4e7" }} />}
              <div className="album-art-overlay" />
            </div>
            <div
              className="status-dot"
              style={{ background: statusColors[status] ?? statusColors.offline }}
            />
          </div>

          <div className="info">
            <div className="song-name">{user?.global_name ?? user?.username ?? ""}</div>
            <div className="artist-album">{subtitle}</div>
            <div className="progress-wrap">
              <div className="timestamps">
                <span>@{user?.username ?? ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
