import {Pressable, Text, View} from 'react-native';
import TrackPlayer from 'react-native-track-player';

const TrackListing = () => {
  // event handler
  const loadTrack = async () => {
    console.log('Loaded!');
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: 'test-1',
      url: require('./test35.1.wav'),
      title: 'test title',
      artist: 'test artist',
    });
  };

  return (
    <View>
      <Pressable onPress = {loadTrack}>
        <Text>
          Load track!
        </Text>
      </Pressable>
    </View>
  );
};

export default TrackListing;
