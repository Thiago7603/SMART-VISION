// infra/fetchWorkoutData.js
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { subDays, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { app } from '../Firebase/Firebaseconfig';

export const fetchWorkoutData = async (userId) => {
  if (!userId) throw new Error('Usuario no autenticado');

  const db = getFirestore(app);
  const workoutsRef = collection(db, 'workouts');
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6);
  const dateRange = eachDayOfInterval({ start: sevenDaysAgo, end: today });

  const initialData = dateRange.map(date => ({
    date,
    day: format(date, 'EEE', { locale: es }).slice(0, 3),
    reps: 0,
    exercises: 0,
    duration: 0
  }));

  const q = query(
    workoutsRef,
    where('userId', '==', userId),
    where('date', '>=', sevenDaysAgo),
    where('date', '<=', today)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    const workout = doc.data();
    const workoutDate = workout.date.toDate();

    const dayIndex = initialData.findIndex(day => isSameDay(day.date, workoutDate));
    if (dayIndex !== -1) {
      initialData[dayIndex].reps += workout.reps || 0;
      initialData[dayIndex].exercises += workout.exercises || 0;
      initialData[dayIndex].duration += workout.duration || 0;
    }
  });

  return initialData;
};
