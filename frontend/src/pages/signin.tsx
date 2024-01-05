import Layout from "@/components/Layout";
import { mutationSignin } from "@/graphql/mutationSignin";
import { mutationSignup } from "@/graphql/mutationSignup";
import { queryMe } from "@/graphql/queryMe";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Signin(): React.ReactNode {
  const [email, setEmail] = useState("user@gmail.com");
  const [password, setPassword] = useState("supersecret");
  const [failed, setFailed] = useState(false);
  const router = useRouter();

  const [doSignin, { error }] = useMutation(mutationSignin, {
    refetchQueries: [queryMe],
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailed(false);
    try {
      const { data } = await doSignin({
        variables: {
          email,
          password,
        },
      });
      if (data.item) {
        router.replace("/");
      } else {
        setFailed(true);
      }
    } catch {}
  }

  return (
    <Layout title="The Good Corner - Identification">
      <main className="main-content">
        {error && <p>Une erreur est survenue</p>}
        {failed && <p>Identifiants ou mot de passe incorrect(s)</p>}
        <form onSubmit={onSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@gmail.com"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mot de passe"
          />
          <button type="submit">Connection</button>
        </form>
      </main>
    </Layout>
  );
}
