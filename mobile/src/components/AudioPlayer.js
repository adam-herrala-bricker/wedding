import {Pressable, View, StyleSheet} from 'react-native';
import {Feather} from '@expo/vector-icons';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
  },
});

const PlayButton = () => {
  const handlePlay = async () => {
    console.log('Play!');
    await TrackPlayer.play();
  };

  return (
    <Pressable onPress = {handlePlay}>
      <Feather
        name = "play"
        size={theme.icon.regular}
        color="black" />
    </Pressable>
  );
};

const PauseButton = () => {
  const handlePause = async () => {
    console.log('Pause!');
    await TrackPlayer.pause();
  };

  return (
    <Pressable onPress = {handlePause}>
      <Feather
        name = "pause"
        size={theme.icon.regular}
        color="black" />
    </Pressable>
  );
};

const AudioPlayer = () => {
  const playerState = usePlaybackState();
  const isPlaying = playerState.state === 'playing';

  return (
    <View style = {styles.container}>
      {isPlaying ? <PauseButton /> : <PlayButton />}
    </View>
  );
};

export default AudioPlayer;
