import {Pressable, Text, View, StyleSheet} from 'react-native';
import * as Progress from 'react-native-progress';
import {Feather} from '@expo/vector-icons';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {toMinutes} from '../utils/helpers';
import theme from '../theme';

const styles = StyleSheet.create({
  outerContainer: {
    width: 250,
    padding: 5,
    borderWidth: 1,
    borderRadius: theme.radii.subtle,
  },

  rowContainerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowContainerProgress: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  barStyle: {
    alignSelf: 'center',
  },

  durationText: {
    width: 30, // keeps bar position stable over text changes
    fontSize: theme.fontSize.tiny,
    fontFamily: theme.fontFamily,
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

const ChangeTrack = ({direction}) => {
  return (
    <Pressable>
      <Feather
        name = {direction}
        size = {theme.icon.small}
        color="black" />
    </Pressable>
  );
};

const PlayButton = () => {
  const handlePlay = async () => {
    await TrackPlayer.play();
  };

  return (
    <Pressable onPress = {handlePlay}>
      <Feather
        name = "play"
        size = {theme.icon.regular}
        color = "black" />
    </Pressable>
  );
};

const PauseButton = () => {
  const handlePause = async () => {
    await TrackPlayer.pause();
  };

  return (
    <Pressable onPress = {handlePause}>
      <Feather
        name = "pause"
        size = {theme.icon.regular}
        color = "black" />
    </Pressable>
  );
};

const AudioPlayer = () => {
  const thisTrack = useActiveTrack();
  console.log(thisTrack);
  const playerState = usePlaybackState();
  // polls every 200ms
  const {position, buffered, duration} = useProgress(200);

  const isPlaying = playerState.state === 'playing';
  const amountPlayed = position/duration;

  return (
    <View style = {styles.outerContainer}>
      <View style = {styles.rowContainerButtons}>
        <ChangeTrack direction = 'skip-back'/>
        {isPlaying ? <PauseButton /> : <PlayButton />}
        <ChangeTrack direction = 'skip-forward'/>
      </View>
      <View style = {styles.rowContainerProgress}>
        <Text style = {styles.durationText}>{toMinutes(position)}</Text>
        <Progress.Bar
          style = {styles.barStyle}
          progress = {duration > 0 ? amountPlayed : 1}
          color = {theme.color.accent}
          unfilledColor = {theme.color.light}
          borderWidth = {1}/>
        <Text style = {styles.durationText}>{toMinutes(duration)}</Text>
      </View>
    </View>
  );
};

export default AudioPlayer;
