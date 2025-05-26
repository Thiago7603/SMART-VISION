import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { app } from './Firebaseconfig';

const auth = getAuth(app);

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const sendResetPasswordEmail = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const getAuthInstance = () => auth;
