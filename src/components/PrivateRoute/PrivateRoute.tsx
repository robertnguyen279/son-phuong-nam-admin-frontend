import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from 'actions/user.action';
import { RootState } from 'reducers/index.reducer';
import LoadingScreen from 'components/LoadingScreen';
import { IPrivateRoute } from 'types';

const PrivateRoute = ({ component, ...rest }: IPrivateRoute): React.ReactElement => {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state: RootState) => state.userReducer.user);
  const getUserError = useSelector((state: RootState) => state.userReducer.getUserError);

  useEffect(() => {
    if (user && user.role !== 'user') {
      setLoading(false);
    } else if (user && user.role === user) {
      history.push('/');
    } else {
      dispatch(getUser());
    }
  }, [user]);

  useEffect(() => {
    if (getUserError) {
      history.push('/');
    }
  }, [getUserError]);

  return isLoading ? <LoadingScreen /> : <Route {...rest} component={component} />;
};

export default PrivateRoute;
