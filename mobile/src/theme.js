import {Platform} from 'react-native';

const theme = {
  color: {
    appBarBackground: '#FFFFFF',
    dark: '#25383D',
    accent: '#0095BB',
    accentDark: '#007E9D',
    light: '#E2E2E2',
    red: '#BA0042',
  },

  fontFamily: Platform.select({
    android: 'Roboto',
    ios: 'Arial',
    default: 'System',
  }),

  fontSize: {
    superheading: 26,
    heading: 20,
    subheading: 16,
    tiny: 10,
  },

  fontWeight: {
    bold: '700',
  },

  icon: {
    large: 56,
    regular: 48,
    small: 36,
  },

  radii: {
    subtle: 5,
    standard: 10,
  },
};

export default theme;
