// helper functions for quickly getting tokens across different services
import store from '../store';

// entry token
export const getEntryToken = () => {
  // note the method for accessing the state of a store outside of a component
  // (useSelector won't work)
  const currentState = store.getState();
  const entryToken = 'Bearer ' + currentState.user.entryToken;

  return entryToken;
};

// admin token
export const getAdminToken = () => {
  const currentState = store.getState();
  const adminToken = 'Bearer ' + currentState.user.adminToken;

  return adminToken;
};
