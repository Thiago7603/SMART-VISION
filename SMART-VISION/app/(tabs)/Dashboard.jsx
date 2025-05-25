import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import theme from '../../constants/theme';
import Header from '../../components/dashboard/header';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { app } from './../../infra/Firebase/Firebaseconfig';
import { getAuth } from 'firebase/auth';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

const { width: screenWidth } = Dimensions.get('window');

/**
 * @typedef {Object} WorkoutData
 * @property {*} date
 * @property {number} reps
 * @property {number} exercises
 * @property {number} duration
 * @property {string} userId
 */

export default function Dashboard() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(6);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;

  // Extraer la lógica de obtención de datos a una función reutilizable
  const fetchWorkoutData = async () => {
    try {
      if (!userId) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      const db = getFirestore(app);
      const workoutsRef = collection(db, 'workouts');
      
      // Obtener los últimos 7 días
      const today = new Date();
      const sevenDaysAgo = subDays(today, 6);
      const dateRange = eachDayOfInterval({
        start: sevenDaysAgo,
        end: today
      });

      // Crear estructura inicial con días vacíos
      const initialData = dateRange.map(date => ({
        date,
        day: format(date, 'EEE', { locale: es }).slice(0, 3), // "Lun", "Mar", etc.
        reps: 0,
        exercises: 0,
        duration: 0,
        formattedDuration: "0m"
      }));

      // Consultar workouts del usuario en el rango de fechas
      const q = query(
        workoutsRef,
        where('userId', '==', userId),
        where('date', '>=', sevenDaysAgo),
        where('date', '<=', today)
      );

      const querySnapshot = await getDocs(q);
      
      // Procesar los datos de Firebase
      querySnapshot.forEach(doc => {
        const workoutData = doc.data();
        const workoutDate = workoutData.date.toDate();
        
        // Encontrar el día correspondiente en initialData
        const dayIndex = initialData.findIndex(day => 
          isSameDay(day.date, workoutDate)
        );
        
        if (dayIndex !== -1) {
          initialData[dayIndex].reps += workoutData.reps || 0;
          initialData[dayIndex].exercises += workoutData.exercises || 0;
          initialData[dayIndex].duration += workoutData.duration || 0;
        }
      });

      // Formatear la duración
      const formattedData = initialData.map(day => ({
        ...day,
        formattedDuration: formatDuration(day.duration)
      }));

      setWeeklyData(formattedData);
    } catch (err) {
      console.error("Error fetching workout data:", err);
      setError('Error al cargar los datos de entrenamiento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
  };

  const handleBarPress = ({ index }) => {
    setSelectedDayIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError('');
            fetchWorkoutData();
          }}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (weeklyData.length === 0) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay datos de entrenamiento esta semana</Text>
          <Text style={styles.emptySubText}>Completa tus primeros entrenamientos para ver estadísticas</Text>
        </View>
      </View>
    );
  }

  const selectedDay = weeklyData[selectedDayIndex];
  const prevDay = selectedDayIndex > 0 ? weeklyData[selectedDayIndex - 1] : null;

  const getExerciseDifference = () => {
    if (!prevDay) return null;
    const diff = selectedDay.exercises - prevDay.exercises;
    return {
      value: Math.abs(diff),
      type: diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral',
      symbol: diff > 0 ? '↑' : diff < 0 ? '↓' : '→',
      text: diff > 0 ? 'más' : diff < 0 ? 'menos' : 'igual'
    };
  };

  const getDurationDifference = () => {
    if (!prevDay) return null;
    const diff = selectedDay.duration - prevDay.duration;
    return {
      value: Math.abs(diff),
      type: diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral',
      symbol: diff > 0 ? '↑' : diff < 0 ? '↓' : '→',
      text: diff > 0 ? 'más' : diff < 0 ? 'menos' : 'igual'
    };
  };

  const exerciseDiff = getExerciseDifference();
  const durationDiff = getDurationDifference();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerWrapper}>
          <Header />
        </View>

        {/* Gráfica interactiva */}
        <View style={styles.chartContainer}>
          <View style={styles.contentShadow} />
          <Text style={styles.chartTitle}>Repeticiones diarias</Text>
          
          <Text style={styles.selectedDayText}>
            {selectedDay.day}: {selectedDay.reps} repeticiones
          </Text>

          <BarChart
            data={{
              labels: weeklyData.map(d => d.day),
              datasets: [{
                data: weeklyData.map(d => d.reps),
                colors: weeklyData.map((_, index) => 
                  index === selectedDayIndex 
                    ? () => theme.COLORS.secondary 
                    : () => theme.COLORS.primary
                )
              }]
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: theme.COLORS.white,
              backgroundGradientFrom: theme.COLORS.white,
              backgroundGradientTo: theme.COLORS.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              barPercentage: 0.7,
              propsForBackgroundLines: { strokeWidth: 0 },
            }}
            fromZero
            showBarTops={false}
            withCustomBarColorFromData={true}
            flatColor={true}
            onDataPointClick={handleBarPress}
          />

          {/* Botones de días para navegación alternativa */}
          <View style={styles.dayButtonsContainer}>
            {weeklyData.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  selectedDayIndex === index && styles.selectedDayButton
                ]}
                onPress={() => setSelectedDayIndex(index)}
              >
                <Text style={[
                  styles.dayButtonText,
                  selectedDayIndex === index && styles.selectedDayButtonText
                ]}>
                  {day.day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Paneles inferiores */}
        <View style={styles.rowContainer}>
          {/* Panel de ejercicios */}
          <View style={[styles.dataPanel, styles.halfWidth]}>
            <View style={styles.contentShadow} />
            <Text style={styles.panelTitle}>Ejercicios realizados</Text>
            <Text style={styles.panelValue}>{selectedDay.exercises}</Text>
            {exerciseDiff && (
              <Text style={[
                styles.comparisonText,
                styles[exerciseDiff.type]
              ]}>
                {exerciseDiff.symbol} {exerciseDiff.value > 0 ? exerciseDiff.value : ''} 
                {exerciseDiff.value > 0 ? ` ${exerciseDiff.text} que ${prevDay.day}` : ` Igual que ${prevDay.day}`}
              </Text>
            )}
          </View>

          {/* Panel de duración */}
          <View style={[styles.dataPanel, styles.halfWidth]}>
            <View style={styles.contentShadow} />
            <Text style={styles.panelTitle}>Duración total</Text>
            <Text style={styles.panelValue}>{selectedDay.formattedDuration}</Text>
            {durationDiff && (
              <Text style={[
                styles.comparisonText,
                styles[durationDiff.type]
              ]}>
                {durationDiff.symbol} {durationDiff.value > 0 ? durationDiff.value : ''} 
                {durationDiff.value > 0 ? ` ${durationDiff.text} que ${prevDay.day}` : ` Igual que ${prevDay.day}`}
              </Text>
            )}
          </View>
        </View>

        {/* Panel resumen del día seleccionado */}
        <View style={styles.summaryPanel}>
          <View style={styles.contentShadow} />
          <Text style={styles.summaryTitle}>Resumen del {selectedDay.day}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              📊 {selectedDay.reps} repeticiones totales
            </Text>
            <Text style={styles.summaryText}>
              💪 {selectedDay.exercises} ejercicios diferentes
            </Text>
            <Text style={styles.summaryText}>
              ⏱️ {selectedDay.formattedDuration} de entrenamiento
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: theme.COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  chartContainer: {
    backgroundColor: theme.COLORS.primary + '20',
    borderRadius: 40,
    padding: 15,
    margin: 10,
    width: '95%',
    alignItems: 'center',
  },
  dataPanel: {
    backgroundColor: theme.COLORS.primary + '20',
    borderRadius: 40,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  summaryPanel: {
    backgroundColor: theme.COLORS.secondary + '15',
    borderRadius: 40,
    padding: 20,
    margin: 10,
    width: '95%',
    position: 'relative',
  },
  contentShadow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: theme.COLORS.lightGray,
    borderRadius: 40,
    zIndex: -1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginTop: 10,
  },
  halfWidth: {
    width: '48%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.COLORS.dark,
    textAlign: 'center',
  },
  selectedDayText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: theme.COLORS.secondary,
  },
  dayButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.COLORS.white,
    borderWidth: 2,
    borderColor: theme.COLORS.primary,
  },
  selectedDayButton: {
    backgroundColor: theme.COLORS.primary,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.COLORS.primary,
  },
  selectedDayButtonText: {
    color: theme.COLORS.white,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.COLORS.dark,
    textAlign: 'center',
  },
  panelValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
    marginVertical: 10,
  },
  comparisonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.dark,
    textAlign: 'center',
    marginBottom: 15,
  },
  summaryRow: {
    alignItems: 'flex-start',
  },
  summaryText: {
    fontSize: 16,
    color: theme.COLORS.dark,
    marginVertical: 3,
    fontWeight: '500',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  neutral: {
    color: '#9E9E9E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.COLORS.white,
  },
  errorText: {
    color: theme.COLORS.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: theme.COLORS.dark,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 14,
    color: theme.COLORS.darkGray,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: theme.COLORS.white,
    fontWeight: 'bold',
  },
});