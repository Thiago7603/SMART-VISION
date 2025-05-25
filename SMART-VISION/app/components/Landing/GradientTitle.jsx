import theme from '../../../constants/theme';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text } from 'react-native';

export default function GradientTitle({ text }) {
  return (
    <MaskedView
      maskElement={
        <Text style={[styles.title, { color: theme.COLORS.black }]}>{text}</Text>
      }
    >
      <LinearGradient
        colors={[theme.COLORS.primary, theme.COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.title, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: theme.SIZES.xxxl,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 50,
  },
});
