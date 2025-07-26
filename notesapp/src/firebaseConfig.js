
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCW3LvopXZpoFzQToPs0oBCmsKcg5CTtQc",
  authDomain: "notesapp-56a38.firebaseapp.com",
  projectId: "notesapp-56a38",
  storageBucket: "notesapp-56a38.firebasestorage.app",
  messagingSenderId: "503851149788",
  appId: "1:503851149788:web:bafd3128c4153f71b70719",
  measurementId: "G-XJXEV3CZBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app, analytics  };
