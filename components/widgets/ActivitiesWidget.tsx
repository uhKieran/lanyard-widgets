import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fontshareUrl } from "@/lib/fonts";
import { useLanyardSocket } from "@/lib/useLanyardSocket";
import { useWidgetVisibility } from "@/lib/useWidgetVisibility";
import { useWidgetHeightReporter, useDarkTheme } from "@/lib/useWidgetSetup";
import { buildWidgetOverrideCss, fontSlugToFamilyName, widgetPageCss } from "@/lib/widgetUtils";

interface Activity {
  type: number;
  name: string;
  details?: string;
  state?: string;
  application_id?: string;
  assets?: { large_image?: string; large_text?: string };
  timestamps?: { start?: number };
}

function fmtElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export default function ActivitiesWidget() {
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

  const [activity, setActivity] = useState<Activity | null>(null);
  const [elapsed, setElapsed] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const { isVisible, isExiting, showWidget, hideWidget } = useWidgetVisibility();

  useLanyardSocket(userId, (d, offlineMode) => {
    setIsOffline(offlineMode);
    const payload = d as { activities?: Activity[] };
    const acts: Activity[] = payload?.activities ?? [];
    const act = acts.find((a) => a.type === 0) ?? null;
    if (!act) {
      if (!offlineMode) hideWidget();
      else showWidget();
      setActivity(null);
      setElapsed("");
      return;
    }
    setActivity(act);
    showWidget();
  });

  useDarkTheme(isDark);
  useWidgetHeightReporter();

  useEffect(() => {
    if (!activity?.timestamps?.start) {
      setElapsed("");
      return;
    }
    const start = activity.timestamps.start;
    const update = () => setElapsed(fmtElapsed(Date.now() - start));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [activity]);

  const iconUrl =
    activity?.application_id && activity.assets?.large_image
      ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
      : null;

  const cardClass = [
    "card",
    "widget-activities",
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
        <title>Activity</title>
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
          {widgetStyle === "blurred" && iconUrl && (
            <div className="blur-bg">
              <img src={iconUrl} alt="" />
            </div>
          )}

          <svg
            className="bg-logo"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="6" width="20" height="12" rx="3" />
            <path d="M7 12h4M9 10v4" />
            <circle cx="15.5" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
            <circle cx="17.5" cy="13.5" r="0.75" fill="currentColor" stroke="none" />
          </svg>

          <div className="album-art">
            {iconUrl ? (
              <img src={iconUrl} alt={activity?.assets?.large_text ?? activity?.name} />
            ) : (
              <div className="activity-icon-fallback">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a1a1aa"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="6" width="20" height="12" rx="3" />
                  <path d="M7 12h4M9 10v4" />
                  <circle cx="15.5" cy="11.5" r="0.75" fill="#a1a1aa" stroke="none" />
                  <circle cx="17.5" cy="13.5" r="0.75" fill="#a1a1aa" stroke="none" />
                </svg>
              </div>
            )}
            <div className="album-art-overlay" />
          </div>

          <div className="info">
            <div className="label">{isOffline ? "Disconnected" : "Playing"}</div>
            <div className="song-name">{isOffline ? "Offline" : (activity?.name ?? "")}</div>
            <div className="artist-album">{isOffline ? "Lanyard connection lost" : (activity?.details ?? activity?.state ?? "")}</div>
            {!isOffline && elapsed && (
              <div className="progress-wrap">
                <div className="timestamps">
                  <span>for {elapsed}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
