import {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router-native';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {initializeMedia, setAudioIsSetup} from '../reducers/mediaReducer';
import {initializeScenes} from '../reducers/sceneReducer';
import TrackPlayer from 'react-native-track-player';
import AppBar from './AppBar';
import Entry from './Entry';
import GridView from './GridView';
import HighlightView from './HighlightView';
import Music from './Music';
import Welcome from './Welcome';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
  },
});


const Main = () => {
  const dispatch = useDispatch();
  const entryToken = useSelector((i) => i.user.entryToken);
  const referer = useSelector((i) => i.view.refPath);
  const audioIsSetup = useSelector((i) => i.media.audioIsSetup);

  // initial setup of track player
  const setupPlayer = async () => {
    if (!audioIsSetup) {
      await TrackPlayer.setupPlayer();
      dispatch(setAudioIsSetup(true));
    }
  };

  // effect hook to initialize states
  useEffect(() => {
    setupPlayer();
    if (audioIsSetup) {
      dispatch(initializeMedia(entryToken, referer));
      dispatch(initializeScenes(entryToken, referer));
    }
  }, [entryToken]);

  if (!audioIsSetup) return <View><Text>setting up!</Text></View>;

  return (
    <View style = {styles.container}>
      <StatusBar backgroundColor={'#FAFAFA'} barStyle={'dark-content'}/>
      {entryToken && <AppBar />}
      <Routes>
        <Route path = '/' element = {entryToken ? <Welcome />: <Entry />}/>
        <Route path = '/grid' element = {<GridView />}/>
        <Route path = '/highlight' element = {<HighlightView />}/>
        <Route path = '/music' element = {<Music />} />
        <Route path = '*' element = {<Navigate to = '/' replace />}/>
      </Routes>
    </View>
  );
};

export default Main;
