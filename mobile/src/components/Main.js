import {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router-native';
import {View, StyleSheet, StatusBar} from 'react-native';
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
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
  },

  loading: {
    backgroundColor: theme.color.loadingBG,
    flex: 1,
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
    // try delaying the setup?
    setTimeout(() => setupPlayer(), 5000);
    if (audioIsSetup) {
      dispatch(initializeMedia(entryToken, referer));
      dispatch(initializeScenes(entryToken, referer));
    }
  }, [entryToken]);

  // show blank page while track play sets up
  if (!audioIsSetup) {
    return (
      <View style = {styles.loading}>
        <StatusBar
          backgroundColor={theme.color.loadingBG}
          barStyle={'dark-content'}/>
      </View>);
  }

  // main view
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
