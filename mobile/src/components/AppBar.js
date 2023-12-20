import {useState} from 'react';
import {Pressable, Text, StyleSheet, View} from 'react-native';
import {useNavigate} from 'react-router-native';
import {useDispatch} from 'react-redux';
import {MaterialIcons} from '@expo/vector-icons';
import {clearUser} from '../reducers/userReducer';
import Constants from 'expo-constants';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
  },

  textContainer: {
    flexDirection: 'row',
  },

  text: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize.heading,
    fontWeight: theme.fontWeight.bold,

    marginRight: 10,
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

const LogOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isPressed, setIsPressed] = useState(false);

  // event handler
  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/');
  };

  return (
    <Pressable
      onPressIn = {() => setIsPressed(true)}
      onPress={handleLogout}
      onPressOut = {() => setIsPressed(false)}>
      <MaterialIcons
        name="logout"
        size={theme.icon.regular}
        color={isPressed ? theme.color.accent : 'black'} />
    </Pressable>
  );
};

const AppBar = () => {
  return (
    <View style = {styles.container}>
      <View style = {styles.textContainer}>
        <BarItem label = 'home' path = '/' />
        <BarItem label = 'photos' path = '/grid' />
        <BarItem label = 'music' path = '/music' />
      </View>
      <View>
        <LogOut />
      </View>
    </View>
  );
};

export default AppBar;
