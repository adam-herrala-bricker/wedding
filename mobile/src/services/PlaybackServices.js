
import TrackPlayer, {Event} from 'react-native-track-player';

const PlaybackServices = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
};

export default PlaybackServices;
