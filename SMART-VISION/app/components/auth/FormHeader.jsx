import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../../constants/theme';

export default function FormHeader() {
  const router = useRouter();

  const isAndroid = Platform.OS === 'android';

  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => router.replace('/auth/Login')} style={styles.backButton}>
      {isAndroid ? (
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[theme.COLORS.primary, theme.COLORS.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
            <MaterialIcons name="arrow-back" size={24} color={theme.COLORS.white} />
            </LinearGradient>
          </View>
        ) : (
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={theme.COLORS.black}
          />
        )}
      </TouchableOpacity>
      <Text style={styles.loginTitleCentered}>Regístrate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  backButton: {
    marginRight: 70,
  },
  loginTitleCentered: {
    fontSize: theme.SIZES.xl,
    fontWeight: '900',
    color: theme.COLORS.black,
    flex: 1,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});