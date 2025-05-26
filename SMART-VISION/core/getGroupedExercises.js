import { getExercises } from '../infra/Firebase/excerciseRepository';

export const getGroupedExercises = async () => {
  const exercises = await getExercises()

  const categories = [...new Set(exercises.map(ex => ex.category))]

  return categories.map(category => ({
    category,
    exercises: exercises.filter(ex => ex.category === category)
  }))
}
