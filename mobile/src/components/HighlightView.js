import {StyleSheet, View} from 'react-native';
import {useParams} from 'react-router-native';
import {ImageHighlight} from './ImageComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

const HighlightView = () => {
  const {fileName} = useParams();
  return (
    <View style = {styles.container}>
      <ImageHighlight fileName = {fileName} />
    </View>
  );
};

export default HighlightView;
