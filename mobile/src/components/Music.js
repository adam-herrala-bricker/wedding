import {View} from 'react-native';
import AudioPlayer from './AudioPlayer';
import TrackListing from './TrackListing';

const Music = () => {
  return (
    <View>
      <TrackListing />
      <AudioPlayer />
    </View>
  );
};

export default Music;
