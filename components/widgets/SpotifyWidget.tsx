import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { fontshareUrl } from "@/lib/fonts";
import { useLanyardSocket } from "@/lib/useLanyardSocket";
import { useWidgetVisibility } from "@/lib/useWidgetVisibility";
import { useWidgetHeightReporter, useDarkTheme } from "@/lib/useWidgetSetup";
import { buildWidgetOverrideCss, fontSlugToFamilyName, widgetPageCss } from "@/lib/widgetUtils";
import { formatMs, parseLrc, LrcLine } from "@/lib/lyricsUtils";

interface SpotifyData {
  song: string;
  artist: string;
  album: string;
  albumArtUrl: string;
  trackId: string;
  timestamps: { start: number; end: number };
}

export default function SpotifyWidget() {
  const { query } = useRouter();
  const userId = query.userId as string | undefined;
  const isDark = query.theme === "dark";
  const isExpanded = query.expanded === "true";
  const fontSlug = query.font as string | undefined;
  const bgHex = query.bg as string | undefined;
  const textHex = query.color as string | undefined;
  const shouldHideIcon = query.noicon === "1";
  const widgetStyle = (query.style as string | undefined) ?? "default";
  const shouldHideBar = query.nobar === "1";
  const widthParam = query.width ? parseInt(query.width as string, 10) : undefined;
  const heightParam = query.height ? parseInt(query.height as string, 10) : undefined;

  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [progress, setProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [totalMs, setTotalMs] = useState(0);
  const [lyrics, setLyrics] = useState<LrcLine[]>([]);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [isOffline, setIsOffline] = useState(false);

  const { isVisible, isExiting, showWidget, hideWidget } = useWidgetVisibility();

  const animFrameRef = useRef<number | null>(null);
  const spotifyDataRef = useRef<SpotifyData | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  spotifyDataRef.current = spotifyData;

  const tick = useCallback(() => {
    const currentData = spotifyDataRef.current;
    if (currentData) {
      const elapsed = Date.now() - currentData.timestamps.start;
      const total = currentData.timestamps.end - currentData.timestamps.start;
      setElapsedMs(elapsed);
      setTotalMs(total);
      setProgress(Math.min(100, (elapsed / total) * 100));
    }
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  useLanyardSocket(userId, (presenceData, offlineMode) => {
    setIsOffline(offlineMode);
    const rawSpotify = (presenceData as Record<string, unknown>)?.spotify as
      | Record<string, unknown>
      | undefined;
    if (rawSpotify) {
      const mapped: SpotifyData = {
        song: rawSpotify.song as string,
        artist: rawSpotify.artist as string,
        album: rawSpotify.album as string,
        albumArtUrl: rawSpotify.album_art_url as string,
        trackId: rawSpotify.track_id as string,
        timestamps: rawSpotify.timestamps as { start: number; end: number },
      };
      setSpotifyData(mapped);
      showWidget();
    } else {
      if (!offlineMode) hideWidget();
      else showWidget();
      setSpotifyData(null);
    }
  });

  useDarkTheme(isDark);
  useWidgetHeightReporter();

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [tick]);

  useEffect(() => {
    if (!isExpanded || !spotifyData) {
      setLyrics([]);
      return;
    }

    const { song, artist, album } = spotifyData;
    fetch(
      `/api/lyrics?track_name=${encodeURIComponent(song)}&artist_name=${encodeURIComponent(artist)}&album_name=${encodeURIComponent(album)}`,
    )
      .then((r) => r.json())
      .then((data) => setLyrics(data.syncedLyrics ? parseLrc(data.syncedLyrics) : []))
      .catch(() => setLyrics([]));
  }, [isExpanded, spotifyData?.trackId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!lyrics.length) return;

    let currentIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (elapsedMs >= lyrics[i].time) currentIndex = i;
      else break;
    }
    setActiveLineIndex(currentIndex);

    if (lyricsContainerRef.current && currentIndex >= 0) {
      const lineElement = lyricsContainerRef.current.children[currentIndex] as HTMLElement | undefined;
      const scrollContainer = lyricsContainerRef.current.parentElement as HTMLElement | null;

      if (lineElement && scrollContainer) {
        const targetScroll =
          lineElement.offsetTop -
          scrollContainer.clientHeight / 2 +
          lineElement.clientHeight / 2;
        scrollContainer.scrollTo({ top: Math.max(0, targetScroll), behavior: "smooth" });
      }
    }
  }, [elapsedMs, lyrics]);

  const cardClassName = [
    "card",
    "widget-spotify",
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
        <title>Now Playing</title>
        <style>{widgetPageCss}</style>
        {fontSlug && <link rel="stylesheet" href={fontshareUrl(fontSlug)} />}
        {fontSlug && (
          <style>{`body { font-family: "${fontSlugToFamilyName(fontSlug)}", sans-serif; }`}</style>
        )}
        {overrideCss && <style>{overrideCss}</style>}
      </Head>

      <div
        className={cardClassName}
        style={{ display: !isVisible && !isExiting ? "none" : undefined }}
      >
        <div className="card-inner">
          {widgetStyle === "blurred" && (
            <div className="blur-bg">
              <img src={spotifyData?.albumArtUrl ?? ""} alt="" />
            </div>
          )}

          <svg className="bg-logo" viewBox="0 0 168 168" fill="currentColor">
            <path d="M84 0C37.6 0 0 37.6 0 84s37.6 84 84 84 84-37.6 84-84S130.4 0 84 0zm38.5 121.2c-1.5 2.5-4.8 3.3-7.3 1.8-20-12.2-45.1-15-74.8-8.2-2.9.6-5.7-1.2-6.4-4.1-.6-2.9 1.2-5.7 4.1-6.4 32.4-7.4 60.3-4.2 82.6 9.6 2.5 1.5 3.3 4.8 1.8 7.3zm10.3-22.8c-1.9 3.1-6 4.1-9 2.2-22.8-14-57.6-18.1-84.6-9.9-3.5 1.1-7.2-.9-8.3-4.4-1.1-3.5.9-7.2 4.4-8.3 30.9-9.4 69.3-4.8 95.3 11.3 3.1 1.9 4.1 6 2.2 9.1zm.9-23.8c-27.4-16.3-72.7-17.8-98.9-9.8-4.2 1.3-8.6-1.1-9.9-5.2-1.3-4.2 1.1-8.6 5.2-9.9 30-9.1 79.9-7.3 111.4 11.3 3.8 2.2 5 7.1 2.7 10.9-2.2 3.7-7.1 5-10.9 2.7h.4z" />
          </svg>

          <div className="album-art">
            {spotifyData?.albumArtUrl && (
              <img src={spotifyData.albumArtUrl} alt="" />
            )}
            <div className="album-art-overlay" />
          </div>

          <div className="info">
            <div className="song-name">{isOffline ? "Offline" : (spotifyData?.song ?? "")}</div>
            <div className="artist-album">
              {isOffline ? "Lanyard connection lost" : (spotifyData ? `${spotifyData.artist} \u2013 ${spotifyData.album}` : "")}
            </div>
            {!shouldHideBar && !isOffline && (
              <div className="progress-wrap">
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="timestamps">
                  <span>{formatMs(elapsedMs)}</span>
                  <span>{formatMs(totalMs)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {isExpanded && lyrics.length > 0 && (
          <div className="lyrics-section">
            <div className="lyrics-blur-bg">
              <img src={spotifyData?.albumArtUrl ?? ""} alt="" />
            </div>
            <div className="lyrics-body">
              <div className="lyrics-inner" ref={lyricsContainerRef}>
                {lyrics.map((line, index) => (
                  <div
                    key={index}
                    className={[
                      "lyric-line",
                      index === activeLineIndex ? "active" : "",
                      index < activeLineIndex ? "past" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
