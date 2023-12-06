// reducer for assorted states that handle the view the user is given:
// language, scroll height, resolution
import {createSlice} from '@reduxjs/toolkit';
import dictionary from '../resources/dictionary';

//  initial state
const defaultTextAll = dictionary; //  keep fixed - only change in dictionary.js
const defaultLan = 'suo'; //  options are 'suo' or 'eng'
const defaultRes = 'web'; //  options are 'web' or 'high'
const defaultScroll = 0; // verical scroll height

// helper for setting object
// (textLan = text object in just the language given by lan)
const asObject = (textAll, textLan, lan, res, scroll) => {
  return {textAll, textLan, lan, res, scroll};
};

// helper for getting textObject in the right language
const selectedLan = (textObject, lan) => {
  const textOut = Object.keys(textObject).reduce((accumulator, thisKey) => {
    const thisValue = textObject[thisKey][lan];

    return {...accumulator, [thisKey]: thisValue};
  }, {});

  return textOut;
};

// main slice
const viewSlice = createSlice({
  name: 'view',

  initialState: asObject(
      defaultTextAll,
      selectedLan(defaultTextAll, defaultLan),
      defaultLan,
      defaultRes,
      defaultScroll),

  reducers: {
    setLan(state, action) {
      const newLan = action.payload;
      return {
        ...state,
        lan: newLan,
        textLan: selectedLan(state.textAll, newLan),
      };
    },

    setScroll(state, action) {
      return {...state, scroll: action.payload};
    },

    setRes(state, action) {
      return {...state, res: action.payload};
    },
  },
});

export const {setLan, setScroll, setRes} = viewSlice.actions;

export default viewSlice.reducer;
