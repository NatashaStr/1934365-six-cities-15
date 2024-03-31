import { Helmet } from 'react-helmet-async';
import OfferGalleryItem from '../../components/blocks/offer-gallery-item/OfferGalleryItem';
import PlaceCard from '../../components/blocks/place-card/PlaceCard';
import { AuthorizationStatus, RequestStatus } from '../../components/utils/types';
import { getRatingStatus } from '../../components/utils/utils';
import ReviewsList from '../../components/blocks/reviews-list/ReviewsList';
import Map from '../../components/blocks/map/Map';
import { IMAGE_WIDTH, IMAGE_HEIGHT, NEAR_PLACES_AMOUNT } from '../../components/utils/constants';
import classNames from 'classnames';
import { useActionCreators, useAppSelector } from '../../store/hooks';
import { fullOfferActions, fullOfferSliceSelectors } from '../../store/slices/full-offer';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../../components/ui/loader/loader';
import NotFound from '../not-found-page/NotFound';
import { reviewActions, reviewSliceSelectors } from '../../store/slices/review';
import { getSortedReviews } from './utils';
import { userSliceSelectors } from '../../store/slices/user';

export default function OfferPage(): JSX.Element {
  const fullOffer = useAppSelector(fullOfferSliceSelectors.offer);
  const nearPlaces = useAppSelector(fullOfferSliceSelectors.nearbyOffers);
  const status = useAppSelector(fullOfferSliceSelectors.status);
  const reviews = useAppSelector(reviewSliceSelectors.reviews);
  const authStatus = useAppSelector(userSliceSelectors.userStatus);

  const { fetchFullOffer, fetchNearbyOffers } = useActionCreators(fullOfferActions);
  const { fetchComments } = useActionCreators(reviewActions);

  const { id } = useParams();
  useEffect(() => {
    Promise.all([fetchFullOffer(id as string), fetchNearbyOffers(id as string), fetchComments(id as string)]);
  }, [fetchFullOffer, fetchNearbyOffers, fetchComments, id]);

  const activeCardId = fullOffer?.id;
  const nearPlacesShortened = nearPlaces?.slice(0, NEAR_PLACES_AMOUNT);
  const nearPlacesPlusCurrent = [...nearPlacesShortened, fullOffer];
  const sortedReviews = getSortedReviews(reviews);

  if (status === RequestStatus.Loading) {
    return (
      <Loader />
    );
  }

  if (status === RequestStatus.Failed || !fullOffer) {
    return (
      <NotFound />
    );
  }

  return (
    <div className="page">
      <Helmet>
        <title>Предложение по аренде жилья</title>
      </Helmet>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {fullOffer.images?.map((image) => (
                <OfferGalleryItem key={image} image={image} />
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              <div className="offer__mark">
                <span>Premium</span>
              </div>
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {fullOffer?.title}
                </h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${getRatingStatus(fullOffer ? fullOffer.rating : 0)}%` }}></span>
                  <span className="visually-hidden">{fullOffer?.rating}</span>
                </div>
                <span className="offer__rating-value rating__value">{fullOffer?.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {fullOffer?.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {fullOffer?.bedrooms !== undefined && fullOffer?.bedrooms > 1 ? `${fullOffer?.bedrooms} Bedrooms` : `${fullOffer?.bedrooms} Bedroom`}
                </li>
                <li className="offer__feature offer__feature--adults">
                  {fullOffer?.maxAdults !== undefined && fullOffer?.maxAdults > 1 ? `Max ${fullOffer?.maxAdults} adults` : `Max ${fullOffer?.maxAdults} adult`}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{fullOffer?.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {
                    fullOffer?.goods?.map((good) => (
                      <li className="offer__inside-item" key={good}>
                        {good}
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={classNames(
                    'offer__avatar-wrapper user__avatar-wrapper',
                    { 'offer__avatar-wrapper--pro': fullOffer?.host?.isPro === true }
                  )}
                  >
                    <img className="offer__avatar user__avatar" src={fullOffer?.host?.avatarUrl} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">
                    {fullOffer?.host?.name}
                  </span>
                  {fullOffer?.host?.isPro ? <span className="offer__user-status">Pro</span> : null}
                </div>
                <div className="offer__description">
                  <p className="offer__text">
                    {fullOffer?.description}
                  </p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{reviews?.length}</span></h2>
                <ReviewsList isAuth={authStatus === AuthorizationStatus.Auth} reviews={sortedReviews} />
              </section>
            </div>
          </div>
          <Map
            city={fullOffer?.city}
            places={nearPlacesPlusCurrent}
            activeCityName={fullOffer?.city.name}
            activeCardId={activeCardId}
            className='offer__map'
          />
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighborhood</h2>
            <div className="near-places__list places__list">
              {
                nearPlacesShortened.map((card) => (
                  <PlaceCard
                    key={card.id}
                    card={card}
                    className={'near-places'}
                    width={IMAGE_WIDTH.large}
                    height={IMAGE_HEIGHT.large}
                  />
                ))
              }
            </div>
          </section>
        </div>
      </main >
    </div >
  );
}
