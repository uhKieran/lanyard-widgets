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

interface Activity {
  type: number;
  name: string;
  state?: string;
  details?: string;
  emoji?: { name: string; id?: string };
}

interface LanyardData {
  discord_user: { id: string; username: string; global_name?: string; avatar?: string; banner?: string };
  discord_status: string;
  activities: Activity[];
}

export default function ProfileWidget() {
  const { query } = useRouter();
  const userId = query.userId as string | undefined;
  const isDark = query.theme === "dark";
  const fontSlug = query.font as string | undefined;
  const bgHex = query.bg as string | undefined;
  const textHex = query.color as string | undefined;
  const shouldHideIcon = query.noicon === "1";
  const useDiscordBanner = query.discordbanner === "1";
  const widthParam = query.width ? parseInt(query.width as string, 10) : undefined;
  const heightParam = query.height ? parseInt(query.height as string, 10) : undefined;

  const [data, setData] = useState<LanyardData | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const { isVisible, isExiting, showWidget, hideWidget } = useWidgetVisibility();

  useLanyardSocket(userId, (d, offlineMode) => {
    setIsOffline(offlineMode);
    if (!d) {
      if (!offlineMode) hideWidget();
      else showWidget();
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
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
    : null;
  const discordBannerUrl = useDiscordBanner && user?.id
    ? `https://dcdn.dstn.to/banners/${user.id}`
    : null;
  const bannerBackground = discordBannerUrl
    ? `url(${discordBannerUrl}) center/cover no-repeat`
    : avatarUrl
    ? `url(${avatarUrl}) center/cover no-repeat`
    : "#5865F2";

  const customStatus = data?.activities.find((a) => a.type === 4);
  const currentActivity = data?.activities.find((a) => a.type === 0);

  const cardClass = [
    "card",
    "widget-profile",
    isVisible ? "visible" : "",
    isExiting ? "exiting" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const overrideCss = buildWidgetOverrideCss(bgHex, textHex, shouldHideIcon, widthParam, heightParam);

  return (
    <>
      <Head>
        <title>Profile</title>
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
        <div className="profile-banner" style={{ background: bannerBackground }} />
        <div className="profile-banner-overlay" />
        <div className="card-inner profile-inner">
          <svg className="bg-logo" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>

          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {avatarUrl
                ? <img src={avatarUrl} alt="" />
                : <div style={{ width: "100%", height: "100%", background: "#e4e4e7" }} />}
            </div>
            <div
              className="status-dot profile-status-dot"
              style={{ background: statusColors[status] ?? statusColors.offline }}
            />
          </div>

          <div className="info profile-info">
            <div className="profile-name">{isOffline ? "Offline" : (user?.global_name ?? user?.username ?? "")}</div>
            <div className="profile-username">@{isOffline ? "disconnected" : (user?.username ?? "")}</div>
            {!isOffline && customStatus && (
              <div className="profile-custom-status">
                {customStatus.emoji?.name && <span>{customStatus.emoji.name}</span>}
                {customStatus.state}
              </div>
            )}
            {!isOffline && currentActivity && (
              <div className="profile-current-activity">
                <div className="activity-label">Playing {currentActivity.name}</div>
                {currentActivity.details && <div className="activity-details">{currentActivity.details}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
