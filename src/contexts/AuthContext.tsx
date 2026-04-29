import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

interface UserProfile {
  uid: string;
  username: string;
  email: string;
  avatarUrl: string;
  gender: string;
  isUploader: boolean;
  totalVotesReceived: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isWhitelisted: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    let unsubWhitelist: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Cleanup existing listeners on auth change
      if (unsubProfile) { unsubProfile(); unsubProfile = null; }
      if (unsubWhitelist) { unsubWhitelist(); unsubWhitelist = null; }

      setUser(user);
      
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          // Initial profile fetch
          let currentUserDoc = await getDoc(userDocRef);
          let currentUserData = currentUserDoc.data() as UserProfile | undefined;

          if (!currentUserDoc.exists()) {
            const newProfile = {
              uid: user.uid,
              // If user joined via Email, the displayName might be empty. But if they set it during signup, it'll be mapped later
              username: user.displayName || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              avatarUrl: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
              gender: 'prefer_not_to_say',
              isUploader: false,
              totalVotesReceived: 0,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile as UserProfile);
            currentUserData = newProfile as UserProfile;
          } else {
            setProfile(currentUserData!);
          }

          // Real-time profile updates
          unsubProfile = onSnapshot(userDocRef, (doc) => {
            if (doc.exists() && auth.currentUser?.uid === user.uid) {
              setProfile(doc.data() as UserProfile);
            }
          }, (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          });

          // Real-time whitelist updates
          if (user.email) {
            const whitelistRef = doc(db, 'whitelist', user.email);
            unsubWhitelist = onSnapshot(whitelistRef, async (snapshot) => {
              const isAdminEmail = (email: string | null) => 
                email === 'okhaiuri@gmail.com' || 
                email === 'ogboumahokhai@gmail.com' || 
                email?.includes('admin');

              // Ensure boolean type
              const whitelisted = !!(snapshot.exists() || (user.email && isAdminEmail(user.email)));
              setIsWhitelisted(whitelisted);
              
              if (whitelisted && currentUserData && !currentUserData.isUploader) {
                await setDoc(userDocRef, { isUploader: true }, { merge: true });
              }

              if (!snapshot.exists() && isAdminEmail(user.email)) {
                await setDoc(whitelistRef, { email: user.email, addedAt: new Date().toISOString() });
              }
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setProfile(null);
        setIsWhitelisted(false);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
      if (unsubWhitelist) unsubWhitelist();
    };
  }, []);
  
  const loginWithGoogle = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        console.error('Login error:', error);
        throw error;
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isWhitelisted, loginWithGoogle, logout }}>
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
