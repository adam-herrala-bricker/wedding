import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';

const Welcome = () => {
  const language = useSelector((i) => i.view.language);

  return (
    <View>
      <Text>
        Welcome!
      </Text>
    </View>

  );
};

export default Welcome;
