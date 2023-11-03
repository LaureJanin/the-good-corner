import { gql } from "@apollo/client";

export const mutationUpdatedAd = gql`
  mutation UpdateAd($data: AdUpdatedInput!, $updateAdId: ID!) {
    updateAd(data: $data, id: $updateAdId) {
      category {
        id
      }
      description
      imgUrl
      price
      title
    }
  }
`;
