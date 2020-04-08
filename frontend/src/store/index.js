import { createStore, applyMiddleware } from 'redux';
import createSagaMiddle from 'redux-saga';
import reducer from './upload';
import rootSaga from './root-saga';

const sagaMiddleware = createSagaMiddle();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
