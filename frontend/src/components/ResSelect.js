import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setScroll, setRes} from '../reducers/viewReducer';

// component for selecting resolution of images displayed in highlight view
// (grid view is always web res)
const ClosedView = ({setSelectOpen}) => {
  const textLan = useSelector((i) => i.view.textLan);
  return (
    <div className = 'scene-filter-container'>
      <button onClick = {() => setSelectOpen(true)}>
        {textLan.resolution}
      </button>
    </div>);
};

const OpenView = ({setSelectOpen}) => {
  const {res, textLan} = useSelector((i) => i.view);
  const dispatch = useDispatch();

  // event handler
  const handleChangeRes = (newRes) => {
    dispatch(setRes(newRes));
    dispatch(setScroll(window.scrollY));
  };

  return (
    <div className = 'scene-filter-container'>
      <button
        onClick = {() => setSelectOpen(false)}>
        {textLan.done}
      </button>
      <button
        onClick = {() => handleChangeRes('web')}
        className = {res === 'web'
            ? 'scene-name-highlight'
            : 'scene-name-regular'}>
        {textLan.faster}
      </button>
      <button
        onClick = {() => handleChangeRes('high')}
        className = {res === 'high'
            ? 'scene-name-highlight'
            : 'scene-name-regular'}>
        {textLan.larger}
      </button>
    </div>);
};

const ResSelect = () => {
  const [selectOpen, setSelectOpen] = useState(false);

  return (
    selectOpen
        ? <OpenView setSelectOpen = {setSelectOpen} />
        : <ClosedView setSelectOpen = {setSelectOpen}/>
  );
};

export default ResSelect;
