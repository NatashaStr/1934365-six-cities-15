import { useState } from 'react';
import Location from '../../components/blocks/locations/Locations';
import Map from '../../components/blocks/map/Map';
import PlaceCardList from '../../components/blocks/place-card-list/PlaceCardList';
import Select from '../../components/blocks/select/Select';
import { PlaceCardPropsType, CityPropsType, LocationType } from '../../components/blocks/place-card/types';

export default function Main(props: { placesAmount: number; places: Array<PlaceCardPropsType>; cities: Array<CityPropsType>; filters: string[]; city: LocationType }): JSX.Element {
  const [activeCardId, setActiveCardId] = useState<PlaceCardPropsType['id'] | null>(null);
  function onCardHover(placeId: PlaceCardPropsType['id'] | null): void {
    props.places.find((place) => {
      if (place.id === placeId) {
        setActiveCardId(placeId);
      }
    });
  }

  return (
    < div className="page page--gray page--main" >
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <Location cities={props.cities} />
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{props.placesAmount} places to stay in Amsterdam</b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>
                <Select filters = {props.filters}/>
              </form>
              <div className="cities__places-list places__list tabs__content">
                <PlaceCardList places={props.places} onCardHover = {onCardHover}/>
              </div>
            </section>
            <div className="cities__right-section">
              <Map city={props.city} places = {props.places} activeCardId={activeCardId}/>
            </div>
          </div>
        </div>
      </main>
    </div >
  );
}
