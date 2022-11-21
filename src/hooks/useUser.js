import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { Token } from "graphql";
import { useEffect } from "react";
import { isLoggedInVar, userLogOut } from "../apollo";

const ME_QUERY = gql`
  query {
    me {
      ok
      error
      me {
        id
        avatar
        username
      }
    }
  }
`;

const useUser = () => {
  const hasToken = useReactiveVar(isLoggedInVar);

  const { data, loading } = useQuery(ME_QUERY, {
    skip: !hasToken,
  });

  useEffect(() => {
    if (data?.me?.ok === false) {
      userLogOut();
    }
  }, [data, loading]);

  return { loading, data };
};

export default useUser;
