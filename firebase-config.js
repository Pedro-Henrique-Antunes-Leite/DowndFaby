// Configuração do Firebase para web app (substitua se necessário)
const firebaseConfig = {
  apiKey: "AIzaSyDueH4U3FLmSVFMXB3bi8ELBQpWFZOcF20",
  authDomain: "downdfaby.firebaseapp.com",
  projectId: "downdfaby",
  storageBucket: "downdfaby.firebasestorage.app",
  messagingSenderId: "404852217181",
  appId: "1:404852217181:web:ce68d37ee7968c9a74c4b4",
  measurementId: "G-RE3T95NPHW"
};

if (window.firebase) {
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  window.auth = firebase.auth ? firebase.auth() : null;
  window.db = firebase.firestore ? firebase.firestore() : null;

  console.log('Firebase SDK presente:', !!window.firebase);
  console.log('firebase.apps.length =', (firebase.apps && firebase.apps.length) || 0);
  try {
    console.log('Firebase app options:', firebase.app().options);
  } catch (e) {
    console.warn('Não foi possível ler firebase.app().options', e);
  }
  console.log('auth object?', !!window.auth, 'db object?', !!window.db);
} else {
  console.warn('Firebase SDK não encontrado. Verifique a ordem dos <script> no index.html.');
}