import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "apollo-link-ws";
import { createUploadLink } from "apollo-upload-client";
const TOKEN = "token";
const DARK_MODE = "DARK_MODE";
export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));

export const userLogIn = (token) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};
export const userLogOut = () => {
  localStorage.removeItem(TOKEN);
  window.location.reload();
};

export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));
export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "enabled");
  darkModeVar(true);
};

export const disableDarkMode = () => {
  localStorage.removeItem(DARK_MODE);
  darkModeVar(false);
};

// const httpLink = createHttpLink({
//   uri: "http://localhost:4000/graphql",
// });

const httpLink = createUploadLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: localStorage.getItem(TOKEN),
    },
  };
});

const wsLink = new WebSocketLink({
  uri: "wss://localhost:4000/graphql",
  options: {
    reconnect: true,
  },
});
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
