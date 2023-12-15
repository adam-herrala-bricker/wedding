import {useState} from 'react';
import {View, Pressable, Text, StyleSheet, TextInput} from 'react-native';
import {useDispatch} from 'react-redux';
import {setEntryToken} from '../reducers/userReducer';
import {login} from '../services/loginServices';
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
    marginBottom: 0,
    fontFamily: theme.fontFamily,
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.heading,
  },
});

const Entry = () => {
  const dispatch = useDispatch();
  const [entryText, setEntryText] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  // event handler
  const handlePress = async () => {
    try {
      // entry is the 'username' when checking the entry key
      const body = await login('entry', entryText);
      dispatch(setEntryToken(body.token));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style = {styles.entryContainer}>
      <Text style = {[{alignSelf: 'flex-start'}, styles.displayText]}>
        Herrala Bricker Wedding
      </Text>
      <Text></Text>
      <TextInput
        style = {[
          {borderColor: isFocus ? theme.color.accent : 'black'},
          styles.boxCommon]}
        selectionColor={theme.color.accent}
        autoCapitalize = 'none'
        secureTextEntry
        placeholder='entry key'
        value = {entryText}
        onFocus = {() => setIsFocus(true)}
        onChangeText={setEntryText}/>
      <Pressable
        style = {({pressed}) => [
          {backgroundColor: pressed ? theme.color.light : 'white'},
          styles.boxCommon]}
        onPress = {handlePress}>
        <Text style = {styles.buttonText}>enter // sisään</Text>
      </Pressable>
      <Text style = {[{alignSelf: 'flex-end'}, styles.displayText]}>
        Herrala Bricker Häät
      </Text>
    </View>
  );
};

export default Entry;
