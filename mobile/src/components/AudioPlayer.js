import {useEffect} from 'react';
import {Pressable, Text, View} from 'react-native';
// import TrackPlayer from 'react-native-track-player';


const AudioPlayer = () => {
  /*
  // need to setup player before running
  const setupPlayer = async () => {
    await TrackPlayer.setupPlayer();

    // add track to queue
    await TrackPlayer.add({
      id: 'test-1',
      url: require('./test35.1.wav'),
      title: 'test title',
      artist: 'test artist',
    });
  };

  // event handlers
  const handlePlay = async () => {
    console.log('Play!');
    await TrackPlayer.play();
  };

  const handlePause = async () => {
    console.log('Pause!');
    await TrackPlayer.pause();
  };

  useEffect(() => {
    setupPlayer();
  }, []);

  */
  return (
    <View>
      <Pressable>
        <Text>
          Play
        </Text>
      </Pressable>
      <Pressable>
        <Text>
          Pause
        </Text>
      </Pressable>
    </View>
  );
};

export default AudioPlayer;
