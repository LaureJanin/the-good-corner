import { gql } from "@apollo/client";

export const queryAllAds = gql`
  query AllAds($where: AdsWhere, $priceSort: String) {
    allAds(where: $where, priceSort: $priceSort) {
      id
      imgUrl
      price
      title
    }
  }
`;
