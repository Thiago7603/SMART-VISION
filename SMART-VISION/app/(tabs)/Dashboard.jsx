// screens/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import theme from '../../constants/theme';
import Header from '../components/dashboard/header';
import { getAuth } from 'firebase/auth';
import { app } from '../../infra/Firebase/Firebaseconfig';
import { fetchWorkoutData } from '../../infra/Firebase/fetchWorkoutData';
import { formatDuration } from '../../core/dashboard';

const { width: screenWidth } = Dimensions.get('window');

export default function Dashboard() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(6);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchWorkoutData(userId);
        setWeeklyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

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
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => { setLoading(true); setError(''); }}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selectedDay = weeklyData[selectedDayIndex];

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Repeticiones diarias</Text>
        <BarChart
          data={{
            labels: weeklyData.map(d => d.day),
            datasets: [{ data: weeklyData.map(d => d.reps) }]
          }}
          width={screenWidth - 40}
          height={220}
          fromZero
          chartConfig={{
            backgroundColor: theme.COLORS.white,
            backgroundGradientFrom: theme.COLORS.white,
            backgroundGradientTo: theme.COLORS.white,
            decimalPlaces: 0,
            color: () => theme.COLORS.primary,
            labelColor: () => theme.COLORS.text
          }}
          style={{ borderRadius: 16, marginVertical: 8 }}
          onDataPointClick={({ index }) => setSelectedDayIndex(index)}
        />
        <View style={styles.panelContainer}>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Diseño</Text>
            <Text style={styles.panelValue}>{selectedDay.reps} reps</Text>
          </View>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Core</Text>
            <Text style={styles.panelValue}>{selectedDay.exercises} ejercicios</Text>
          </View>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Infra</Text>
            <Text style={styles.panelValue}>{formatDuration(selectedDay.duration)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.COLORS.background },
  scrollContent: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: theme.COLORS.text, marginBottom: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.COLORS.background },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: theme.COLORS.error, marginBottom: 10 },
  retryText: { color: theme.COLORS.primary, fontSize: 16, textDecorationLine: 'underline' },
  panelContainer: { marginTop: 20, gap: 16 },
  panel: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4
  },
  panelTitle: { fontSize: 16, color: theme.COLORS.gray, marginBottom: 6 },
  panelValue: { fontSize: 20, fontWeight: 'bold', color: theme.COLORS.primary }
});
