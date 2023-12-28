import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';

const Notification = () => {
  const {notification} = useSelector((i) => i.view);

  console.log(notification);

  if (!notification) {
    return null;
  }

  return (
    <View>
      <Text>
        {notification}
      </Text>
    </View>
  );
};

export default Notification;
