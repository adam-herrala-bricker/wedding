import {View, StyleSheet} from 'react-native';
import AudioPlayer from './AudioPlayer';
import TrackListing from './TrackListing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Music = () => {
  return (
    <View style = {styles.container}>
      <TrackListing />
      <AudioPlayer />
    </View>
  );
};

export default Music;
