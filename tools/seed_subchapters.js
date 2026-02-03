/**
 * Seed subchapters into Firestore
 * Run once: node tools/seed_subchapters.js
 */

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// 🔐 Update path to your service account key
const serviceAccount = require("../physician-burnout-serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const dataPath = path.join(__dirname, "subchapters.json");
const subchapters = JSON.parse(fs.readFileSync(dataPath, "utf8"));

async function seed() {
  const batch = db.batch();

  subchapters.forEach((sub) => {
    const ref = db.collection("subchapters").doc(); // auto ID
    batch.set(ref, {
      ...sub,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log(`✅ Seeded ${subchapters.length} subchapters`);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
});
