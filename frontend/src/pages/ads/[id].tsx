/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { AdType } from "@/components/AdCard";
import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { queryAdById } from "@/graphql/queryAdById";
import { mutationDeletedAd } from "@/graphql/mutationDeletedAd";

const AdDetail = (): React.ReactNode => {
  const router = useRouter();
  const adId = router.query.id as string;

  // Récupère les datas de l'annonce
  const { data } = useQuery<{ ad: AdType }>(queryAdById, {
    variables: { adId: adId },
    skip: adId === undefined,
  });
  const ad = data ? data.ad : null;

  // Supprime une annonce
  const [doDelete] = useMutation(mutationDeletedAd);
  // On passe l'id de l'annonce en variable
  async function deleteAd() {
    await doDelete({
      variables: {
        deleteAdId: adId,
      },
    });
    router.push("/");
  }

  // Redirige l'internaute sur la page d'édition de l'annonce
  const editAd = () => {
    if (adId !== undefined) {
      const editUrl = `/ads/new?id=${adId}`;
      router.push(editUrl);
    }
  };

  return (
    <Layout title="Ad">
      <main className="main-content">
        {ad != null && (
          <React.Fragment key={ad.id}>
            <h2 className="ad-details-title">{ad.title}</h2>
            <section>
              <div className="ad-details">
                <div className="ad-details-image-container">
                  <img
                    className="ad-details-image"
                    src={ad.imgUrl}
                    alt={ad.title}
                  />
                </div>
                <div className="ad-details-info">
                  <div className="ad-details-price">{ad.price} €</div>
                  <div className="ad-details-description">{ad.description}</div>
                  <hr className="separator" />
                  <div className="ad-details-owner">
                    Annoncée publiée par <b>{ad.owner}</b> <br />
                    <br />
                    {ad.createdAt && (
                      <div>
                        {new Date(ad.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    )}
                    <br />
                    <br />
                    {ad.location}
                  </div>
                </div>
              </div>
              <div style={{ maxWidth: "300px", margin: "1rem auto" }}>
                <a
                  href="mailto:`${ad.owner}`"
                  className="button button-primary link-button"
                  style={{ width: "200px", margin: "1rem" }}
                >
                  Envoyer un email
                </a>
                <button
                  className="button"
                  onClick={deleteAd}
                  style={{ width: "200px", margin: "1rem" }}
                >
                  Supprimer l'annonce
                </button>
                <button
                  className="button"
                  onClick={editAd}
                  style={{ width: "200px", margin: "1rem" }}
                >
                  Modifier l'annonce
                </button>
              </div>
            </section>
          </React.Fragment>
        )}
      </main>
    </Layout>
  );
};

export default AdDetail;
