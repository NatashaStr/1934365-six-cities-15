import Favorites from '../../pages/favorites-page/Favorites';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from '../../pages/main-page/Main';
import Offer from '../../pages/offer-page/Offer';
import { PLACES_AMOUNT } from '../utils/constants';
import { AppRoute } from '../utils/types';
import Login from '../../pages/login-page/Login';
import NotFound from '../../pages/not-found-page/NotFound';
import PrivateRoute from '../blocks/private-route/PrivateRoute';
import { HelmetProvider } from 'react-helmet-async';
import Layout from '../layout/layout/Layout';
import { getAutorizationStatus } from '../utils/utils';
import { CityPropsType, PlaceCardPropsType } from '../utils/mocks';

export default function App(props: {places: Array<PlaceCardPropsType>, cities: Array<CityPropsType>}): JSX.Element {
  const autorizationStatus = getAutorizationStatus();

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path={AppRoute.Root} element={<Layout />} >
            <Route index element={<Main placesAmount={PLACES_AMOUNT} places = {props.places} cities={props.cities} />} />
            <Route path={AppRoute.Login} element={
              <PrivateRoute autorizationStatus={autorizationStatus} isReverse>
                <Login />
              </PrivateRoute>
            }
            />
            <Route path={AppRoute.Favorites} element={
              <PrivateRoute autorizationStatus={autorizationStatus}>
                <Favorites />
              </PrivateRoute>
            }
            />
            <Route path={AppRoute.Offer} element={<Offer />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
