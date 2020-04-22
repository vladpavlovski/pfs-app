import React from 'react'
import Loadable from 'react-loadable'
import getMenuItems from './menuItems'
import LoadingComponent from '../components/LoadingComponent'
import locales from './locales'
import routes from './routes'
import themes from './themes'
import grants from './grants'
import parseLanguages from 'rmw-shell/lib/utils/localeTools'

const Loading = () => <LoadingComponent />

const LPAsync = Loadable({
  loader: () => import('../../src/pages/LandingPage'),
  loading: Loading,
})

const config = {
  firebase_config: {
    apiKey: 'AIzaSyCYDhXr_d_T1lF-CpzdRaB-yfhNT5tShPQ',
    authDomain: 'pfs-app-prod.firebaseapp.com',
    databaseURL: 'https://pfs-app-prod.firebaseio.com',
    projectId: 'pfs-app-prod',
    storageBucket: 'pfs-app-prod.appspot.com',
    messagingSenderId: '442919138760',
    appId: '1:442919138760:web:e67396b0f3b3561d1efcfd',
    measurementId: 'G-6VCSLDBPCQ',
  },
  firebase_config_dev: {
    apiKey: 'AIzaSyB6Y4XaeMt8PU2UiXYJbnKpM9eCbUnfB3Q',
    authDomain: 'pfs-app-development.firebaseapp.com',
    databaseURL: 'https://pfs-app-development.firebaseio.com',
    projectId: 'pfs-app-development',
    storageBucket: 'pfs-app-development.appspot.com',
    messagingSenderId: '216168336170',
    appId: '1:216168336170:web:959ef1eb00a58b9db5ec53',
    measurementId: 'G-V6WWYR4658',
  },
  firebase_providers: ['google.com', 'password', 'phone'],
  googleMaps: {
    apiKey: 'AIzaSyByMSTTLt1Mf_4K1J9necAbw2NPDu2WD7g',
  },
  initial_state: {
    themeSource: {
      isNightModeOn: false,
      source: 'light',
    },
    locale: parseLanguages(['en', 'bs', 'es', 'ru', 'de'], 'en'),
  },
  drawer_width: 256,
  locales,
  themes,
  grants,
  routes,
  getMenuItems,
  firebaseLoad: () => import('./firebase'),
  landingPage: LPAsync,
}

export default config
