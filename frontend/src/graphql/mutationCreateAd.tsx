import { gql } from "@apollo/client";

export const mutationCreatedAd = gql`
  mutation CreateAd($data: AdCreatedInput!) {
    createAd(data: $data) {
      category {
        id
      }
      description
      id
      imgUrl
      price
      title
    }
  }
`;
