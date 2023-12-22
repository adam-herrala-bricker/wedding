import {View, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import AudioPlayer from './AudioPlayer';
import TrackListing from './TrackListing';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },

  trackListContainer: {
    alignSelf: 'stretch',
  },

  seperator: {
    height: 4,
    backgroundColor: theme.color.light,
  },
});

const Seperator = () => <View style = {styles.seperator}></View>;

const Music = () => {
  const audioTracks = useSelector((i) => i.media.audio);

  return (
    <View style = {styles.container}>
      <FlatList
        style = {styles.trackListContainer}
        data = {audioTracks}
        renderItem = {({item}) => <TrackListing fileName = {item.fileName}/>}
        ItemSeparatorComponent={<Seperator />}
        keyExtractor = {(item) => item.id}/>
      <AudioPlayer />
    </View>
  );
};

export default Music;
