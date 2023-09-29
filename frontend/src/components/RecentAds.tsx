import { useState, useEffect } from "react";
import axios from "axios";
import AdCard, { AdCardProps } from "./AdCard";

type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
};

const RecentAds = (props: RecentAdsProps): React.ReactNode => {
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState<AdCardProps[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [ads, setAds] = useState<AdCardProps[]>([]);
  const [priceSort, setPriceSort] = useState("");
  const [page, setPage] = useState(1);

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
    
    const orderByPrice = priceSort 
    if (orderByPrice) {
      url += `orderByPrice=${orderByPrice}&`;
    }

    if (props.searchWord) {
      url += `searchTitle=${props.searchWord}&`;
    }

    url += `skip=${(page - 1) * 9}&take=9`;

    const result = await axios.get(url);

    setAds(result.data);
  }

  useEffect(() => {
    // mounting
    fetchAds();
  }, [props.categoryId, props.searchWord, page, priceSort]);

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
      <form className="text-field-with-button">
        <select
          name="category"
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
        >
          <option value="">-- Trier par --</option>
          <option value="ASC">Prix croissant</option>
          <option value="DESC">Prix décroissant</option>
        </select>
      </form>
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
        <span>Page {page}</span>
        <button
          className="button"
          onClick={() => pageChange(page + 1)}
          disabled={ads.length === 0 || ads.length < 9}
        >
          Page suivante
        </button>
      </div>
    </main>
  );
};

export default RecentAds;
