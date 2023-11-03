/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

export type AdType = {
  id: number;
  title: string;
  description: string;
  owner: string;
  price: number;
  imgUrl: string;
  location: string;
  createdAt: string;
  category: string;
  tag: string;
  link: string;
};

export type AdCardProps = AdType & {
  onDelete?: () => void;
};

const AdCard = (props: AdCardProps): React.ReactNode => {
  return (
    <div className="ad-card-container" key={props.id}>
      <a className="ad-card-link" href={props.link}>
        <img className="ad-card-image" src={props.imgUrl} />
        <div className="ad-card-text">
          <div className="ad-card-title">{props.title}</div>
          <div className="ad-card-price">{props.price} €</div>
        </div>
      </a>
      {props.onDelete && <button className="button">Supprimer</button>}
    </div>
  );
};

export default AdCard;
