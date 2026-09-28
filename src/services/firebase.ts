/**
 * @license
 * GRAM-DISHA — Firebase SDK & Firestore Service Initializer
 * Connected to Firebase Project: gram-disha (Project #668076081455)
 * Cloud Firestore Database: (default) in region asia-south1
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Authentic Firebase configuration provisioned directly from Firebase for project: gram-disha
const metaEnv = (typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string> }).env : undefined) || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyBXl3_tvqJKpv5o2Ki5tSmPyYEpPjKaWu8",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "gram-disha.firebaseapp.com",
  projectId: "gram-disha",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "gram-disha.firebasestorage.app",
  messagingSenderId: "668076081455",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:668076081455:web:03877d18f40fdda21d21da",
  measurementId: "G-8XV30W80DT"
};

// Initialize Firebase Application (singleton pattern)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Connect directly to the default Cloud Firestore database in asia-south1
export const db = getFirestore(app);

// Google Auth Provider helper
export const googleAuthProvider = new GoogleAuthProvider();

export { signInWithCredential, GoogleAuthProvider };

