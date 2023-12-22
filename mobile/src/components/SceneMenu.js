import {View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setLoadedScene} from '../reducers/sceneReducer';
import {filterImages} from '../reducers/mediaReducer';
import {setScrollIndex} from '../reducers/viewReducer';
import textDictionary from '../resources/dictionary';
import theme from '../theme';

const styles = StyleSheet.create({
  outerContainer: {
  },

  container: {
  },

  seperator: {

    borderRightWidth: 1,
    borderColor: 'white',
  },

  buttonText: {
    margin: 8,
    paddingBottom: 3,
    fontSize: theme.fontSize.subheading,
    fontFamily: theme.fontFamily,

    borderColor: theme.color.accent,
  },

});

const SceneButton = ({sceneCode}) => {
  const dispatch = useDispatch();
  const loadedScene = useSelector((i) => i.scenes.loadedScene);
  const language = useSelector((i) => i.view.language);

  // helper to translate scene codes to english or finnish
  const translateScene = (textIn) => {
    // format to remove '-'
    let textOut = textIn.replace('-', '');

    const dictionaryEntries = Object.keys(textDictionary);

    if (dictionaryEntries.includes(textOut)) {
      textOut = textDictionary[textOut][language];
    }

    return textOut;
  };

  // event handler
  const handleSceneChange = (sceneCode) => {
    dispatch(setScrollIndex(0)); // reset to view from top
    dispatch(setLoadedScene(sceneCode));
    dispatch(filterImages(sceneCode));
  };

  return (
    <View>
      <Pressable onPress = {() => handleSceneChange(sceneCode)}>
        <Text
          style = {[
            {borderBottomWidth:
              loadedScene === sceneCode ?
              3 :
              0},
            styles.buttonText]}>
          {translateScene(sceneCode)}
        </Text>
      </Pressable>
    </View>
  );
};

const SceneMenu = () => {
  const scenes = useSelector((i) => i.scenes);

  // don't even render if scenes aren't loading
  if (!scenes) {
    return null;
  }

  return (

    <FlatList
      horizontal
      style = {styles.outerContainer}
      contentContainerStyle = {styles.container}
      data = {scenes.allScenes}
      renderItem = {({item}) => <SceneButton sceneCode={item.sceneName}/>}
      keyExtractor = {(item) => item.id}/>

  );
};

export default SceneMenu;
