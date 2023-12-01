/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import AdCard, { AdCardProps, AdType } from "./AdCard";
import { useQuery } from "@apollo/client";
import { queryAllAds } from "@/graphql/queryAllAds";
import Link from "next/link";

type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
  priceSort?: string;
  page?: number;
  perPage?: number;
};

const RecentAds = (props: RecentAdsProps): React.ReactNode => {
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState<AdCardProps[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [priceSort, setPriceSort] = useState("");
  const [pageSize, setPageSize] = useState(6);
  const [page, setPage] = useState(0);

  // Sert à ajouter les prix dans un panier mais rien n'est sauvegardé dans le back
  const AdPrice = (adPrice: number, ad: AdCardProps) => {
    setTotal(total + adPrice);
    setItem([...item, ad]);
    setIsInitialized(true);
  };

  // On envoie une query au back, on lui passe une variable where pour trier par categorie et par la recherche et une variable de tri par prix et gestion de la pagination
  const { data: dataAds } = useQuery<{ allAds: AdType[]; count: number }>(
    queryAllAds,
    {
      variables: {
        where: {
          ...(props.categoryId ? { categoryIn: [props.categoryId] } : {}),
          ...(props.searchWord ? { searchTitle: props.searchWord } : {}),
        },
        priceSort: priceSort,
        skip: page * pageSize,
        take: pageSize,
      },
    }
  );
  const ads = dataAds ? dataAds.allAds : [];

  // Pagination
  const count = dataAds ? dataAds.count : 0;
  const pagesCount = Math.ceil(count / pageSize);
  function onPageSizeChange(newValue: number) {
    const newPagesCount = Math.ceil(count / newValue);
    if (page >= newPagesCount) {
      setPage(Math.max(newPagesCount - 1, 0));
    }
    setPageSize(newValue);
  }

  return (
    <main className="main-content">
      <h2>Annonces récentes</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <form>
          <label>Trier par prix : </label>
          <select
            className="text-field"
            name="category"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="">-- Trier par --</option>
            <option value="ASC">Prix croissant</option>
            <option value="DESC">Prix décroissant</option>
          </select>
        </form>
        <Link href="/ads/adsByTags" className="button">
          <span>Recherche par tags</span>
        </Link>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
        }}
      >
        <p>Nombre de résultats par page ?</p>
        <button className="button" onClick={() => onPageSizeChange(5)}>
          5
        </button>
        <button className="button" onClick={() => onPageSizeChange(10)}>
          10
        </button>
        <button className="button" onClick={() => onPageSizeChange(20)}>
          20
        </button>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          justifyContent: "space-between",
        }}
      >
        <button
          className="button"
          disabled={page === 0}
          onClick={() => setPage(Math.max(page - 1, 0))}
        >
          Précédent
        </button>
        <p>
          {page + 1}/{count}
        </p>
        <button
          className="button"
          disabled={page === pagesCount - 1}
          onClick={() => setPage(Math.min(page + 1, pagesCount))}
        >
          Suivant
        </button>
      </div>
      <br />
      {/* <p>Prix total : {total !== null ? `${total} €` : "0 €"}</p>
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
      </div> */}
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
              tags={ad.tags}
              //onDelete={fetchAds}
            />
            <button className="button" onClick={() => AdPrice(ad.price, ad)}>
              Ajouter au panier
            </button>
          </div>
        ))}
      </section>
    </main>
  );
};

export default RecentAds;
