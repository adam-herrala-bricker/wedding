import {View, StyleSheet, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import ImageGrid from './ImageGrid';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },

  listContainer: {
    margin: 10,

    borderStyle: 'solid',
    borderWidth: 1,

  },
});

const GridView = () => {
  const media = useSelector((i) => i.media);

  return (
    <View style = {styles.container}>
      <FlatList
        style = {styles.listContainer}
        numColumns={2}
        data = {media.allImages}
        initialNumToRender = {10}
        renderItem = {({item}) => <ImageGrid fileName={item.fileName}/>}
        keyExtractor = {(item) => item.id}
      />
    </View>
  );
};

export default GridView;
