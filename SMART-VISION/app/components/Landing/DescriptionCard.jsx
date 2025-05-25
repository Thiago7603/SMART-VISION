import theme from '../../../constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function DescriptionCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.descriptionText}>
        Entrena de manera inteligente con nuestra guía de corrección de postura en tiempo real. 
        Evita lesiones, mejora tu técnica y alcanza tus objetivos con seguridad.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 25,
    backgroundColor: theme.COLORS.white,
    borderRadius: 25,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginBottom: 25,
    ...theme.SHADOWS.default,
  },
  descriptionText: {
    fontSize: theme.SIZES.md,
    fontFamily: theme.FONT.regular,
    textAlign: 'center',
    lineHeight: theme.SIZES.md * 1.5,
    color: theme.COLORS.black,
  },
});