import { gql } from "@apollo/client";

export const queryAllCategories = gql`
  query Allcategories {
    allCategories {
      id
      name
    }
  }
`;
