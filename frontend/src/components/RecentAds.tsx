import { useState } from "react";
import AdCard, { AdCardProps, AdType } from "./AdCard";
import { useQuery } from "@apollo/client";
import { queryAllAds } from "@/graphql/queryAllAds";

type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
  priceSort?: string;
};

const RecentAds = (props: RecentAdsProps): React.ReactNode => {
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState<AdCardProps[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [priceSort, setPriceSort] = useState("");
  const [page, setPage] = useState(1);

  // Sert à ajouter les prix dans un panier mais rien n'est sauvegarder dans le back
  const AdPrice = (adPrice: number, ad: AdCardProps) => {
    setTotal(total + adPrice);
    setItem([...item, ad]);
    setIsInitialized(true);
  };

  // On passe une query au back, on lui passe une variable where pour trier par categorie et par la recherche et une variable de tri par prix
  const { data } = useQuery<{ allAds: AdType[] }>(queryAllAds, {
    variables: {
      where: {
        ...(props.categoryId ? { categoryIn: [props.categoryId] } : {}),
        ...(props.searchWord ? { searchTitle: props.searchWord } : {}),
      },
      priceSort: priceSort,
    },
  });
  const ads = data ? data.allAds : [];

  // Pour l'instant la pagination ne marche plus
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
              //onDelete={fetchAds}
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
