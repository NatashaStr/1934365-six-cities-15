import { Link } from 'react-router-dom';
import { PlaceCardPropsType } from './types';
import { AppRoute } from '../../utils/types';
import Button from '../../ui/button/Button';

export default function PlaceCard({ card, onCardHover}: { card: PlaceCardPropsType; onCardHover?: (id: string | null) => void}): JSX.Element {
  const handleMouseEnter = (): void => {
    onCardHover?.(card.id);
  };

  const handleMouseLeave = (): void => {
    onCardHover?.(null);
  };

  return (
    <Link to={AppRoute.Offer}>
      <article className={`${card.className}__card place-card`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {card.isPremium ? <div className="place-card__mark"><span>Premium</span></div> : ''}
        <div className={`${card.className}__image-wrapper place-card__image-wrapper"`}>
          <a href="#">
            <img className="place-card__image" src={card.previewImage} width={card.width} height={card.height} alt="Place image" />
          </a>
        </div>
        <div className={`${card.className}__card-info place-card__info"`}>
          <div className="place-card__price-wrapper">
            <div className="place-card__price">
              <b className="place-card__price-value">&euro;{card.price}</b>
              <span className="place-card__price-text">&#47;&nbsp;night</span>
            </div>
            <Button />
          </div>
          <div className="place-card__rating rating">
            <div className="place-card__stars rating__stars">
              <span style={{ width: '80%' }}></span>
              <span className="visually-hidden">Rating</span>
            </div>
          </div>
          <h2 className="place-card__name">
            <a href="#">{card.title}</a>
          </h2>
          <p className="place-card__type">{card.type}</p>
        </div>
      </article>
    </Link>
  );
}


