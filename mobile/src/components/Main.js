import {Routes, Route, Navigate} from 'react-router-native';
import {View} from 'react-native';
import Entry from './Entry';
import GridView from './GridView';

const Main = () => {
  return (
    <View>
      <Routes>
        <Route path = '/' element = {<Entry />}/>
        <Route path = '/grid' element = {GridView}/>
        <Route path = '*' element = {<Navigate to = '/' replace />}/>
      </Routes>
    </View>
  );
};

export default Main;
