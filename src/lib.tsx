import register from 'preact-custom-element'
import { DownloadWidget } from './DownloadWidget'
import css from './widget.css?inline'

// Inject CSS once into document.head. No Shadow DOM — we use Tailwind
// utilities scoped to .aw-download-scope, same convention as the auth
// and cabinet widgets, and Shadow DOM would force consumers to copy
// the style block themselves.
const STYLE_ID = 'anubis-download-styles'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const el = document.createElement('style')
    el.id = STYLE_ID
    el.textContent = css
    document.head.appendChild(el)
}

register(
    DownloadWidget as any,
    'anubis-download',
    ['repo', 'lang', 'github-token'],
    { shadow: false },
)
