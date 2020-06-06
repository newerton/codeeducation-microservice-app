import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddle from 'redux-saga';

import rootSaga from './root-saga';
import upload from './upload';

const sagaMiddleware = createSagaMiddle();
const store = createStore(
  combineReducers({
    upload,
  }),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;
