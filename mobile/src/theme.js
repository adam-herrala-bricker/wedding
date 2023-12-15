import {Platform} from 'react-native';

const theme = {
  color: {
    appBarBackground: '#FFFFFF',
    dark: '#25383D',
    accent: '#0095BB',
    light: '#E2E2E2',
  },

  fontFamily: Platform.select({
    android: 'Roboto',
    ios: 'Arial',
    default: 'System',
  }),

  fontSize: {
    heading: 26,
    subheading: 16,
  },

  fontWeight: {
    bold: '700',
  },

  icon: {
    regular: 48,
  },

  radii: {
    subtle: 5,
    standard: 10,
  },
};

export default theme;
