import {View, StyleSheet} from 'react-native';
import AudioPlayer from './AudioPlayer';
import TrackListing from './TrackListing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
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
