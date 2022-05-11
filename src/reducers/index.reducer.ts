import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import productReducer from './product.reducer';
import blogReducer from './blog.reducer';
import carouselReducer from './carousel.reducer';

const rootReducer = combineReducers({
  userReducer,
  productReducer,
  blogReducer,
  carouselReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
