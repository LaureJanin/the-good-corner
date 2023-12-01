import { gql } from "@apollo/client";

export const queryAllTags = gql`
  query AllTags {
    allTags {
      id
      name
    }
  }
`;
