import Head from "next/head";
import { GetStaticProps } from "next";
import { useEffect, useRef, useState } from "react";
import Accordion from "@/components/Accordion";
import FontPicker from "@/components/FontPicker";
import ColorInput from "@/components/ColorInput";
import { widgetTypes, type WidgetKey } from "@/lib/widgetTypes";
import { styleOptions } from "@/lib/indexUtils";
import { creditLinks } from "@/lib/creditLinks";
import { faqItems } from "@/lib/faqList";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
}

export default function Home({ contributors = [] }: { contributors: Contributor[] }) {
  const [userId, setUserId] = useState("");
  const [submittedId, setSubmittedId] = useState("");
  const [activeType, setActiveType] = useState<WidgetKey>("spotify");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [fontSlug, setFontSlug] = useState("satoshi");
  const [isExpanded, setIsExpanded] = useState(false);
  const [widgetStyles, setWidgetStyles] = useState<Record<string, string>>({
    spotify: "default",
    discord: "default",
    activities: "default",
  });
  const [hideProgressBar, setHideProgressBar] = useState(false);
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [hideIcon, setHideIcon] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [sourceA, setSourceA] = useState("");
  const [sourceB, setSourceB] = useState("");
  const [frontSlot, setFrontSlot] = useState<"a" | "b">("a");
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [frameHeight, setFrameHeight] = useState(0);
  const iframeRefA = useRef<HTMLIFrameElement>(null);
  const iframeRefB = useRef<HTMLIFrameElement>(null);
  const frontSlotRef = useRef<"a" | "b">("a");
  const hasInitializedRef = useRef(false);
  const crossfadeIdRef = useRef(0);
  const crossfadeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [liveUrl, setLiveUrl] = useState("");

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://lanyard.kie.ac";

  const widgetUrl = (() => {
    if (!submittedId) return "";

    const params = new URLSearchParams({ theme });
    if (fontSlug) params.set("font", fontSlug);
    if (isExpanded && activeType === "spotify") params.set("expanded", "true");
    if (widgetStyles[activeType] && widgetStyles[activeType] !== "default") {
      params.set("style", widgetStyles[activeType]);
    }
    if (activeType === "spotify" && hideProgressBar) params.set("nobar", "1");
    if (bgColor.length === 6) params.set("bg", bgColor);
    if (textColor.length === 6) params.set("color", textColor);
    if (hideIcon) params.set("noicon", "1");

    return `${baseUrl}/${activeType}/${submittedId}?${params}`;
  })();

  useEffect(() => {
    if (crossfadeDebounceRef.current) clearTimeout(crossfadeDebounceRef.current);
    if (!widgetUrl) {
      setLiveUrl("");
      return;
    }
    crossfadeDebounceRef.current = setTimeout(() => setLiveUrl(widgetUrl), 300);
    return () => {
      if (crossfadeDebounceRef.current) clearTimeout(crossfadeDebounceRef.current);
    };
  }, [widgetUrl]);

  useEffect(() => {
    if (!liveUrl) {
      setSourceA("");
      setSourceB("");
      setFrameHeight(0);
      hasInitializedRef.current = false;
      frontSlotRef.current = "a";
      setFrontSlot("a");
      setIsCrossfading(false);
      return;
    }

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      frontSlotRef.current = "a";
      setFrontSlot("a");
      setSourceA(liveUrl);
    } else {
      if (frontSlotRef.current === "a") {
        setSourceB(liveUrl);
      } else {
        setSourceA(liveUrl);
      }
    }
  }, [liveUrl]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type !== "lanyard-widget-height") return;

      const newHeight: number = event.data.height;
      const isFromA =
        iframeRefA.current &&
        event.source === iframeRefA.current.contentWindow;
      const isFromB =
        iframeRefB.current &&
        event.source === iframeRefB.current.contentWindow;

      if (!isFromA && !isFromB) return;

      const senderSlot: "a" | "b" = isFromA ? "a" : "b";
      setFrameHeight(newHeight);

      if (senderSlot === frontSlotRef.current) return;

      frontSlotRef.current = senderSlot;
      const currentId = ++crossfadeIdRef.current;

      setIsCrossfading(true);
      setTimeout(() => {
        if (crossfadeIdRef.current !== currentId) return;
        setFrontSlot(senderSlot);
        setIsCrossfading(false);
      }, 350);
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function handleSubmit() {
    const trimmedId = userId.trim();
    if (trimmedId) setSubmittedId(trimmedId);
  }

  function handleCopyUrl() {
    if (!widgetUrl) return;
    navigator.clipboard.writeText(widgetUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }

  return (
    <>
      <Head>
        <title>lanyard.kie.ac</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
      </Head>

      <main className="home-main">
        <div className="hero">
          <img src="/logo.png" alt="logo" className="hero-logo" />
          <h1 className="hero-title">lanyard.kie.ac</h1>
          <p className="hero-subtitle">
            Customisable Discord-synced widgets
          </p>
          <div className="hero-actions">
            <a
              href="https://github.com/uhKieran/lanyard-widgets"
              target="_blank"
              rel="noopener noreferrer"
              className="github-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Contribute on GitHub
            </a>

            {contributors.length > 0 && (
              <div className="contributors">
                <div className="contributors-avatars">
                  {contributors.slice(0, 9).map((c) => (
                    <a
                      key={c.login}
                      href={c.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contributor-avatar"
                      title={c.login}
                    >
                      <img src={c.avatar_url} alt={c.login} />
                    </a>
                  ))}
                </div>
                <span className="contributors-label">
                  {contributors.length} contributor{contributors.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className={`id-input-wrapper${submittedId ? " id-input-wrapper--submitted" : ""}`}
        >
          <div className="id-input-row">
            <input
              ref={inputRef}
              type="text"
              className="id-input"
              placeholder="Enter your Discord user ID…"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button className="preview-btn" onClick={handleSubmit}>
              Preview
            </button>
          </div>
        </div>

        {submittedId && (
          <div className="preview-container">
            <div className="type-selector">
              {widgetTypes.map((widgetType) => (
                <button
                  key={widgetType.key}
                  className={`type-btn${activeType === widgetType.key ? " type-btn--active" : ""}`}
                  onClick={() => setActiveType(widgetType.key)}
                >
                  <span
                    className="type-btn-icon"
                    style={{
                      color:
                        activeType === widgetType.key
                          ? widgetType.color
                          : "currentColor",
                    }}
                  >
                    {widgetType.icon}
                  </span>
                  {widgetType.label}
                </button>
              ))}
            </div>

            <div
              className="preview-frame-wrapper"
              style={{ height: frameHeight || 0 }}
            >
              {(["a", "b"] as const).map((slot) => {
                const source = slot === "a" ? sourceA : sourceB;
                const iframeRef = slot === "a" ? iframeRefA : iframeRefB;
                const isFront = slot === frontSlot;

                const isVisible = isCrossfading ? !isFront : isFront;

                if (!source) return null;

                return (
                  <iframe
                    key={slot}
                    ref={iframeRef}
                    src={source}
                    className={`preview-frame ${isVisible ? "preview-frame--visible" : "preview-frame--hidden"} ${isCrossfading ? "preview-frame--crossfading" : ""}`}
                    style={{
                      height: frameHeight ? `${frameHeight}px` : "0px",
                    }}
                    scrolling="no"
                  />
                );
              })}
            </div>

            <p className="widget-description">
              {widgetTypes.find((w) => w.key === activeType)!.description}
            </p>

            <div className="settings-panel">
              <div>
                <div className="settings-label">Style</div>
                <div className="pill-row">
                  {styleOptions.map((styleOption) => (
                    <button
                      key={styleOption.key}
                      className={`pill-btn${widgetStyles[activeType] === styleOption.key ? " pill-btn--active" : ""}`}
                      onClick={() =>
                        setWidgetStyles((prev) => ({
                          ...prev,
                          [activeType]: styleOption.key,
                        }))
                      }
                    >
                      {styleOption.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-group">
                  <div className="settings-label">Theme</div>
                  <div className="pill-row">
                    {(["light", "dark"] as const).map((themeOption) => (
                      <button
                        key={themeOption}
                        className={`pill-btn${theme === themeOption ? " pill-btn--active" : ""}`}
                        onClick={() => setTheme(themeOption)}
                      >
                        {themeOption}
                      </button>
                    ))}
                  </div>
                </div>

                {activeType === "spotify" && (
                  <div className="settings-group">
                    <div className="settings-label">Lyrics</div>
                    <button
                      className={`toggle-btn${isExpanded ? " toggle-btn--on" : ""}`}
                      onClick={() => setIsExpanded((prev) => !prev)}
                    >
                      <span
                        className={`toggle-dot${isExpanded ? " toggle-dot--on" : ""}`}
                      />
                      {isExpanded ? "On" : "Off"}
                    </button>
                  </div>
                )}

                {activeType === "spotify" && (
                  <div className="settings-group">
                    <div className="settings-label">Progress bar</div>
                    <button
                      className={`visibility-btn${hideProgressBar ? " visibility-btn--hidden" : ""}`}
                      onClick={() => setHideProgressBar((prev) => !prev)}
                    >
                      {hideProgressBar ? "Hidden" : "Visible"}
                    </button>
                  </div>
                )}

                <div className="settings-group settings-group--grow">
                  <div className="settings-label">Font</div>
                  <FontPicker value={fontSlug} onChange={setFontSlug} />
                </div>
              </div>

              <div className="settings-row">
                <ColorInput
                  label="Background"
                  value={bgColor}
                  onChange={setBgColor}
                />
                <ColorInput
                  label="Text"
                  value={textColor}
                  onChange={setTextColor}
                />
                <div className="settings-group">
                  <div className="settings-label">Watermark</div>
                  <button
                    className={`visibility-btn watermark-btn${hideIcon ? " visibility-btn--hidden" : ""}`}
                    onClick={() => setHideIcon((prev) => !prev)}
                  >
                    {hideIcon ? "Hidden" : "Visible"}
                  </button>
                </div>
              </div>
            </div>

            <div className="url-row">
              <div className="url-display">{widgetUrl}</div>
              <button
                className={`copy-btn${isCopied ? " copy-btn--copied" : ""}`}
                onClick={handleCopyUrl}
              >
                {isCopied ? "Copied!" : "Copy URL"}
              </button>
            </div>
          </div>
        )}

        <div className="footer-section">
          <div>
            <h2 className="section-title">How it works</h2>
            <Accordion items={faqItems} />
          </div>

          <div>
            <h2 className="section-title">Built with</h2>
            <div className="credits-list">
              {creditLinks.map((credit) => (
                <a
                  key={credit.name}
                  href={credit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credit-card"
                >
                  <div>
                    <div className="credit-name">{credit.name}</div>
                    <div className="credit-desc">{credit.description}</div>
                  </div>
                  <svg
                    className="credit-arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3f3f46"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<{ contributors: Contributor[] }> = async () => {
  try {
    const res = await fetch("https://api.github.com/repos/uhKieran/lanyard-widgets/contributors", {
      headers: { Accept: "application/vnd.github+json" },
    });
    const contributors: Contributor[] = res.ok ? await res.json() : [];
    return { props: { contributors }, revalidate: 3600 };
  } catch {
    return { props: { contributors: [] }, revalidate: 3600 };
  }
};
