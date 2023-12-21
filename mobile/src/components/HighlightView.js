import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ImageHighlight} from './ImageComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

const HighlightView = () => {
  const fileName = useSelector((i) => i.media.highlight);
  return (
    <View style = {styles.container}>
      <ImageHighlight fileName = {fileName} />
    </View>
  );
};

export default HighlightView;
