// Dev entry — mount the widget directly so `npm run dev` shows the
// download cards.
import { render } from 'preact'
import './lib'

const el = document.createElement('anubis-download')
el.setAttribute('repo', 'damanoreshkan-beep/anubis-launcher')
el.setAttribute('lang', 'uk')
document.body.style.padding = '32px'
document.body.style.background = '#040309'
document.body.appendChild(el)

void render
