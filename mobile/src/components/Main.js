import {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router-native';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import {initializeImages} from '../reducers/mediaReducer';
import {initializeScenes} from '../reducers/sceneReducer';
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
  // need to setup player before running
  // (seems to be most stable doing it here)
  const setupPlayer = async () => {
    await TrackPlayer.setupPlayer();
  };

  const dispatch = useDispatch();
  const entryToken = useSelector((i) => i.user.entryToken);

  useEffect(() => {
    console.log('setup!');
    setupPlayer();
  }, []);

  // effect hook to initialize states
  useEffect(() => {
    dispatch(initializeImages(entryToken));
    dispatch(initializeScenes(entryToken));
  }, [entryToken]);

  return (
    <View style = {styles.container}>
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
