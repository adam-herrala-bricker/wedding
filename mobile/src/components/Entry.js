import {useState} from 'react';
import {View, Pressable, Text, StyleSheet, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {notifier} from '../reducers/viewReducer';
import {setEntryToken} from '../reducers/userReducer';
import {login} from '../services/loginServices';
import textDictionary from '../resources/dictionary';
import theme from '../theme';

const styles = StyleSheet.create({
  entryContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },

  boxCommon: {
    alignItems: 'center',

    margin: 8,
    padding: 10,

    borderRadius: theme.radii.standard,
    borderStyle: 'solid',
    borderWidth: 1,
  },

  buttonText: {
    fontFamily: theme.fontFamily,
    fontWeight: theme.fontWeight.bold,
  },

  displayText: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 20,
    fontFamily: theme.fontFamily,
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.heading,
  },
});

const Entry = () => {
  const dispatch = useDispatch();
  const view = useSelector((i) => i.view);
  const [entryText, setEntryText] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  // event handler
  const handlePress = async () => {
    try {
      // entry is the 'username' when checking the entry key
      const body = await login('entry', entryText);
      dispatch(setEntryToken(body.token));
    } catch (error) {
      const errorMessage = error.message === 'invalid username or password' ?
      `${textDictionary.entryError.eng} // ${textDictionary.entryError.suo}` :
      error.message;
      dispatch(notifier(errorMessage, true, 5));
    }
  };

  return (
    <View style = {styles.entryContainer}>
      <Text style = {[{alignSelf: 'flex-start'}, styles.displayText]}>
        Herrala Bricker Wedding
      </Text>
      <TextInput
        style = {[
          {borderColor: isFocus ?
            view.isError ? theme.color.red: theme.color.accent :
            'black'},
          styles.boxCommon]}
        selectionColor={theme.color.accent}
        autoCapitalize = 'none'
        secureTextEntry
        placeholder = 'entry key // sivuavain'
        value = {entryText}
        onFocus = {() => setIsFocus(true)}
        onChangeText={setEntryText}/>
      <Pressable
        style = {({pressed}) => [
          {backgroundColor: pressed ? theme.color.light : 'white'},
          {borderColor: view.isError ? theme.color.red : 'black'},
          styles.boxCommon]}
        onPress = {handlePress}>
        <Text style = {[{color: view.isError ? theme.color.red : 'black'},
          styles.buttonText]}>
          {view.isError ? view.notification : 'enter // sisään'}
        </Text>
      </Pressable>
      <Text style = {[{alignSelf: 'flex-end'}, styles.displayText]}>
        Herrala Bricker Häät
      </Text>
    </View>
  );
};

export default Entry;
