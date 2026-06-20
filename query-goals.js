// Run with: node query-goals.js
// Equivalent of: SELECT * FROM goals

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAvjgSCNRCuGEBIa0Cs0GH-vrdHazcGnU8",
  authDomain: "goal-tracker-8dd96.firebaseapp.com",
  projectId: "goal-tracker-8dd96",
  storageBucket: "goal-tracker-8dd96.firebasestorage.app",
  messagingSenderId: "415791749661",
  appId: "1:415791749661:web:b0457abdb7e33e5ed284f4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function selectAllGoals() {
  console.log('Running: SELECT * FROM goals\n');
  console.log('='.repeat(80));

  const snapshot = await getDocs(collection(db, 'goals'));

  if (snapshot.empty) {
    console.log('No records found.');
    process.exit(0);
  }

  const goals = [];
  snapshot.forEach((doc) => {
    goals.push({ id: doc.id, ...doc.data() });
  });

  // Print as table
  console.table(goals.map(g => ({
    id:         g.id,
    userId:     g.userId?.substring(0, 10) + '...',
    title:      g.title,
    category:   g.category,
    priority:   g.priority,
    status:     g.status,
    is_active:  g.is_active,
    created_at: g.created_at?.toDate?.().toLocaleString() ?? g.created_at,
  })));

  console.log(`\nTotal rows: ${goals.length}`);
  process.exit(0);
}

selectAllGoals().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
