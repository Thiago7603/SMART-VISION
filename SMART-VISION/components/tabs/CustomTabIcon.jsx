import theme from './../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CustomTabIcon = ({ focused, label, IconComponent, iconName }) => {
 return focused ? (
    <LinearGradient
      colors={[theme.COLORS.primary, theme.COLORS.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.focusedTab}
    >
      <IconComponent name={iconName} size={28} color={theme.COLORS.white} />
      <Text style={styles.focusedText}>{label}</Text>
    </LinearGradient>
  ) : (
    <View style={styles.unfocusedTab}>
      <IconComponent name={iconName} size={28} color={theme.COLORS.black} />
      <Text style={styles.unfocusedText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  focusedTab: {
    width: 95,
    height: 65,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  focusedText: {
    color: theme.COLORS.white,
    fontSize: 15,
    marginTop: 3,
  },
  unfocusedTab: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  unfocusedText: {
    color: theme.COLORS.black,
    fontSize: 0.1,
    marginTop: 3,
  },
});

export default CustomTabIcon;