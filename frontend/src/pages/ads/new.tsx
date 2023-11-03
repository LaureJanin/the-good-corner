import Layout from "@/components/Layout";
import { FormEvent, SetStateAction, useEffect, useState } from "react";
import { CategoryType } from "@/components/Category";
import { useRouter } from "next/router";
import { AdType } from "@/components/AdCard";
import { queryAdById } from "@/graphql/queryAdById";
import { useMutation, useQuery } from "@apollo/client";
import { queryAllCategories } from "@/graphql/queryAllCategories";
import { mutationCreatedAd } from "@/graphql/mutationCreateAd";
import { mutationUpdatedAd } from "@/graphql/mutationUpdateAd";
import { queryAllAds } from "@/graphql/queryAllAds";

type AdFormData = {
  id: number;
  title: string;
  description: string;
  owner: string;
  price: number;
  imgUrl: string;
  location: string;
  createdAt: Date;
  category: { id: number };
};

const NewAd = () => {
  const [error, setError] = useState<"title" | "price">();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [formData, setFormData] = useState<AdFormData>({
    id: 0,
    title: "",
    description: "",
    owner: "",
    price: 0,
    imgUrl: "",
    location: "",
    createdAt: new Date(),
    category: { id: 0 },
  });

  const router = useRouter();
  const { id } = router.query;

  // Permet d'afficher ou de modifier l'image
  const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Permet une preview de l'image
    const imagePreview = (event: {
      target: { value: SetStateAction<string> };
    }) => {
      setImageUrl(event.target.value);
    };

    imagePreview({ target: { value } });

    // Mettre à jour formData avec la nouvelle valeur
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { data } = useQuery<{ ad: AdFormData }>(queryAdById, {
    variables: { adId: id },
    skip: id === undefined,
  });

  useEffect(() => {
    if (data?.ad) {
      setFormData(data.ad);
      setImageUrl(data.ad.imgUrl);
    }
  }, [data]);

  // On récupère les categories
  const { data: categoriesData } = useQuery<{ allCategories: CategoryType[] }>(
    queryAllCategories
  );
  const categories = categoriesData ? categoriesData.allCategories : [];

  // si pas d'ID parce qu'on est en création, on lui force la première id du tableau des catégories récupéré juste au-dessus
  useEffect(() => {
    if (!id && categories.length > 0) {
      setFormData({ ...formData, category: { id: categories[0].id } });
    }
  }, [categories]);

  const [createAd, { loading: createLoading }] = useMutation(
    mutationCreatedAd,
    {
      refetchQueries: [queryAllAds],
    }
  );
  const [updateAd, { loading: updateLoading }] = useMutation(
    mutationUpdatedAd,
    {
      refetchQueries: [queryAdById, queryAllAds],
    }
  );

  const loading = createLoading || updateLoading;

  // Poste ou modifie une annonce
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formData.title.trim().length < 3) {
      setError("title");
    } else if (formData.price < 0) {
      setError("price");
    } else {
      try {
        let result;
        if (id) {
          result = await updateAd({
            variables: {
              updateAdId: id,
              data: {
                title: formData.title,
                description: formData.description,
                // owner: formData.owner,
                price: formData.price,
                imgUrl: formData.imgUrl,
                // location: formData.location,
                // createdAt: formData.createdAt,
                category: { id: formData.category.id },
              },
            },
          });
        } else {
          result = await createAd({
            variables: {
              data: {
                title: formData.title,
                description: formData.description,
                // owner: formData.owner,
                price: formData.price,
                imgUrl: formData.imgUrl,
                // location: formData.location,
                // createdAt: formData.createdAt,
                category: { id: formData.category.id },
              },
            },
          });
        }

        if (!id) {
          router.replace(`/ads/${result.data.createAd.id}`);
        } else {
          router.replace(`/ads/${id}`);
        }
      } catch (err) {
        console.error("Erreur lors de la mise à jour de l'annonce", err);
      }
    }
  }

  return (
    <Layout title="Ad">
      <main className="main-content">
        <h2>{id ? "Modifier une annonce" : "Publier une annonce"}</h2>
        <form onSubmit={onSubmit}>
          <input
            className="text-field"
            name="title"
            placeholder="Titre de l'annonce"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          {error === "title" && (
            <p>
              Attention, le titre de l`annonce doit prendre plus de 3 caractères
            </p>
          )}
          <br />
          <br />
          <input
            className="text-field"
            name="description"
            placeholder="Description de l'annonce"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <br />
          <br />
          <input
            className="text-field"
            name="owner"
            placeholder="Nom ou mail du vendeur"
            value={formData.owner}
            onChange={(e) =>
              setFormData({ ...formData, owner: e.target.value })
            }
          />
          <br />
          <br />
          <input
            className="text-field"
            name="price"
            type="number"
            placeholder="Prix de l'article"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
          />
          {error === "price" && (
            <p>Attention, le prix de l`article doit être positif</p>
          )}
          <br />
          <br />
          <input
            className="text-field"
            name="imgUrl"
            placeholder="Ajouter une photo"
            value={formData.imgUrl}
            onChange={imageChange}
          />
          <br />
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Prévisualisation de l'image"
              style={{ maxWidth: "300px", maxHeight: "300px" }}
            />
          )}
          <br />
          <input
            className="text-field"
            name="location"
            placeholder="localisation"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
          <br />
          <br />
          {/* <input type="date" className="text-field" name="createdAt" /> */}
          <br />
          <br />
          <select
            name="category"
            value={formData.category.id}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: { id: Number(e.target.value) },
              })
            }
          >
            {categories.map((e) => (
              <option value={e.id} key={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <br />
          <br />
          <button type="submit" className="button" disabled={loading}>
            {id ? "Modifier" : "Publier"}
          </button>
        </form>
      </main>
    </Layout>
  );
};

export default NewAd;
