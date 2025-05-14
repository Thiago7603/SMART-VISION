import { FONTS } from '@/constants/fonts';

const theme = {
  COLORS: {
    primary: '#310071',
    secondary: '#C20054',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#7D7D7D',
    lightGray: '#F5F5F5',
    shadow: '#4F46E5',
  },
  FONT: {
    regular: FONTS.outfitRegular,
    medium: FONTS.outfitMedium,
    semiBold: FONTS.outfitSemiBold,
    bold: FONTS.outfitBold,
    extraBold: FONTS.outfitExtraBold,
  },
  SIZES: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 25,
    xxl: 32,
    xxxl: 45,
  },
  SHADOWS: {
    default: {
      shadowColor: '#4F46E5',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
  },
};

export default theme;
