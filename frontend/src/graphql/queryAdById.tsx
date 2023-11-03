import { gql } from "@apollo/client";

export const queryAdById = gql`
  query getAd($adId: ID!) {
    ad(id: $adId) {
      category {
        id
        name
      }
      createdAt
      description
      id
      imgUrl
      price
      tags {
        id
        name
      }
      title
    }
  }
`;
