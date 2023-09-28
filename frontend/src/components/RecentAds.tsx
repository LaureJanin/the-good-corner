import { useState, useEffect } from "react";
import axios from "axios";
import AdCard,  { AdCardProps } from "./AdCard";

type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
};

const RecentAds = (props: RecentAdsProps): React.ReactNode => {
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState<AdCardProps[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [ads, setAds] = useState<AdCardProps[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const AdPrice = (adPrice: number, ad: AdCardProps) => {
    setTotal(total + adPrice);
    setItem([...item, ad]);
    setIsInitialized(true);
  };

  async function fetchAds() {
     let url = `http://localhost:5000/ads?`;

    if (props.categoryId) {
      url += `categoryIn=${props.categoryId}&`;
    }

    if (props.searchWord) {
      url += `searchTitle=${props.searchWord}&`;
    }

    const result = await axios.get(url);
    setAds(result.data);
  }

  useEffect(() => {
    // mounting
    fetchAds();
  }, [props.categoryId, props.searchWord]);

  const pageChange = (newPage: number) => {
    setPage(newPage);
  };

  const previousPage = () => {
    if (page > 1) {
      pageChange(page - 1);
    }
  };

  return (
    <main className="main-content">
      <h2>Annonces récentes</h2>
      <p>Prix total : {total !== null ? `${total} €` : "0 €"}</p>
      <div>
        Panier :{" "}
        {item.length > 0 ? (
          <div>
            <ul>
              {item.map((item, index) => (
                <li key={index}>
                  {item.title} -- {item.price} €
                </li>
              ))}
            </ul>
          </div>
        ) : (
          " Aucun article sélectionné"
        )}
      </div>
      <section className="recent-ads">
        {ads.map((ad) => (
          <div key={ad.id}>
            <AdCard
              id={ad.id}
              imgUrl={ad.imgUrl}
              link={`/ads/${ad.id}`}
              price={ad.price}
              title={ad.title}
              description={ad.description}
              owner={ad.owner}
              location={ad.location}
              createdAt={ad.createdAt}
              category={ad.category}
              tag={ad.tag}
              onDelete={fetchAds}
            />
            <button className="button" onClick={() => AdPrice(ad.price, ad)}>
              Ajouter au panier
            </button>
          </div>
        ))}
      </section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <button className="button" onClick={previousPage}>
          Page précédente
        </button>
        <span>
          Page {page} sur {totalPages}
        </span>
        <button className="button" onClick={() => pageChange(page + 1)}>
          Page suivante
        </button>
      </div>
    </main>
  );
};

export default RecentAds;
