import {Pressable, Text, View, ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import * as Progress from 'react-native-progress';
import {Feather} from '@expo/vector-icons';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {toMinutes} from '../utils/helpers';
import {fileToName} from '../utils/helpers';
import textDictionary from '../resources/dictionary';
import theme from '../theme';

const styles = StyleSheet.create({
  outerContainer: {
    width: 250,
    marginBottom: 10,
    padding: 5,
    borderWidth: 1,
    borderRadius: theme.radii.subtle,
    backgroundColor: 'white',
  },

  rowContainerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  rowContainerProgress: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  rowContainerTrackInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  barsContainer: {
    justifyContent: 'center',
  },

  barStyle: {
    alignSelf: 'center',
  },

  buttonStyle: {
    alignSelf: 'center',
  },

  infoText: {
    fontFamily: theme.fontFamily,
    marginLeft: 5,
    marginRight: 5,
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
  // event handler
  const handlePress = async () => {
    if (direction === 'skip-forward') {
      await TrackPlayer.skipToNext();
    } else if (direction === 'skip-back') {
      await TrackPlayer.skipToPrevious();
    }
  };

  return (
    <Pressable onPress = {handlePress}>
      <Feather
        name = {direction}
        size = {theme.icon.small}
        color="black" />
    </Pressable>
  );
};

const PlayButton = ({color}) => {
  const handlePlay = async () => {
    await TrackPlayer.play();
  };

  return (
    <Pressable style = {styles.buttonStyle} onPress = {handlePlay}>
      <Feather
        name = "play"
        size = {theme.icon.regular}
        color = {color} />
    </Pressable>
  );
};

const PauseButton = ({color}) => {
  const handlePause = async () => {
    await TrackPlayer.pause();
  };

  return (
    <Pressable style = {styles.buttonStyle} onPress = {handlePause}>
      <Feather
        name = "pause"
        size = {theme.icon.regular}
        color = {color} />
    </Pressable>
  );
};

export const PlayPauseButton = ({isPlaying, color}) => {
  return isPlaying ? <PauseButton color = {color}/> : <PlayButton color = {color}/>; // eslint-disable-line max-len
};

const AudioPlayer = () => {
  const language = useSelector((i) => i.view.language);
  const thisTrack = useActiveTrack();
  const playerState = usePlaybackState();
  // polls every 200ms
  const {position, buffered, duration} = useProgress(200);

  const isPlaying = playerState.state === 'playing';
  const amountPlayed = position/duration;
  const amountBuffered = buffered/duration;

  return (
    <View style = {styles.outerContainer}>
      <View style = {styles.rowContainerButtons}>
        <ChangeTrack direction = 'skip-back'/>
        <PlayPauseButton isPlaying = {isPlaying} color = 'black'/>
        <ChangeTrack direction = 'skip-forward'/>
      </View>
      <ScrollView
        horizontal
        style = {styles.barStyle}
        contentContainerStyle = {styles.rowContainerTrackInfo}>
        {thisTrack?.title &&
        <Text style = {styles.infoText}>
          {textDictionary[fileToName(thisTrack.title)][language]}
        </Text>}
        {thisTrack?.artist &&
        <Text style = {styles.infoText}>
          {thisTrack.artist}
        </Text>}
      </ScrollView>
      <View style = {styles.rowContainerProgress}>
        <Text style = {styles.durationText}>{toMinutes(position)}</Text>
        <View style = {styles.barsContainer}>
          <Progress.Bar
            style = {styles.barStyle}
            progress = {duration > 0 ? amountPlayed : 1}
            color = {theme.color.accent}
            unfilledColor = {theme.color.light}
            borderWidth = {1}/>
          <Progress.Bar
            style = {styles.barStyle}
            progress = {duration > 0 ? amountBuffered : 1}
            color = {theme.color.light}
            height = {2}
            width = {140}
            borderWidth = {0}/>
        </View>
        <Text style = {styles.durationText}>{toMinutes(duration)}</Text>
      </View>
    </View>
  );
};

export default AudioPlayer;
