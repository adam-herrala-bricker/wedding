// Finnish-English dictionary for all the text displayed on the screen
import store from '../store';
import dictionary from './dictionary';

// returns only the text you want in only the current language
export const getText = (key) => {
  const currentState = store.getState();
  const lan = currentState.view.lan;

  // only return values if they're in here
  if (dictionary[key]) {
    return dictionary[key][lan];
  }

  return false;
};
