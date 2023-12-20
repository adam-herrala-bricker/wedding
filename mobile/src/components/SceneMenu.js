import {View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setLoadedScene} from '../reducers/sceneReducer';
import {filterImages} from '../reducers/mediaReducer';
import textDictionary from '../resources/dictionary';
import theme from '../theme';

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: theme.color.dark,
  },

  container: {
  },

  seperator: {

    borderRightWidth: 1,
    borderColor: 'white',
  },

  buttonText: {
    color: 'white',
    padding: 8,
    fontSize: theme.fontSize.subheading,
    fontFamily: theme.fontFamily,
  },

});

const ButtonSeperator = () => {
  return <View style = {styles.seperator}></View>;
};

const SceneButton = ({sceneCode}) => {
  const dispatch = useDispatch();
  const loadedScene = useSelector((i) => i.scenes.loadedScene);

  // helper to translate scene codes to english or finnish
  const translateScene = (textIn) => {
    // format to remove '-'
    let textOut = textIn.replace('-', '');

    const dictionaryEntries = Object.keys(textDictionary);

    if (dictionaryEntries.includes(textOut)) {
      textOut = textDictionary[textOut].eng;
    }

    return textOut;
  };

  // event handler
  const handleSceneChange = (sceneCode) => {
    dispatch(setLoadedScene(sceneCode));
    dispatch(filterImages(sceneCode));
  };

  return (
    <View>
      <Pressable onPress = {() => handleSceneChange(sceneCode)}>
        <Text
          style = {[
            {backgroundColor:
              loadedScene === sceneCode ?
              theme.color.accent :
              theme.color.dark},
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
      ItemSeparatorComponent={ <ButtonSeperator />}
      keyExtractor = {(item) => item.id}/>

  );
};

export default SceneMenu;
