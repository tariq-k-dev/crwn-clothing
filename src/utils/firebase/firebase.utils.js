import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBTniIkdD-Ezw231sGRwHzI1EkDLhpViCM',
  authDomain: 'crwn-clothing-db-dfe6d.firebaseapp.com',
  projectId: 'crwn-clothing-db-dfe6d',
  storageBucket: 'crwn-clothing-db-dfe6d.appspot.com',
  messagingSenderId: '415182164534',
  appId: '1:415182164534:web:df9c2606fcce7d0ca17e97',
};

// const firebaseApp = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Google Auth sign in
export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

// Firestore DB
export const db = getFirestore();
export const createUserDocumentFromAuth = async userAuth => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.error('error creating the user:', error.message);
    }

    return userDocRef;
  }
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};
