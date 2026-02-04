const admin = require("firebase-admin");
const path = require("path");

// 🔐 point to your service account
const serviceAccount = require(path.resolve(
  __dirname,
  "./physician-burnout-serviceAccount.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Chapter 1 — Naming the Problem
 */
const subchapters = [
  {
    id: "ch1-s1",
    chapterId: "ch1",
    order: 1,
    title: "What Burnout Is — and Is Not",
    content: `
Burnout is not synonymous with weakness, lack of resilience, or failure to cope.
It is a well-described occupational phenomenon resulting from chronic workplace stress
that has not been successfully managed.
`,
  },
  {
    id: "ch1-s2",
    chapterId: "ch1",
    order: 2,
    title: "Why Burnout Is Often Misunderstood",
    content: `
Burnout is often framed as an individual failure rather than a systems issue.
This misframing delays recognition and accountability.
`,
  },
  {
    id: "ch1-s3",
    chapterId: "ch1",
    order: 3,
    title: "Why Naming the Problem Matters",
    content: `
Naming burnout makes shared experience visible and actionable.
Without naming, systemic issues remain individualized and silent.
`,
  },
  {
    id: "ch1-s4",
    chapterId: "ch1",
    order: 4,
    title: "Burnout as a Systems Issue",
    content: "🚧 Draft / Coming Soon",
  },
  {
    id: "ch1-s5",
    chapterId: "ch1",
    order: 5,
    title: "Individual Distress vs Systemic Failure",
    content: "🚧 Draft / Coming Soon",
  },
];

async function seed() {
  const batch = db.batch();

  subchapters.forEach((s) => {
    const ref = db.collection("subchapters").doc(s.id);
    batch.set(ref, {
      chapterId: s.chapterId,
      order: s.order,
      title: s.title,
      content: s.content,
      published: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log("✅ Subchapters seeded using ADMIN SDK");
}

seed().catch(console.error);
