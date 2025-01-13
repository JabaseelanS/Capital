importScripts('https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.12.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyCAAf2PrE6sDF0vCpCi805Urs8-MQDygfg",
    authDomain: "packapill-consumerapp.firebaseapp.com",
    databaseURL: "https://packapill-consumerapp.firebaseio.com",
    projectId: "packapill-consumerapp",
    storageBucket: "packapill-consumerapp.appspot.com",
    messagingSenderId: "13529015542",
    appId: "1:13529015542:web:0159e88031d66ebb7e78d7",
    measurementId: "G-5YVFBJK6NT"

    // apiKey: "AIzaSyCqM7RFKcEuV1RZyJGJ11nDIrnYsC1dooY",
    // authDomain: "packpharmacy-33b90.firebaseapp.com",
    // databaseURL: "https://packpharmacy-33b90.firebaseio.com",
    // projectId: "packpharmacy-33b90",
    // storageBucket: "packpharmacy-33b90.appspot.com",
    // messagingSenderId: "631764054945",
    // appId: "1:631764054945:web:d8d0bc4c3c78c3b9df91e0",
    // measurementId: "G-R9LJWN63GW"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('Handling background message ', payload);
    debugger
    return self.registration.showNotification(payload.data.title, {
        body: payload.data.body,
        icon: payload.data.icon,
        tag: payload.data.tag,
        data: payload.data.link
    });
});