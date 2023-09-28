import Layout from "@/components/Layout";
import { FormEvent, SetStateAction, useEffect, useState } from "react";
import { CategoryProps } from "@/components/Category";
import axios from "axios";
import { useRouter } from "next/router";

type AdFormData = {
  id: number;
  title: string;
  description: string;
  owner: string;
  price: number;
  imgUrl: string;
  location: string;
  createdAt: Date;
  category: { id: number } ;
};

const NewAd = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
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

  // Récupération des catégories pour le select et des données de l'annonce quand une id est présente dans l'URL
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Vérifie s'il y a une id dans l'URL et donc s'il s'agit d'une offre à modifier
        if (id) {
          const result = await axios.get<AdFormData>(
            `http://localhost:5000/ads/${id}`
          );
          const adData = result.data;

          // Remplit le formulaire avec les données de l'annonce quand elle existe
          setFormData(adData);
          setImageUrl(adData.imgUrl);
        }

        // Récupère les catégories
        const categoryResult = await axios.get<CategoryProps[]>(
          "http://localhost:5000/categories"
        );
        setCategories(categoryResult.data);
      } catch (err) {
        console.error("error", err);
      }
    };
    fetchData();
  }, [id]);

  // Poste ou modifie une annonce
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(
      formData.entries()
    ) as unknown as AdFormData;

    if ("categoryId" in data) {
      data.category = { id: Number(data.categoryId) };
      delete data.categoryId;
    }

    data.title = String(data.title);
    data.price = Number(data.price);

    if (data.title.trim().length < 3) {
      setError("title");
    } else if (data.price < 0) {
      setError("price");
    } else {
      try {
        // si j'ai une id, je mets à jour l'annonce
        if (id) {
          await axios.patch(`http://localhost:5000/ads/${id}`, data);
          router.push(`/ads/${id}`);
        } else {
          // sinon je poste la nouvelle annonce
          const result = await axios.post("http://localhost:5000/ads", data);
          if ("id" in result.data) {
            form.reset();
            router.push(`/ads/${result.data.id}`);
          }
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
          <input
            type="date"
            className="text-field"
            name="createdAt"
          />
          <br />
          <br />
          <select name="category" value={formData.category.id} onChange={(e) =>
              setFormData({ ...formData, category: { id : Number(e.target.value) } })
            }>
            {categories.map((e) => (
              <option value={e.id} key={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <br />
          <br />
          <button type="submit" className="button">
            {id ? "Modifier" : "Publier"}
          </button>
        </form>
      </main>
    </Layout>
  );
};

export default NewAd;
