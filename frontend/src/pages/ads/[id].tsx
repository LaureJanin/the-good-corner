/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { AdCardProps } from "@/components/AdCard";
import React from "react";

const AdDetail = (): React.ReactNode => {
  const [selectedAd, setSelectedAd] = useState<AdCardProps>();
  
  const router = useRouter();
  const adId = router.query.id;

  // Récupère les data d'une annonce
  const fetchData = async () => {
    try {
      if (adId !== undefined) {
        const result = await axios.get<AdCardProps>(
          `http://localhost:5000/ads/${adId}`
        );
        setSelectedAd(result.data);
        console.log(result.data);
      }
    } catch (err) {
      console.error("error", err);
    }
  };

  useEffect(() => {
    if (typeof adId === "string") {
      fetchData();
    }
  }, [adId]);

  // Supprime une annonce
  const deleteAd = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer l'annonce ?")) {
      try {
        if (adId !== undefined) {
          await axios.delete(`http://localhost:5000/ads/${adId}`);
          router.push("/");
        }
      } catch (err) {
        console.error("Erreur lors de la suppression de l'annonce", err);
      }
    }
  };

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
        {selectedAd != null && (
          <React.Fragment key={selectedAd.id}>
            <h2 className="ad-details-title">{selectedAd.title}</h2>
            <section>
              <div className="ad-details">
                <div className="ad-details-image-container">
                  <img
                    className="ad-details-image"
                    src={selectedAd.imgUrl}
                    alt={selectedAd.title}
                  />
                </div>
                <div className="ad-details-info">
                  <div className="ad-details-price">{selectedAd.price} €</div>
                  <div className="ad-details-description">
                    {selectedAd.description}
                  </div>
                  <hr className="separator" />
                  <div className="ad-details-owner">
                    Annoncée publiée par <b>{selectedAd.owner}</b> <br />
                    <br />
                    {selectedAd.createdAt && (
                      <div>
                        {new Date(selectedAd.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </div>
                    )}
                    <br />
                    <br />
                    {selectedAd.location}
                  </div>
                </div>
              </div>
              <div style={{ maxWidth: "300px", margin: "1rem auto" }}>
                <a
                  href="mailto:`${selectedAd.owner}`"
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
