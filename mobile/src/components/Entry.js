import {useState} from 'react';
import {View, Pressable, Text, StyleSheet, TextInput} from 'react-native';
import {useNavigate} from 'react-router-native';
import {useDispatch} from 'react-redux';
import {setAllImages} from '../reducers/mediaReducer';
import {setEntryToken} from '../reducers/userReducer';
import {login} from '../services/loginServices';
import {getImages} from '../services/mediaServices';
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

  text: {
    fontFamily: theme.fontFamily,
    fontWeight: theme.fontWeight.bold,
  },
});

const Entry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [entryText, setEntryText] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  // event handler
  const handlePress = async () => {
    try {
      // entry is the 'username' when checking the entry key
      const body = await login('entry', entryText);
      dispatch(setEntryToken(body.token));

      const images = await getImages(body.token);
      dispatch(setAllImages(images));

      navigate('/welcome');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style = {styles.entryContainer}>
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
        <Text style = {styles.text}>enter</Text>
      </Pressable>
    </View>
  );
};

export default Entry;
