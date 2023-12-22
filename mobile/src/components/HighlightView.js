import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-native';
import {resetReturnToGrid} from '../reducers/mediaReducer';
import {ImageHighlight} from './ImageComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

const HighlightView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileName = useSelector((i) => i.media.highlight);
  const returnToGrid = useSelector((i) => i.media.returnToGrid);

  // checks whether we should navigate back to the grid view
  // trigered by a swipe up or down
  useEffect(() => {
    if (returnToGrid) {
      // need to reset before navigating back
      dispatch(resetReturnToGrid());
      navigate('/grid');
    }
  }, [returnToGrid]);

  return (
    <View style = {styles.container}>
      <ImageHighlight fileName = {fileName} />
    </View>
  );
};

export default HighlightView;
