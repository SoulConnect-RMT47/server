const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// TODO: Ganti dengan konfigurasi proyek Firebase Anda
// Lihat: https://support.google.com/firebase/answer/7015592
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Cloud Firestore dan dapatkan referensi ke layanan
const firebaseDB = getFirestore(app);
module.exports = firebaseDB;

