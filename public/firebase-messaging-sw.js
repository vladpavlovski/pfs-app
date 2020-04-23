/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-messaging.js')

firebase.initializeApp({
  apiKey: 'AIzaSyB6Y4XaeMt8PU2UiXYJbnKpM9eCbUnfB3Q',
  authDomain: 'pfs-app-development.firebaseapp.com',
  databaseURL: 'https://pfs-app-development.firebaseio.com',
  projectId: 'pfs-app-development',
  storageBucket: 'pfs-app-development.appspot.com',
  messagingSenderId: '216168336170',
  appId: '1:216168336170:web:959ef1eb00a58b9db5ec53',
  measurementId: 'G-V6WWYR4658',
})

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )
  // Customize notification here
  const notificationTitle = 'Background Message Title'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/apple-touch-icon.png',
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  )
})
