import { gql } from "@apollo/client";

export const mutationDeletedAd = gql`
  mutation deleteAd($deleteAdId: ID!) {
    deleteAd(id: $deleteAdId) {
      title
      id
    }
  }
`;
