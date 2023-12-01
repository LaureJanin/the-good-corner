import Layout from "@/components/Layout";
import { FormEvent, SetStateAction, useEffect, useState } from "react";
import { CategoryType } from "@/components/Category";
import { useRouter } from "next/router";
import { queryAdById } from "@/graphql/queryAdById";
import { useMutation, useQuery } from "@apollo/client";
import { queryAllCategories } from "@/graphql/queryAllCategories";
import { mutationCreatedAd } from "@/graphql/mutationCreateAd";
import { mutationUpdatedAd } from "@/graphql/mutationUpdateAd";
import { queryAllAds } from "@/graphql/queryAllAds";
import { queryAllTags } from "@/graphql/queryAllTags";
import { TagType } from "./adsByTags";

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
  tags: {
    id: number;
    name: string;
  }[];
};

const NewAd = () => {
  const [error, setError] = useState<"title" | "price">();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
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
    tags: [
      {
        id: 0,
        name: "",
      },
    ],
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

  // On récupère les data d'une annonce si une Id est renseignée dans l'URL, sinon on skip
  const { data } = useQuery<{ ad: AdFormData }>(queryAdById, {
    variables: { adId: id },
    skip: id === undefined,
  });

  // On écoute si de la data est récupérée alors on la met dans les champs
  useEffect(() => {
    if (data?.ad) {
      setFormData(data.ad);
      setImageUrl(data.ad.imgUrl);
      const adTags = data.ad.tags.map((tag) => tag.id);
      setSelectedTags(adTags);
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

  // on récupère tous les tags
  const { data: dataTags } = useQuery<{ allTags: TagType[] }>(queryAllTags);
  const tags = dataTags ? dataTags.allTags : [];

  // permet de cocher ou décocher des tags
  const tagChange = (tagId: number) => {
    // Mettez à jour l'état des tags sélectionnés
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tagId)) {
        // Si le tag est déjà sélectionné, le retirer
        return prevSelectedTags.filter((id) => id !== tagId);
      } else {
        // Sinon, l'ajouter à la liste des tags sélectionnés
        return [...prevSelectedTags, tagId];
      }
    });
  };

  // Ces deux mutations nous permettent de créer et de mettre à jour une annonce, refetchQueries permet de relancer les requêtes et évite la mise en cache qui nous montreraient des données obsolètes
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
                tags: selectedTags.map((tagId) => ({ id: tagId })),
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
                tags: selectedTags.map((tagId) => ({ id: tagId })),
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
        <form className="form" onSubmit={onSubmit}>
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
          <textarea
            className="text-area"
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
          <select
            className="text-field"
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
          {formData.tags.length > 0 && (
            <div>
              <p>Ajouter ou supprimer des tags :</p>
              {tags.map((tag) => (
                <div key={tag.id}>
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    name={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => tagChange(tag.id)}
                  />
                  <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
                </div>
              ))}
              <br />
            </div>
          )}
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
