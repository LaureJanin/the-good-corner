import { gql } from "@apollo/client";

export const queryAllAds = gql`
  query AllAds($where: AdsWhere) {
    allAds(where: $where) {
      id
      imgUrl
      price
      title
    }
  }
`;
