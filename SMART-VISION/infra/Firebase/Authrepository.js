import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './../Firebase/Firebaseconfig';

export const registerWithEmail = async (fullName, email, password, gender) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      fullName,
      gender,
      createdAt: new Date()
    });
  } catch (error) {
    throw error;
  }
};
