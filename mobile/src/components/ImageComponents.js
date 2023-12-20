import {Image, Pressable, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-native';
import theme from '../theme';

const styles = StyleSheet.create({
  imageContainer: {
    margin: 3,
    alignItems: 'center',

    flexShrink: 1,
  },

  gridImage: {
    height: 200,
    width: 170,
    resizeMode: 'cover',
    borderRadius: theme.radii.subtle,
  },

  welcomeImage: {
    height: 400,
    width: 300,
    resizeMode: 'cover',
    borderRadius: theme.radii.subtle,
  },

  highlightImage: {
    height: '90%',
    width: 380,
    resizeMode: 'contain',
  },
});

const ImageBase = ({fileName, thisStyle}) => {
  const navigate = useNavigate();
  const entryToken = useSelector((i) => i.user.entryToken);
  const baseURL = 'https://herrala-bricker-wedding.onrender.com/api/images/web-res/';

  return (
    <View style = {styles.imageContainer}>
      <Pressable onPress = {() => navigate(`/highlight/${fileName}`)}>
        <Image
          style = {thisStyle}
          source = {{uri: `${baseURL}/${fileName}?token=${entryToken}`}}
        />
      </Pressable>
    </View>
  );
};

export const ImageGrid = ({fileName}) => {
  return <ImageBase fileName = {fileName} thisStyle = {styles.gridImage}/>;
};

export const ImageWelcome = ({fileName}) => {
  return <ImageBase fileName = {fileName} thisStyle = {styles.welcomeImage}/>;
};

export const ImageHighlight = ({fileName}) => {
  return <ImageBase fileName = {fileName} thisStyle = {styles.highlightImage}/>;
};
