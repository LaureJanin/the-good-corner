import { gql } from "@apollo/client";

export const queryAdsByTags = gql`
  query Tag($tagId: ID!) {
    tag(id: $tagId) {
      name
      id
      ads {
        category {
          id
          name
        }
        description
        id
        imgUrl
        price
        title
      }
    }
  }
`;
