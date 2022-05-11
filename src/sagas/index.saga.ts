import { all } from 'redux-saga/effects';
import userSaga from './user.saga';
import productSaga from './product.saga';
import blogSagas from './blog.saga';
import carouselSaga from './carousel.saga';

export default function* rootSaga(): Generator {
  yield all([...userSaga, ...productSaga, ...blogSagas, ...carouselSaga]);
}
