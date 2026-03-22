// Firebase configuration template
// Rename to firebase.config.js and add your credentials

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "1:000000000000:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX",
};

// Initialize Firebase Auth Custom Claims for Role-Based Access
// Run this in a secure backend function or Firebase Console
export const setUserRole = async (uid, role) => {
  // This should be called via an admin SDK in your backend
  // Example:
  // admin.auth().setCustomUserClaims(uid, { role: 'store_manager' })
};
