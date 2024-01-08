import {useState} from 'react';
import {Pressable,
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {useNavigate} from 'react-router-native';
import {useDispatch, useSelector} from 'react-redux';
import {MaterialIcons} from '@expo/vector-icons';
import {resetRefPath, switchLanguage} from '../reducers/viewReducer';
import {clearUser} from '../reducers/userReducer';
import usFlag from '../resources/us-flag.png';
import finFlag from '../resources/fin-flag.png';
import textDictionary from '../resources/dictionary';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.dark,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    zindex: 100, // iOS
    elevation: 100, // android
  },

  textContainer: {
    flexDirection: 'row',
  },

  text: {
    color: 'white',
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize.heading,
    fontWeight: theme.fontWeight.bold,

    marginRight: 20,
  },

  button: {
    alignSelf: 'center',
  },

  flag: {

    height: 20,
    width: 30,
    resizeMode: 'cover',

    borderRadius: 2,
  },
});

const BarItem = ({label, path}) => {
  const navigate = useNavigate();
  // how we're handing press styling
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn = {() => setIsPressed(true)}
      onPress = {() => navigate(path)}
      onPressOut = {() => setIsPressed(false)}>
      <Text style = {[
        {color: isPressed ? theme.color.accent : 'black'},
        styles.text]}>
        {label}
      </Text>
    </Pressable>
  );
};

const Flag = () => {
  const dispatch = useDispatch();
  const language = useSelector((i) => i.view.language);

  // event handler
  const handleLanguageSwitch = () => {
    dispatch(switchLanguage());
  };

  return (
    <Pressable style = {styles.button} onPress = {handleLanguageSwitch}>
      <Image
        style = {styles.flag}
        source = {language === 'suo' ? finFlag : usFlag}/>
    </Pressable>);
};

const LogOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isPressed, setIsPressed] = useState(false);

  // event handler
  const handleLogout = async () => {
    dispatch(clearUser());
    dispatch(resetRefPath());
    await TrackPlayer.stop();
    navigate('/');
  };

  return (
    <Pressable
      onPressIn = {() => setIsPressed(true)}
      onPress={handleLogout}
      onPressOut = {() => setIsPressed(false)}>
      <MaterialIcons
        name="logout"
        size={theme.icon.small}
        color={isPressed ? theme.color.dark : 'white'} />
    </Pressable>
  );
};

const AppBar = () => {
  const language = useSelector((i) => i.view.language);

  return (
    <View horizontal style = {styles.container}>
      <ScrollView horizontal style = {styles.textContainer}>
        <BarItem label = {textDictionary['home'][language]} path = '/' />
        <BarItem label = {textDictionary['photos'][language]} path = '/grid' />
        <BarItem label = {textDictionary['music'][language]} path = '/music' />
        <Flag />
      </ScrollView>
      <View>
        <LogOut />
      </View>
    </View>
  );
};

export default AppBar;
