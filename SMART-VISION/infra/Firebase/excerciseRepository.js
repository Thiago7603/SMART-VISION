import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { app } from './Firebaseconfig'

export const getExercises = async () => {
  const db = getFirestore(app)
  const exercisesCollection = collection(db, 'exercises')
  const snapshot = await getDocs(exercisesCollection)
  const exercises = []

  snapshot.forEach((doc) => {
    exercises.push({
      id: doc.id,
      ...doc.data()
    })
  })

  return exercises
}
