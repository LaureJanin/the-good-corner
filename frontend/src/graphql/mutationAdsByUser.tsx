import { gql } from "@apollo/client";

export const queryAdsByUser = gql`
  query user($userId: ID!) {
    user(id: $userId) {
      email
      ads {
        id
        title
        description
        imgUrl
        price
      }
    }
  }
`;
