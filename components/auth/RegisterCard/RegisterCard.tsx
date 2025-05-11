import theme from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function RegisterCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    marginTop: 50,
    backgroundColor: theme.COLORS.white,
    borderRadius: 25,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginBottom: 25,
    ...theme.SHADOWS.default,
  },
});
