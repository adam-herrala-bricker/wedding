import {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router-native';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {initializeImages} from '../reducers/mediaReducer';
import {initializeScenes} from '../reducers/sceneReducer';
import AppBar from './AppBar';
import Entry from './Entry';
import GridView from './GridView';
import HighlightView from './HighlightView';
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
        <Route path = '*' element = {<Navigate to = '/' replace />}/>
      </Routes>
    </View>
  );
};

export default Main;
