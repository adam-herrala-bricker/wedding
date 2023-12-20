import {Image, Pressable, View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-native';
import {setScrollIndex} from '../reducers/viewReducer';
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const entryToken = useSelector((i) => i.user.entryToken);
  const viewImages = useSelector((i) => i.media.viewImages);
  const baseURL = 'https://herrala-bricker-wedding.onrender.com/api/images/web-res/';

  // event handler
  const handlePress = () => {
    const thisIndex = Math.floor(
        viewImages
            .map((i) => i.fileName)
            .indexOf(fileName)/2
    );
    dispatch(setScrollIndex(thisIndex));
    navigate(`/highlight/${fileName}`);
  };

  return (
    <View style = {styles.imageContainer}>
      <Pressable onPress = {handlePress}>
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

// need to change so that clicking on it doesn't change the scroll index
export const ImageWelcome = ({fileName}) => {
  return <ImageBase fileName = {fileName} thisStyle = {styles.welcomeImage}/>;
};

// need to change so that there isn't a button in here
export const ImageHighlight = ({fileName}) => {
  return <ImageBase fileName = {fileName} thisStyle = {styles.highlightImage}/>;
};
