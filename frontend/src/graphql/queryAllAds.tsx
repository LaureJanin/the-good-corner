import { gql } from "@apollo/client";

export const queryAllAds = gql`
  query AllAds($where: AdsWhere, $priceSort: String, $skip: Int, $take: Int) {
    allAds(where: $where, priceSort: $priceSort, skip: $skip, take: $take) {
      id
      imgUrl
      price
      title
    }
    count: allAdsCount(where: $where)
  }
`;
