import {useState} from 'react';
import {useNavigate} from 'react-router-native';
import {View, Pressable, Text, StyleSheet, TextInput} from 'react-native';
import {useDispatch} from 'react-redux';
import {entryCheck} from '../reducers/userReducer';

const styles = StyleSheet.create({
  boxCommon: {
    margin: 8,
    padding: 10,

    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,

  },
});

const Entry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [entryText, setEntryText] = useState('');

  // event handler
  const handlePress = async () => {
    dispatch(entryCheck(entryText));
    navigate('/grid');
  };

  return (
    <View>
      <Text>Entry page!</Text>
      <TextInput
        style = {styles.boxCommon}
        autoCapitalize = 'none'
        placeholder='entry key'
        value = {entryText}
        onChangeText={setEntryText}/>
      <Pressable style = {styles.boxCommon} onPress = {handlePress}>
        <Text>Press me!</Text>
      </Pressable>
    </View>
  );
};

export default Entry;
