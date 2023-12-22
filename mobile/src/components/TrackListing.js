import {Image, Pressable, Text, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player';
import {PlayPauseButton} from './AudioPlayer';
import logo from '../../assets/logo-512.png';
import textDictionary from '../resources/dictionary';
import {fileToName, placeInQueue} from '../utils/helpers';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    padding: 10,
  },

  textContainer: {
    flex: 3,
    marginLeft: 10,
  },

  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  buttonStyle: {
    alignSelf: 'center',
  },

  textTitle: {
    fontFamily: theme.fontFamily,
    fontWeight: theme.fontWeight.bold,
  },

  textArtist: {
    fontFamily: theme.fontFamily,
  },

  image: {
    height: 70,
    width: 70,
    resizeMode: 'contain',
  },
});

const TrackListing = ({fileName}) => {
  const activeTrack = useActiveTrack();
  const playerState = usePlaybackState();
  const language = useSelector((i) => i.view.language);

  const isActive = activeTrack?.id === fileName;
  const isPlaying = playerState.state === 'playing';

  const thisTitle = textDictionary[fileToName(fileName)][language];
  const thisArtist = fileName === 'Mia2.1.mp3' ? 'Mia Bricker' : 'Adam Herrala Bricker'; // eslint-disable-line max-len

  // event handler
  const loadTrack = async () => {
    const thisIndex = await placeInQueue(fileName);
    await TrackPlayer.skip(thisIndex);
    await TrackPlayer.play();
  };

  return (
    <View
      style = {[{backgroundColor: isActive ? theme.color.dark : 'white'},
        styles.container]}>
      <Image style = {styles.image} source = {logo}/>
      <View style = {styles.textContainer}>
        <Text
          style = {[{color: isActive ? 'white' : 'black'}, styles.textTitle]}>
          {thisTitle}
        </Text>
        <Text
          style = {[{color: isActive ? 'white' : 'black'}, styles.textArtist]}>
          {thisArtist}
        </Text>
      </View>
      <View style = {styles.buttonContainer}>
        {isActive ?
        <PlayPauseButton
          isPlaying = {isPlaying}
          color = 'white'/> :
        <Pressable style = {styles.buttonStyle} onPress = {loadTrack}>
          <Ionicons
            name = 'play-circle-outline'
            size = {theme.icon.large}
            color = {isActive ? 'white' : 'black'} />
        </Pressable>}
      </View>
    </View>
  );
};

export default TrackListing;
