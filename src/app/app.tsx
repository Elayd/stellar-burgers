import { ConstructorPage, Feed, NotFound404 } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Routes, Route, useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/ingredients/:id'
          element={<div>Ingredients details</div>}
        />
        <Route path='/feed/:number' element={<div>Info feed</div>} />

        <Route path='/profile' element={<div>Profile</div>} />
        <Route path='/profile/orders' element={<div>Orders</div>} />
        <Route path='/profile/orders/:number' element={<div>Order</div>} />

        <Route path='/login' element={<div>Login</div>} />
        <Route path='/register' element={<div>register</div>} />
        <Route path='/forgot-password' element={<div>Forgot password</div>} />
        <Route path='/reset-password' element={<div>reset password</div>} />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={<div> Modal ingredients</div>}
          />
          <Route path='/feed/:number' element={<div>Modal order info</div>} />
          <Route path='/profile/orders/:number' element={<div>order</div>} />
        </Routes>
      )}
    </div>
  );
};

export default App;
