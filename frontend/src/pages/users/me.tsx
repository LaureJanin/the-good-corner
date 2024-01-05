import AdCard, { AdType } from "@/components/AdCard";
import Layout from "@/components/Layout";
import { queryAdsByUser } from "@/graphql/mutationAdsByUser";
import { queryMe } from "@/graphql/queryMe";
import { UserType } from "@/types";
import { useQuery } from "@apollo/client";
import { useState } from "react";

export default function Me(): React.ReactNode {
  // to use to get current user
  const { data: meData } = useQuery<{ item: UserType | null }>(queryMe);
  const me = meData?.item;

  console.log(me);

  // get ads by user
  const { data: dataAds } = useQuery(queryAdsByUser, {
    variables: { userId: me?.id },
  });
  const adsUser: AdType[] = dataAds ? dataAds.user?.ads : [];

  return (
    <Layout title="Mon profile">
      <main className="main-content">
        <p>Connecté en tant que : {me?.email}</p>
        <h2>Mes annonces</h2>
        <section className="recent-ads">
          {adsUser.map((ad) => (
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
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
}
