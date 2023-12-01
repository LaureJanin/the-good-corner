/* eslint-disable react/no-unescaped-entities */
import AdCard, { AdType } from "@/components/AdCard";
import Layout from "@/components/Layout";
import { queryAdsByTags } from "@/graphql/queryAdsByTags";
import { queryAllTags } from "@/graphql/queryAllTags";
import { mutationCreatedTag } from "@/graphql/mutationCreateTag";
import { useMutation, useQuery } from "@apollo/client";
import { FormEvent, useState } from "react";

export type TagType = {
  id: number;
  name: string;
};

const AdsByTags = () => {
  const [selectedTag, setSelectedTag] = useState<TagType>();
  const [newTag, setNewTag] = useState<string>("");

  // On récupère tous les tags
  const { data: dataTags } = useQuery<{ allTags: TagType[] }>(queryAllTags);
  const tags = dataTags ? dataTags.allTags : [];

  // Tag clické est mis dans le state
  const tagClick = (tag: TagType) => {
    setSelectedTag(tag);
  };

  // On récupère les annonces liées à un tag
  const { data: dataAds } = useQuery(queryAdsByTags, {
    variables: { tagId: selectedTag?.id },
  });
  const ads: AdType[] = dataAds ? dataAds.tag?.ads : [];

  // On créé un tag et on gère le loading
  const [createTag, { loading: createLoading }] = useMutation(
    mutationCreatedTag,
    {
      refetchQueries: [queryAllTags],
    }
  );

  const loading = createLoading;

  // On enregistre un nouveau tag
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    const result = await createTag({
      variables: {
        data: {
          name: newTag,
        },
      },
    });
  }

  return (
    <Layout title="AdsByTag">
      <main className="main-content">
        <h2>Créer un tag</h2>
        <form
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "1rem",
          }}
          onSubmit={onSubmit}
        >
          <label>
            Nouveau Tag :{" "}
            <input
              className="text-field"
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
          </label>
          <button className="button" type="submit" disabled={loading}>
            Créer
          </button>
        </form>

        <h2>Recherche par tags</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          {tags.map((tag) => (
            <button
              style={{
                borderRadius: "5px",
                border: "none",
                backgroundColor:
                  selectedTag && selectedTag.id === tag.id
                    ? "#ff7043"
                    : "#ffa41b",
                color: "white",
                padding: "10px 15px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              key={tag.id}
              onClick={() => tagClick(tag)}
            >
              {tag.name}
            </button>
          ))}
        </div>
        {selectedTag && (
          <div>
            <h3>Annonces liées à "{selectedTag.name}"</h3>
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
                  <button className="button">Ajouter au panier</button>
                </div>
              ))}
            </section>
            ,
          </div>
        )}
      </main>
    </Layout>
  );
};

export default AdsByTags;
