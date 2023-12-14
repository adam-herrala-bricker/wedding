import {Routes, Route, Navigate} from 'react-router-native';
import {View, StyleSheet} from 'react-native';
import Entry from './Entry';
import GridView from './GridView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Main = () => {
  return (
    <View style = {styles.container}>
      <Routes>
        <Route path = '/' element = {<Entry />}/>
        <Route path = '/grid' element = {<GridView />}/>
        <Route path = '*' element = {<Navigate to = '/' replace />}/>
      </Routes>
    </View>
  );
};

export default Main;
