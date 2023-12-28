import {useRef} from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  View,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-native';
import {
  setHighlight,
  setSwipeStart,
  setSwipeEnd,
} from '../reducers/mediaReducer';
import {setScrollIndex} from '../reducers/viewReducer';
import theme from '../theme';

const styles = StyleSheet.create({
  imageContainer: {
    margin: 3,
    alignItems: 'center',

    flexShrink: 1,
    zIndex: 1,
    elevation: 1,
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

// base component that all the image components share
const ImageBase = ({fileName, thisStyle}) => {
  const entryToken = useSelector((i) => i.user.entryToken);
  const referer = useSelector((i) => i.view.refPath);
  const baseURL = 'https://herrala-bricker-wedding.onrender.com/api/images/web-res/';

  return (
    <Image
      style = {thisStyle}
      source = {{uri: `${baseURL}/${fileName}?token=${entryToken}`,
        headers: {Referer: referer}}}
      referrerPolicy='origin'
    />
  );
};

// component for images in the grid view
export const ImageGrid = ({fileName}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const viewImages = useSelector((i) => i.media.viewImages);

  // event handler
  const handlePress = () => {
    // for returning to the same place after exiting highlight view
    const thisIndex = Math.floor(
        viewImages
            .map((i) => i.fileName)
            .indexOf(fileName)/2);
    dispatch(setScrollIndex(thisIndex));
    dispatch(setHighlight(fileName));
    navigate('/highlight');
  };

  return (
    <View style = {styles.imageContainer}>
      <Pressable onPress = {handlePress}>
        <ImageBase fileName = {fileName} thisStyle = {styles.gridImage}/>
      </Pressable>
    </View>
  );
};

// component for the image on the welcome page
export const ImageWelcome = ({fileName}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlePress = () => {
    // no index-setting here
    dispatch(setHighlight(fileName));
    navigate('/highlight');
  };

  return (
    <View style = {styles.imageContainer}>
      <Pressable onPress = {handlePress}>
        <ImageBase fileName = {fileName} thisStyle = {styles.welcomeImage}/>
      </Pressable>
    </View>);
};

// component for images in highlight view
export const ImageHighlight = ({fileName}) => {
  const dispatch = useDispatch();

  // for animation
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
        [null, {dx: pan.x, dy: pan.y}],
        {useNativeDriver: false}),
    onPanResponderRelease: (event, gesture) => {
      const {x0, y0, moveX, moveY} = gesture;
      dispatch(setSwipeStart({x: x0, y: y0}));
      dispatch(setSwipeEnd({x: moveX, y: moveY}));
      Animated
          .spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: true,
            damping: 30,
          })
          .start();
    },
  })).current;

  return (
    <View style = {styles.imageContainer}>
      <Animated.View
        style={{
          transform: [{translateX: pan.x}, {translateY: pan.y}],
        }}
        {...panResponder.panHandlers}>
        <ImageBase fileName = {fileName} thisStyle = {styles.highlightImage}/>
      </Animated.View>
    </View>
  );
};
