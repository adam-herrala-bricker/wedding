import {Routes, Route, Navigate} from 'react-router-native';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import AppBar from './AppBar';
import Entry from './Entry';
import GridView from './GridView';
import Welcome from './Welcome';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
  },
});

const Main = () => {
  const entryToken = useSelector((i) => i.user.entryToken);
  return (
    <View style = {styles.container}>
      {entryToken && <AppBar />}
      <Routes>
        <Route path = '/' element = {<Entry />}/>
        <Route path = '/welcome' element = {<Welcome />}/>
        <Route path = '/grid' element = {<GridView />}/>
        <Route path = '*' element = {<Navigate to = '/welcome' replace />}/>
      </Routes>
    </View>
  );
};

export default Main;
