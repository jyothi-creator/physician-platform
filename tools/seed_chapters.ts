import "dotenv/config"; // 👈 THIS is the fix

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error("❌ Firebase env vars not loaded. Check .env.local location.");
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const chapters = [
  { id: "ch1", order: 1, title: "Naming the Problem" },
  { id: "ch2", order: 2, title: "Influence of Women on the System" },
  { id: "ch3", order: 3, title: "Influence of the System on Women" },
  { id: "ch4", order: 4, title: "The System We Inherited" },
  { id: "ch5", order: 5, title: "The Weight of Expectations" },
  { id: "ch6", order: 6, title: "The Culture of Silence" },
  { id: "ch7", order: 7, title: "Life Stages and Transitions" },
  { id: "ch8", order: 8, title: "The Pandemic and Its Aftermath" },
  { id: "ch9", order: 9, title: "Leading for Change" },
  { id: "ch10", order: 10, title: "Reimagining Work in Medicine" },
  { id: "ch11", order: 11, title: "Building Community and Connection" },
  { id: "ch12", order: 12, title: "Pathways to Renewal" },
  { id: "ch13", order: 13, title: "Toward a Healthier Future" },
];

async function seed() {
  for (const ch of chapters) {
    await setDoc(doc(collection(db, "chapters"), ch.id), {
      title: ch.title,
      order: ch.order,
      published: true,
      createdAt: Timestamp.now(),
    });
  }

  console.log("✅ Chapters seeded successfully");
}

seed().catch(console.error);
