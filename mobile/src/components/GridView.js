import {View, StyleSheet, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import ImageGrid from './ImageGrid';
import SceneMenu from './SceneMenu';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },

  container: {
    alignSelf: 'center',
  },

  listContainer: {
    marginTop: 10,
  },
});

const GridView = () => {
  const media = useSelector((i) => i.media);

  return (
    <View style = {styles.outerContainer}>
      <SceneMenu />
      <FlatList
        style = {styles.container}
        contentContainerStyle = {styles.listContainer}
        numColumns={2}
        data = {media.viewImages}
        initialNumToRender = {10}
        renderItem = {({item}) => <ImageGrid fileName={item.fileName}/>}
        keyExtractor = {(item) => item.id}
      />
    </View>
  );
};

export default GridView;
