import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAvjgSCNRCuGEBIa0Cs0GH-vrdHazcGnU8",
  authDomain: "goal-tracker-8dd96.firebaseapp.com",
  projectId: "goal-tracker-8dd96",
  storageBucket: "goal-tracker-8dd96.firebasestorage.app",
  messagingSenderId: "415791749661",
  appId: "1:415791749661:web:b0457abdb7e33e5ed284f4",
  measurementId: "G-9Y9QW14RFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;
