import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '@/constants/theme';

import GradientText from '../LoginCard/GradientText';

interface RegisterLinkProps {
  onPress: () => void;
}

export default function RegisterLink({ onPress }: RegisterLinkProps) {
  return (
    <View style={styles.createAccountContainer}>
      <Text style={styles.createAccountText}>¿No tienes una cuenta? </Text>
      <TouchableOpacity onPress={onPress}>
        <GradientText text='Crear Cuenta' />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  createAccountText: {
    color: theme.COLORS.black,
    fontSize: theme.SIZES.md,
    fontWeight: '900'
  },
});