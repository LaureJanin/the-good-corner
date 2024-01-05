import Layout from "@/components/Layout";
import { mutationSignup } from "@/graphql/mutationSignup";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Signup(): React.ReactNode {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const [doSignup, { error }] = useMutation(mutationSignup);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { data } = await doSignup({
        variables: {
          data: {
            email,
            password,
          },
        },
      });
      if (data.item) {
        router.replace("/signin");
      }
    } catch {}
  }

  return (
    <Layout title="The Good Corner - Enregistrement">
      <main className="main-content">
        {error && (
          <p>
            Une erreur est survenue (compte déjà existant ou MDP trop faible)
          </p>
        )}
        <form className="form" onSubmit={onSubmit}>
          <p>Veuillez vous enregistrer</p>
          <input
            type="email"
            className="text-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@gmail.com"
          />
          <br />
          <input
            type="password"
            className="text-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mot de passe"
          />
          <br />
          <button className="button" type="submit">
            Enregistrement
          </button>
        </form>
      </main>
    </Layout>
  );
}
