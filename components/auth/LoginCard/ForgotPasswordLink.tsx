import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import theme from '@/constants/theme';

interface ForgotPasswordLinkProps {
  onPress: () => void; 
}

export default function ForgotPasswordLink({ onPress }: ForgotPasswordLinkProps) {
  return (
    <TouchableOpacity style={styles.forgotPassword} onPress={onPress}>
      <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: theme.COLORS.primary,
    fontSize: theme.SIZES.sm,
    fontWeight: '900',
  },
});