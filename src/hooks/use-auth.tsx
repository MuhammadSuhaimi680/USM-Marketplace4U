'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'buyer' | 'seller') => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  lastActivityTime: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    setFirebaseUser(firebaseUser);

    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUser(snap.data() as User);
      } else {
        setUser(null); // first login / no profile yet
      }
    } catch (error) {
      console.error("Failed to fetch user doc:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

    

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    setLastActivityTime(Date.now());
  };

  const signUp = async (email: string, password: string, name: string, role: 'buyer' | 'seller') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    const userData: User = {
      id: user.uid,
      name,
      email: user.email!,
      role,
      phone: '',
      avatarUrl: `https://picsum.photos/seed/${user.uid}/100/100`,
      listingsCount: 0,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      const userData: User = {
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email!,
        role: 'buyer',
        phone: '',
        avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
        listingsCount: 0,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', user.uid), userData);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signIn, signUp, signInWithGoogle, signOut, lastActivityTime }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
