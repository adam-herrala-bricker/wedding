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

  useEffect(() => {
    listRef.current?.scrollToIndex({index: scrollIndex});
  }, [media]);

  // note: getItemLayout is an optional optimization that makes
  // initialScrollIndex behave better, maybe
  // update: verify if we actually need it
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
        getItemLayout={(data, index) =>
          ({length: 200, offset: 203 * index, index})}
        renderItem = {({item}) => <ImageGrid fileName={item.fileName}/>}
        keyExtractor = {(item) => item.id}
      />
    </View>
  );
};

export default GridView;
