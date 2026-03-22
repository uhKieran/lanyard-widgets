/**
 * Base page-level styles injected into each widget's <Head>.
 * Isolates widget pages from the home page body/html styles.
 */
export const widgetPageCss = `
@font-face {
  font-family: 'Montreal';
  src: url('/PPNeueMontreal-Medium.otf') format('opentype');
  font-weight: 500;
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html, body { background: transparent; overflow: hidden; }
body { padding: 12px; font-family: 'Montreal', sans-serif; }
`.trim();

/**
 * Builds a dynamic <style> string for per-widget CSS overrides.
 * Covers background, text, timestamp colours, and watermark visibility.
 */
export function buildWidgetOverrideCss(
  bgHex?: string,
  textHex?: string,
  hideIcon?: boolean,
  width?: number,
  height?: number,
): string {
  const rules: string[] = [];

  if (bgHex) {
    rules.push(`.card { background: #${bgHex} !important; }`);
  }
  if (textHex) {
    rules.push(`.song-name { color: #${textHex} !important; }`);
    rules.push(`.artist-album { color: #${textHex}a6 !important; }`);
    rules.push(`.timestamps { color: #${textHex}66 !important; }`);
  }
  if (hideIcon) {
    rules.push(`.bg-logo { display: none; }`);
  }
  if (width) {
    rules.push(`.card { width: ${width}px !important; max-width: none !important; }`);
  }
  if (height) {
    rules.push(`.card { height: ${height}px !important; overflow: hidden; }`);
  }

  return rules.join("\n");
}

/**
 * Converts a Fontshare slug (e.g. "general-sans") into a CSS font-family name
 * (e.g. "General Sans").
 */
export function fontSlugToFamilyName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
