import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ImageWelcome} from './ImageComponents';
import textDictionary from '../resources/dictionary';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  textContainer: {
    alignItems: 'center',
  },

  headerText: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize.superheading,
    fontWeight: theme.fontWeight.bold,
  },

  subheaderText: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize.subheading,
  },

  photoText: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize.tiny,
  },
});

const Welcome = () => {
  const language = useSelector((i) => i.view.language);

  return (
    <View style = {styles.container}>
      <View style = {styles.textContainer}>
        <Text style = {styles.headerText}>
          {textDictionary.header[language]}
        </Text>
        <Text style = {styles.subheaderText}>
          {textDictionary.welcomeTxt[language]}
        </Text>
        <Text style = {styles.subheaderText}>
          {textDictionary.welcomeSubTxt[language]}
        </Text>
      </View>
      <ImageWelcome fileName = '_DSC1924.jpg'/>
      <Text style = {styles.photoText}>
        {textDictionary.photoTxt[language]}
      </Text>
    </View>

  );
};

export default Welcome;
