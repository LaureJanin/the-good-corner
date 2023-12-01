import { gql } from "@apollo/client";

export const mutationCreatedTag = gql`
  mutation createTag($data: TagCreateInput!) {
    createTag(data: $data) {
      id
      name
    }
  }
`;
