import { gql } from "@apollo/client";

export const mutationSignout = gql`
  mutation signout {
    item: signout
  }
`;
