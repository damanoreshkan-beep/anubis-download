# anubis-download

Auto-updating download card for the **Anubis World** launcher. Renders the latest GitHub release as three primary platform cards (Windows installer, Linux AppImage, Arch Linux pacman package) plus a collapsible "Other formats" row. Drop-in web component for any host page (partner site, launcher's own changelog, anywhere).

Sister to [`anubis-auth-widget`](https://github.com/damanoreshkan-beep/anubis-auth-widget), [`anubis-cabinet`](https://github.com/damanoreshkan-beep/anubis-cabinet), and [`anubis-payments`](https://github.com/damanoreshkan-beep/anubis-payments). Same design system, same shared-Supabase-client convention (though this widget doesn't actually touch Supabase).

## Embed

```html
<script type="module" src="https://damanoreshkan-beep.github.io/anubis-download/anubis-download.js"></script>

<anubis-download
  repo="damanoreshkan-beep/anubis-launcher"
  lang="uk"
></anubis-download>
```

Attributes:

| | |
|---|---|
| `repo` | GitHub repo in `owner/name` form. Required. |
| `lang` | `en` · `ru` · `uk` · `de` · `pl` (defaults to `en`). |
| `github-token` | Optional bearer token to raise the rate limit (5 000/h authenticated vs 60/h anon). Almost never needed for a public site — the cache below avoids hammering the API. |

## What it does

* Fetches `GET /repos/{repo}/releases/latest` from the GitHub REST API.
* Groups the assets into primary buckets (Windows · Linux AppImage · Arch Linux pacman) plus a "Other formats" overflow (tar.gz, future macOS, etc.).
* Hides auto-updater metadata files automatically (`latest*.yml`, `*.blockmap`, `builder-debug.yml`).
* Detects the visitor's OS / distro from `navigator.userAgent` and highlights the matching card with a violet halo + a "Detected: …" hint underneath. Auto-detect is a suggestion, never a filter — every platform stays clickable.
* Caches the API response in `localStorage` for 1 hour. First paint after a revisit happens before the network call returns; the call still runs to refresh the cache silently.
* Falls back to a "GitHub Releases" link if the fetch fails entirely.

## Asset detection

| Filename pattern | Bucket |
|---|---|
| `*.exe` (excluding `.blockmap`) | Windows |
| `*.AppImage` | Linux (AppImage) |
| `*.pacman` · `*.pkg.tar.zst` | Arch Linux |
| `*.tar.gz` · `*.tgz` | Other formats |
| `*.dmg` · `*.zip` (with `mac`/`darwin`/`osx` in the name) | macOS (when present) |
| `latest*.yml` · `*.blockmap` · `builder-debug.yml` | Hidden (auto-updater metadata) |

## Icons

Brand icons (Windows · Linux Tux · Arch Linux · Apple) are copied verbatim from [simple-icons.org](https://simpleicons.org) — the same set the partner site uses for its Discord / Telegram / YouTube community cards. No npm dependency on the icon set; the four needed paths live as constants in `src/DownloadWidget.tsx`.

## Build from source

Requires Node 22.

```bash
git clone https://github.com/damanoreshkan-beep/anubis-download.git
cd anubis-download
npm ci
npm run dev          # vite dev server with auto-mounted <anubis-download>
npm run build        # → dist/anubis-download.js (single ES module, CSS inlined)
```

A push to `main` triggers `.github/workflows/deploy.yml` which republishes the bundle to GitHub Pages at https://damanoreshkan-beep.github.io/anubis-download/anubis-download.js.

## CSS isolation

Same scoping pattern as the auth and cabinet widgets. Tailwind's `important: '.aw-download-scope'` config wraps every utility selector with that ancestor. Custom rules in `src/widget.css` are prefixed manually. `scripts/scope-tailwind-globals.js` rewrites Tailwind's `*, :before, :after` and `::backdrop` resets so they don't reset host-page CSS variables.

## Locales

5 locales live as a single `COPY` object in `src/locales.ts`. Adding a key requires updating every locale at once. Missing keys fall through to `en`.
