import {useEffect, useRef} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {ImageGrid} from './ImageComponents';
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
  const scrollIndex = useSelector((i) => i.view.scrollIndex);
  const listRef = useRef(null);

  // this is used to scroll back to 0 when the scene changes
  useEffect(() => {
    listRef.current?.scrollToIndex({index: scrollIndex, animated: false});
  }, [media]);

  // note: getItemLayout is an optional optimization that makes
  // initialScrollIndex behave better (definitely)
  return (
    <View style = {styles.outerContainer}>
      <SceneMenu />
      <FlatList
        ref = {listRef}
        style = {styles.container}
        contentContainerStyle = {styles.listContainer}
        numColumns={2}
        data = {media.viewImages}
        initialNumToRender = {10}
        initialScrollIndex = {scrollIndex}
        getItemLayout={(data, index) =>
          ({length: 206, offset: 206 * index, index})}
        renderItem = {({item}) => <ImageGrid fileName={item.fileName}/>}
        keyExtractor = {(item) => item.id}
      />
    </View>
  );
};

export default GridView;
