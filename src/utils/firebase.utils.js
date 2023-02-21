import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
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
const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account',
});

// Google Auth sign in
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

// Firestore DB
export const db = getFirestore();
export const createUserDocumentFromAuth = async userAuth => {
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
