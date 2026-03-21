# lanyard.kie.ac

Customisable, embeddable Discord-presence widgets powered by [Lanyard](https://discord.gg/UrXF2cfJ7F). Drop a widget URL into OBS, Streamlabs, or any website to show your live Spotify track, Discord status, or current game activity.

---

## Widgets

| Type | Route | Shows |
|------|-------|-------|
| **Spotify** | `/spotify/:userId` | Now-playing track, album art, progress bar, optional synced lyrics |
| **Discord** | `/discord/:userId` | Avatar, online status, custom status, current game |
| **Activities** | `/activities/:userId` | Current game with icon and elapsed time |

---

## Usage

### 1. Find your Discord user ID

Enable **Developer Mode** in Discord (`Settings → Advanced → Developer Mode`), then right-click your profile and select **Copy User ID**.

### 2. Join the Lanyard server

Lanyard reads your presence data. You must be a member of the [Lanyard Discord server](https://discord.gg/UrXF2cfJ7F) for the bot to see your status.

### 3. Generate a widget URL

Visit [lanyard.kie.ac](https://lanyard.kie.ac), enter your user ID, pick a widget type, and customise it with the settings panel. Your URL is built in real time.

```
https://lanyard.kie.ac/spotify/YOUR_USER_ID?theme=dark&font=satoshi
```

### 4. Embed it

**OBS / Streamlabs** — Add a **Browser Source**, paste the URL, set the width to `~420px`, and leave the height at `0` (the widget reports its own height via `postMessage`).

**HTML** — Drop it in an `<iframe>`:

```html
<iframe
  src="https://lanyard.kie.ac/spotify/YOUR_USER_ID?theme=dark"
  style="border: none; width: 420px; height: 120px;"
></iframe>
```

---

## Query parameters

All widgets accept these parameters:

| Parameter | Values | Description |
|-----------|--------|-------------|
| `theme` | `light` \| `dark` | Widget colour scheme |
| `font` | Fontshare slug (e.g. `satoshi`) | Override font |
| `style` | `default` \| `blurred` \| `minimal` \| `compact` | Visual style variant |
| `bg` | 6-digit hex (e.g. `1a1a2e`) | Background colour override |
| `color` | 6-digit hex | Text colour override |
| `noicon` | `1` | Hide the watermark logo |

Spotify only:

| Parameter | Values | Description |
|-----------|--------|-------------|
| `expanded` | `true` | Show synced lyrics panel |
| `nobar` | `1` | Hide the progress bar |

---

## Tech stack

- [Next.js](https://nextjs.org) — Pages Router
- [Lanyard API](https://discord.gg/UrXF2cfJ7F) — WebSocket presence data
- [lrclib.net](https://lrclib.net) — Synced lyrics (proxied via `/api/lyrics`)
- [Fontshare](https://www.fontshare.com) — Font CDN

---

## Contributing

```bash
git clone https://github.com/uhKieran/lanyard.git
cd lanyard
bun install
bun dev
```

The dev server starts at `http://localhost:3000`.

**Project layout**

```
components/
  Accordion.tsx          FAQ accordion
  ColorInput.tsx         Colour picker with HSV picker popover
  FontPicker.tsx         Fontshare font selector
  widgets/
    SpotifyWidget.tsx    Spotify presence widget
    DiscordWidget.tsx    Discord status widget
    ActivitiesWidget.tsx Game activity widget
lib/
  fonts.ts               Fontshare font list & URL builder
  lyricsUtils.ts         LRC parser & time formatter
  useLanyardSocket.ts    Lanyard WebSocket hook
  useWidgetSetup.ts      Height reporter & dark-theme hooks
  useWidgetVisibility.ts Show/exit animation hook
  widgetUtils.ts         CSS override builder & font slug converter
pages/
  index.tsx              Homepage & widget configurator
  [type]/[userId].tsx    Widget dispatcher (loads correct widget by type)
  api/lyrics.ts          Lyrics proxy to lrclib.net
styles/
  globals.css            Reset + home page styles
  widget.css             All widget styles (base + per-widget)
```

**Adding a new widget type**

1. Create `components/widgets/YourWidget.tsx` — use `useRouter()` to read `query.userId` and any other query params.
2. Add an entry to `widgetMap` in `pages/[type]/[userId].tsx`.
3. Add the widget type to `WIDGET_TYPES` in `pages/index.tsx`.
4. Add any widget-specific CSS to `styles/widget.css`, scoped under `.widget-your-type`.

Pull requests are welcome. Please keep components clean and comment-free in TSX files; comments belong in `lib/` files only.
