import {useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {ProgressBar} from 'react-bootstrap';
import {setScroll} from '../reducers/viewReducer';
import {updateImages, deleteImage} from '../reducers/mediaReducer';
import ResSelect from './ResSelect';
import DropDown from './dropdownMenu.js';

// component for rendering each image
const Image = ({imagePath}) => {
  const webResURL = '/api/images/web-res';
  const [thisClass, setThisClass] = useState('single-image-hidden');
  const user = useSelector((i) => i.user);

  // event handler
  const handleLoaded = () => {
    setThisClass('single-image');
  };

  return (
    <div className = 'single-image-container'>
      <img
        className = {thisClass}
        name = {`gridImage${imagePath}`}
        alt = 'single image'
        loading = 'eager'
        src = {`${webResURL}/${imagePath}?token=${user.entryToken}`}
        onLoad = {handleLoaded}/>
    </div>);
};

// component for rendering everything below an image
const BelowImage = ({imageData}) => {
  const dispatch = useDispatch();
  const scenes = useSelector((i) => i.scenes.list);
  const imageList = useSelector((i) => i.media.images.display);
  const textLan = useSelector((i) => i.view.textLan);
  const imageID = imageData.id;

  // helper function for testing whether the image is aleady linked to a scene
  const isLinked = (scene, imageID) => {
    if (imageList
        .find((i) => i.id === imageID).scenes
        .map((i) => i.sceneName)
        .includes(scene.sceneName)) {
      return true;
    } else {
      return false;
    }
  };

  // event handlers
  const handleDelete = async (imageID) => {
    if (window.confirm('Are you sure you want to delete?')) {
      dispatch(deleteImage(imageID));
    }
  };

  // handles linking/unlinking scenes to images
  const handleSceneLink = async (scene, imageID) => {
    dispatch(setScroll(window.scrollY)); // keep from jumping around afterwards

    // update image DB (object formatted as value = array of list of image IDs)
    const currentScenes = imageList.find((i) => i.id === imageID).scenes;

    const newScenes = isLinked(scene, imageID)
        ? currentScenes.map((i) => i.id).filter((i) => i !== scene.id)
        : [...currentScenes.map((i) => i.id), scene.id];

    dispatch(updateImages(imageID, newScenes));
  };

  return (
    <div className = 'under-image-container'>
      <button onClick = {() => handleDelete(imageID)}>-</button>
      {scenes.map((i) =>
        <button
          className = {isLinked(i, imageID)
              ? 'scene-linked'
              : 'scene-unlinked'}
          key = {i.id}
          name = {`${imageData.fileName}-${i.sceneName}`}
          onClick = {() => handleSceneLink(i, imageID)}>
          {textLan[i.sceneName.replace('-', '')] || i.sceneName}
        </button>)}
    </div>);
};

// component for grouping together each rendered image
const ImageGroup = ({groupClass, setGroupClass}) => {
  // how many images have loaded
  const [loadProgress, setLoadProgress] = useState(0);
  const progressRef = useRef(0);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((i) => i.user);
  const imageList = useSelector((i) => i.media.images.display);
  const textLan = useSelector((i) => i.view.textLan);

  const handleToHighlight = (fileName) => {
    dispatch(setScroll(window.scrollY));
    navigate(`/view/${fileName}`);
  };

  // Note: this seems to trigger on every load in the children elements,
  // not when they're all loaded
  const handleNewLoad = () => {
    // doing this as a ref decouples it from rendering,
    // lets it update multiple times per render
    progressRef.current++;
    setLoadProgress(progressRef.current);

    progressRef.current === imageList.length && setGroupClass('image-grouping');
  };

  return (
    <div>
      {groupClass === 'group-hidden' &&
      <div>
        {textLan.loading} {loadProgress}/{imageList.length}
      </div>}
      {groupClass === 'group-hidden' &&
      <ProgressBar
        now = {loadProgress}
        max = {imageList.length}
        style = {{maxWidth: 500}}/>}
      <div
        className = 'image-grouping'
        name = 'image-grouping'
        onLoad = {handleNewLoad}>
        {imageList.map((i) =>
          <div id = {`group${i.fileName}`} key = {i.id}>
            <button
              className = {i.scenes.map((i) => i.sceneName).includes('scene-0')
                  ? 'image-button'
                  : 'hidden-image'}
              name = {`button${i.fileName}`}
              onClick = {() => handleToHighlight(i.fileName)}>
              <Image key = {`${i.id}-img`} imagePath = {i.fileName} />
            </button>
            {user.adminToken &&
            <BelowImage key = {`${i.id}-bel`} imageData = {i}/>}
          </div>)}
      </div>
    </div>);
};

// root component for this module
const Images = () => {
  // keeping track of whether the progress bar is hidden
  const [groupClass, setGroupClass] = useState('group-hidden');
  const textLan = useSelector((i) => i.view.textLan);

  return (
    <div>
      <h2 id = 'image-top' className = 'new-section'>{textLan.photos}</h2>
      <p>{textLan.photoTxt}</p>
      {groupClass !== 'group-hidden' && <ResSelect/>}
      {groupClass !== 'group-hidden' && <DropDown/>}
      <ImageGroup groupClass = {groupClass} setGroupClass = {setGroupClass}/>
    </div>);
};

export default Images;
