import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { ProtectedRoute } from '../../protected-route/';
import { fetchUser, selectUserData } from '../../services/slices/userSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { closeOrderModalData } from '../../services/slices/orderSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isChecked = useSelector(selectUserData);

  const backgroundLocation = location.state?.background;
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;
  const orderTitle = orderNumber ? `#${orderNumber.padStart(6, '0')}` : '';

  useEffect(() => {
    if (!isChecked) {
      dispatch(fetchUser());
    }
    dispatch(fetchIngredients());
  }, [isChecked]);

  const closeModalData = () => {
    navigate(-1);
    dispatch(closeOrderModalData());
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали ингредиента
              </p>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <p
                className={`text text_type_digits-default ${styles.detailHeader}`}
              >
                {orderTitle}
              </p>
              <OrderInfo />
            </div>
          }
        />

        <Route element={<ProtectedRoute isUnauthorize />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route
            path='/profile/orders/:number'
            element={
              <div className={styles.detailPageWrap}>
                <p
                  className={`text text_type_digits-default ${styles.detailHeader}`}
                >
                  {orderTitle}
                </p>
                <OrderInfo />
              </div>
            }
          />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={orderTitle} onClose={closeModalData}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModalData}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal title={orderTitle} onClose={closeModalData}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
