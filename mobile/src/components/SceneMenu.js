import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

const SceneButton = ({text}) => {
  return (
    <View>
      <Text>
        {text}
      </Text>
    </View>
  );
};

const SceneMenu = () => {
  const scenes = useSelector((i) => i.scenes);
  console.log(scenes.allScenes);

  // don't even render if scenes aren't loading
  if (!scenes) {
    return null;
  }

  return (
    <FlatList
      horizontal
      data = {scenes.allScenes}
      renderItem = {({item}) => <SceneButton text={item.sceneName}/>}
      keyExtractor = {(item) => item.id}/>
  );
};

export default SceneMenu;
