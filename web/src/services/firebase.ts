
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0RR7g3dL88cuc20f99jjkDZWAGSB4iO8",
  authDomain: "diamondapp-942d6.firebaseapp.com",
  projectId: "diamondapp-942d6",
  storageBucket: "diamondapp-942d6.appspot.com",
  messagingSenderId: "635107220608",
  appId: "1:635107220608:web:b0441c916f20eeb56ada65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
