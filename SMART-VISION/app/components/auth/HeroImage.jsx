import { Image, StyleSheet } from 'react-native';

export default function HeroImage() {
  return (
    <Image
      source={require('@/assets/images/fondo1.png')}
      style={styles.heroImage}
    />
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: 200,
  },
});
