import en_messages from './en'
import de_messages from './de'
import ru_messages from './ru'
import bs_messages from './bs'
import es_messages from './es'
import fr_messages from './fr'
import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/dist/locale-data/de'
import '@formatjs/intl-relativetimeformat/dist/locale-data/en'
import '@formatjs/intl-relativetimeformat/dist/locale-data/ru'
import '@formatjs/intl-relativetimeformat/dist/locale-data/bs'
import '@formatjs/intl-relativetimeformat/dist/locale-data/es'
import '@formatjs/intl-relativetimeformat/dist/locale-data/fr'

import areIntlLocalesSupported from 'intl-locales-supported'
import intl from 'intl'

// START: Intl polyfill
// Required for working on Safari
// Code from here: https://formatjs.io/guides/runtime-environments/
let localesMyAppSupports = [
  /* list locales here */
]

if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(localesMyAppSupports)) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and replace the constructors with need with the polyfill's.
    let IntlPolyfill = intl
    Intl.NumberFormat = IntlPolyfill.NumberFormat
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
  }
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = intl
}
// END: Intl polyfill

const locales = [
  {
    locale: 'en',
    messages: en_messages,
  },
  {
    locale: 'de',
    messages: de_messages,
  },
  {
    locale: 'bs',
    messages: bs_messages,
  },
  {
    locale: 'ru',
    messages: ru_messages,
  },
  {
    locale: 'es',
    messages: es_messages,
  },
  {
    locale: 'fr',
    messages: fr_messages,
  },
]

export function getLocaleMessages(l, ls) {
  if (ls) {
    for (let i = 0; i < ls.length; i++) {
      if (ls[i]['locale'] === l) {
        return ls[i]['messages']
      }
    }
  }

  return en_messages // Default locale
}

export default locales
