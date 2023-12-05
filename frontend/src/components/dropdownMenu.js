import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setScroll} from '../reducers/viewReducer';
import {createNewScene, deleteScene, setLoaded} from '../reducers/sceneReducer';
import {filterImages} from '../reducers/mediaReducer';

const InactiveView = ({setIsActive}) => {
  const textLan = useSelector((i) => i.view.textLan);
  return (
    <div className = 'scene-filter-container'>
      <button onClick = {() => setIsActive(true)}>{textLan.filter}</button>
    </div>);
};

const CurrentScenes = () => {
  const dispatch = useDispatch();
  const user = useSelector((i) => i.user);
  const scenes = useSelector((i) => i.scenes.list);
  const loadedScene = useSelector((i) => i.scenes.loaded);
  const textLan = useSelector((i) => i.view.textLan);

  // event handlers
  const handleSceneChange = async (scene) => {
    dispatch(setScroll(window.scrollY));
    dispatch(filterImages({user, scene}));
    dispatch(setLoaded(scene.sceneName));
  };

  const handleDeleteScene = async (scene) => {
    // eslint-disable-next-line max-len
    if (window.confirm(`Are you sure you want to delete scene ${scene.sceneName}?`)) {
      dispatch(deleteScene(scene));
    }
  };

  return (
    scenes.map((i) =>
      <div key = {i.id}>
        <button key = {`${i.id}-fil`}
          className = {i.sceneName === loadedScene
            ? 'scene-name-highlight'
            : 'scene-name-regular'}
          onClick = {() => {
            handleSceneChange(i);
          }}>
          {textLan[i.sceneName.replace('-', '')] || i.sceneName}
        </button>
        {user.adminToken
        && <button key = {`${i.id}-del`} onClick = {() => handleDeleteScene(i)}>
          -
        </button>
        }
      </div>)
  );
};

const CreateNewScene = () => {
  const dispatch = useDispatch();
  const scenes = useSelector((i) => i.scenes.list);
  const textLan = useSelector((i) => i.view.textLan);

  // helper function for new scene name
  const newSceneName = () => {
    // currently no scenes
    if (scenes.length === 0 ) {
      return 'scene-0';
    }
    // scene with the largest number
    const maxScene = Math
        .max(...scenes
            .map((i) => Number(i.sceneName.split('-')[1])));

    return (`scene-${maxScene + 1}`);
  };

  // event handler
  const handleCreateNew = async () => {
    dispatch(createNewScene(newSceneName()));
  };

  return (<button onClick = {handleCreateNew}>{textLan.new}</button>);
};

const ActiveView = ({setIsActive}) => {
  const user = useSelector((i) => i.user);
  const textLan = useSelector((i) => i.view.textLan);

  return (
    <div id = 'scenes' className = 'scene-filter-container'>
      <button onClick = {() => setIsActive(false)}>{textLan.done}</button>
      <CurrentScenes setImageList />
      {user.adminToken && <CreateNewScene />}
    </div>);
};

const DropDown = () => {
  const loadedScene = useSelector((i) => i.scenes.loaded);

  // make it a little nicer for users:
  // keep menu open if there's a (non all/kakki) scene loaded
  const activeDefault = loadedScene && loadedScene !== 'scene-0'
    ? true
    : false;

  const [isActive, setIsActive] = useState(activeDefault);

  return (
    <div>
      {isActive
        ? <ActiveView setIsActive = {setIsActive} />
        : <InactiveView setIsActive = {setIsActive} />
      }
    </div>);
};

export default DropDown;
