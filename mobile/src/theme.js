import {Platform} from 'react-native';

const theme = {
  color: {
    appBarBackground: '#FFFFFF',
  },

  fontFamily: Platform.select({
    android: 'Roboto',
    ios: 'Arial',
    default: 'System',
  }),

  fontSize: {
    heading: 26,
  },

  fontWeight: {
    bold: '700',
  },
};

export default theme;
