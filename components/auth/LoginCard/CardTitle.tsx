import theme from '@/constants/theme';
import React from 'react';
import { Text, StyleSheet } from 'react-native';


interface CardTitleProps {
  text: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ text }) => {
  return <Text style={styles.title}>{text}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.SIZES.xxl,
    textAlign: 'center',
    fontWeight: '900',
    marginBottom: 10,
    color: theme.COLORS.black,    
    },
});

export default CardTitle;
