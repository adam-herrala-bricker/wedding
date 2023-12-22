import {Image, Pressable, Text, View, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import TrackPlayer from 'react-native-track-player';
import logo from '../../assets/logo-512.png';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    padding: 10,
    backgroundColor: theme.color.dark,
  },

  textContainer: {
    flex: 1,
    marginLeft: 10,
  },

  buttonContainer: {
    alignSelf: 'center',
  },

  textTitle: {
    fontFamily: theme.fontFamily,
    fontWeight: theme.fontWeight.bold,
    color: 'white',
  },

  textArtist: {
    fontFamily: theme.fontFamily,
    color: 'white',
  },

  image: {
    height: 70,
    width: 70,
    resizeMode: 'contain',
  },
});

const TrackListing = () => {
  const thisTitle = 'test title';
  const thisArtist = 'test artist';

  // event handler
  const loadTrack = async () => {
    console.log('Loaded!');
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: 'test-1',
      url: require('./test35.1.wav'),
      title: thisTitle,
      artist: thisArtist,
    });
  };

  return (
    <View style = {styles.container}>
      <Image style = {styles.image} source = {logo}/>
      <View style = {styles.textContainer}>
        <Text style = {styles.textTitle}>{thisTitle}</Text>
        <Text style = {styles.textArtist}>{thisArtist}</Text>
      </View>
      <Pressable style = {styles.buttonContainer} onPress = {loadTrack}>
        <Ionicons
          name = 'play-circle-outline'
          size = {theme.icon.large}
          color = 'white' />
      </Pressable>
    </View>
  );
};

export default TrackListing;
