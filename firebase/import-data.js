// Script to populate Firestore with sample data
// Run: node firebase/import-data.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import sampleData from './sample-data.json' with { type: 'json' };

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBBi17UlQHIM3MJXgt_FBhLEWR0Rm0wy50',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'marketdekho-90910973-9ec12.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'marketdekho-90910973-9ec12',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'marketdekho-90910973-9ec12.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '331141271428',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:331141271428:web:cd22cca0839ee1220257d1',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importData() {
  console.log('🚀 Starting data import to Firestore...\n');

  try {
    const auth = getAuth(app);
    console.log('🔐 Signing in as admin...');
    await signInWithEmailAndPassword(auth, 'admin@mall.com', 'admin123');
    console.log('✅ Signed in successfully\n');

    // Import products
    if (sampleData.products && sampleData.products.length > 0) {
      console.log(`📦 Importing ${sampleData.products.length} products...`);
      for (const product of sampleData.products) {
        await addDoc(collection(db, 'products'), product);
      }
      console.log('✅ Products imported successfully\n');
    }

    // Import categories
    if (sampleData.categories && sampleData.categories.length > 0) {
      console.log(`📂 Importing ${sampleData.categories.length} categories...`);
      for (const category of sampleData.categories) {
        await addDoc(collection(db, 'categories'), category);
      }
      console.log('✅ Categories imported successfully\n');
    }

    // Import stores
    if (sampleData.stores && sampleData.stores.length > 0) {
      console.log(`🏪 Importing ${sampleData.stores.length} stores...`);
      for (const store of sampleData.stores) {
        await addDoc(collection(db, 'stores'), store);
      }
      console.log('✅ Stores imported successfully\n');
    }

    // Import suppliers
    if (sampleData.suppliers && sampleData.suppliers.length > 0) {
      console.log(`🚚 Importing ${sampleData.suppliers.length} suppliers...`);
      for (const supplier of sampleData.suppliers) {
        await addDoc(collection(db, 'suppliers'), supplier);
      }
      console.log('✅ Suppliers imported successfully\n');
    }

    // Note: Empty collections (orders, sales, logs) will be auto-created when first data is added
    console.log('📝 Empty collections (orders, sales, logs) ready for data\n');

    console.log('✨ All data imported successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to Firebase Console → Firestore Rules');
    console.log('2. Copy and paste the rules from FIRESTORE_SETUP.md');
    console.log('3. Create users in Firebase Auth');
    console.log('4. Visit: https://marketdekho-90910973-9ec12.web.app');
    console.log('5. Login with: admin@mall.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
}

importData();
