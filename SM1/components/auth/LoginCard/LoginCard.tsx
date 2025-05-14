import theme from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface LoginCardProps {
  children: React.ReactNode;
}

export default function LoginCard({ children }: LoginCardProps) {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.SIZES.md,
    padding: theme.SIZES.lg,
    ...theme.SHADOWS.default,
    marginTop: theme.SIZES.lg,
  },
});