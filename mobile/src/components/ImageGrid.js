import {Image, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

const styles = StyleSheet.create({
  imageContainer: {
    margin: 2,
    alignItems: 'center',

    flexGrow: 1,
    flexShrink: 1,
  },

  singleImage: {
    height: 200,
    width: 170,
    resizeMode: 'cover',
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
