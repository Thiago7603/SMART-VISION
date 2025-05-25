import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import theme from '../../constants/theme';
import Header from '../../components/dashboard/header';

const { width: screenWidth } = Dimensions.get('window');

export default function Dashboard() {
  // Estado para el día seleccionado (por defecto el último día)
  const [selectedDayIndex, setSelectedDayIndex] = useState(6); // Empieza en Dom
  
  // Datos completos por día (ejemplo)
  const weeklyData = [
    { day: "Lun", reps: 20, exercises: 5, duration: "30m" },
    { day: "Mar", reps: 45, exercises: 7, duration: "45m" },
    { day: "Mié", reps: 28, exercises: 4, duration: "35m" },
    { day: "Jue", reps: 80, exercises: 9, duration: "1h 10m" },
    { day: "Vie", reps: 99, exercises: 12, duration: "1h 30m" },
    { day: "Sáb", reps: 43, exercises: 6, duration: "50m" },
    { day: "Dom", reps: 50, exercises: 8, duration: "1h 05m" }
  ];

  // Datos para la gráfica con colores dinámicos
  const chartData = {
    labels: weeklyData.map(d => d.day),
    datasets: [{
      data: weeklyData.map(d => d.reps),
      colors: weeklyData.map((_, index) => 
        index === selectedDayIndex 
          ? () => theme.COLORS.secondary 
          : () => theme.COLORS.primary
      )
    }]
  };

  // Manejar selección de día mediante toque en la barra
  const handleBarPress = (data) => {
    if (data && data.index !== undefined) {
      setSelectedDayIndex(data.index);
    }
  };

  // Crear botones para selección manual de días
  const renderDayButtons = () => {
    return (
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
    );
  };

  // Datos del día seleccionado
  const selectedDay = weeklyData[selectedDayIndex];
  const prevDay = selectedDayIndex > 0 ? weeklyData[selectedDayIndex - 1] : null;

  // Función para calcular diferencia de ejercicios
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

  const exerciseDiff = getExerciseDifference();

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
            data={chartData}
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
          {renderDayButtons()}
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
                exerciseDiff.type === 'positive' ? styles.positive :
                exerciseDiff.type === 'negative' ? styles.negative : styles.neutral
              ]}>
                {exerciseDiff.symbol} {exerciseDiff.value > 0 ? exerciseDiff.value : ''} 
                {exerciseDiff.value > 0 ? ` ${exerciseDiff.text} que ${prevDay.day}` : `Igual que ${prevDay.day}`}
              </Text>
            )}
          </View>

          {/* Panel de duración */}
          <View style={[styles.dataPanel, styles.halfWidth]}>
            <View style={styles.contentShadow} />
            <Text style={styles.panelTitle}>Duración total</Text>
            <Text style={styles.panelValue}>{selectedDay.duration}</Text>
            {prevDay && (
              <Text style={[
                styles.comparisonText,
                selectedDay.duration > prevDay.duration ? styles.negative :
                selectedDay.duration < prevDay.duration ? styles.positive : styles.neutral
              ]}>
                {selectedDay.duration > prevDay.duration ? '↑ Más tiempo' :
                 selectedDay.duration < prevDay.duration ? '↓ Menos tiempo' : '→ Mismo tiempo'} que {prevDay.day}
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
              ⏱️ {selectedDay.duration} de entrenamiento
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
    color: '#4CAF50', // Verde para mejoría
  },
  negative: {
    color: '#F44336', // Rojo para retroceso
  },
  neutral: {
    color: '#9E9E9E', // Gris para igual
  },
});