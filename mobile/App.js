import {NativeRouter} from 'react-router-native';
import {Provider} from 'react-redux';
import Main from './src/components/Main';

import store from './src/store';

const App = () => {
  return (
    <>
      <Provider store = {store}>
        <NativeRouter>
          <Main />
        </NativeRouter>
      </Provider>
    </>
  );
};

export default App;
