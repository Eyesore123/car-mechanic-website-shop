const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'http://localhost:8080', // Firestore emulator URL
});

const db = admin.firestore();
db.settings({
  host: 'localhost:8080',
  ssl: false,
});

// Read seed data from JSON file
const seedDataPath = path.resolve(__dirname, 'seed-data.json');
try {
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
  console.log(seedData);
} catch (error) {
  console.error(`Error reading JSON file: ${error.message}`);
  console.error(`File contents: ${fs.readFileSync(seedDataPath, 'utf8')}`);
}

// Function to seed Firestore
async function seedFirestore() {
  const batch = db.batch();

  // Add each document to the batch
  seedData.forEach((doc) => {
    const docRef = db.collection('orders').doc(doc.orderID);
    batch.set(docRef, doc);
  });

  // Commit the batch
  await batch.commit();
  console.log('Firestore seeding completed.');
}

// Run the seed function
seedFirestore().catch((error) => {
  console.error('Error seeding Firestore:', error);
});