import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';

const GridView = () => {
  const user = useSelector((i) => i.user);
  return (
    <View>
      <Text>
        Grid view!
      </Text>
      <Text>
        {user.entryToken}
      </Text>
    </View>
  );
};

export default GridView;
