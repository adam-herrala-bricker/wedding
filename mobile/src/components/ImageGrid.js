import {Image, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import theme from '../theme';

const styles = StyleSheet.create({
  imageContainer: {
    margin: 5,
    alignItems: 'center',

    flexGrow: 1,
    flexShrink: 1,
  },

  singleImage: {
    height: 200,
    width: 170,
    resizeMode: 'cover',
    borderRadius: theme.radii.subtle,
  },
});

const ImageGrid = ({fileName}) => {
  const entryToken = useSelector((i) => i.user.entryToken);
  const baseURL = 'https://herrala-bricker-wedding.onrender.com/api/images/web-res/';
  return (
    <View style = {styles.imageContainer}>
      <Image
        style = {styles.singleImage}
        source = {{uri: `${baseURL}/${fileName}?token=${entryToken}`}}
      />
    </View>
  );
};

export default ImageGrid;
