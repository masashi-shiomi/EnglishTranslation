"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { signInAnonymously, getAuth } from "firebase/auth";
import { doc, getFirestore, runTransaction, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export async function signInAnonymouslyAndCreateUser() {
  const credential = await signInAnonymously(auth);
  const userRef = doc(db, "users", credential.user.uid);

  await runTransaction(db, async (transaction) => {
    const userSnapshot = await transaction.get(userRef);

    if (!userSnapshot.exists()) {
      transaction.set(userRef, {
        uid: credential.user.uid,
        created: serverTimestamp(),
      });
    }
  });

  return credential.user;
}