// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMRXTBSLRyeWkAw1KegOkokAHwlHKwenM",
  authDomain: "studio-6206919014-a31aa.firebaseapp.com",
  projectId: "studio-6206919014-a31aa",
  storageBucket: "studio-6206919014-a31aa.appspot.com",
  messagingSenderId: "298866475970",
  appId: "1:298866475970:web:e7b485559a5d9a2e38cc5b"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
