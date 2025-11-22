/**
 * Admin Account Setup Script
 * Run this once to create the admin account in Firebase
 * 
 * Usage: node setup-admin.js
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminAccount() {
  const ADMIN_EMAIL = 'admin@email.com';
  const ADMIN_PASSWORD = '123456';
  const ADMIN_NAME = 'Administrator';

  try {
    console.log('Creating admin account...');
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );
    
    const user = userCredential.user;
    console.log('✓ Admin user created in Firebase Auth:', user.uid);

    // Create admin document in Firestore
    const adminData = {
      id: user.uid,
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: 'admin',
      phone: '',
      avatarUrl: `https://picsum.photos/seed/admin/100/100`,
      listingsCount: 0,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', user.uid), adminData);
    console.log('✓ Admin document created in Firestore');
    
    console.log('\n✅ Admin account created successfully!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('\nYou can now login at http://localhost:9002/login');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('✓ Admin account already exists');
      console.log('Email:', ADMIN_EMAIL);
      console.log('Password:', ADMIN_PASSWORD);
      process.exit(0);
    } else {
      console.error('❌ Error creating admin account:', error);
      process.exit(1);
    }
  }
}

createAdminAccount();
