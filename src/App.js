import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import Home, { HOME_PATH } from "./screens/Home";
import SignUp, { SIGN_UP_PATH } from "./screens/SignUp";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import Profile, { PROFILE_PATH } from "./components/user/Profile/Profile";
import Chats from "./components/Chats";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDarkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <BrowserRouter>
            <Routes>
              {isLoggedIn ? (
                <Route
                  path={HOME_PATH}
                  element={
                    <Layout>
                      <Home />
                    </Layout>
                  }
                />
              ) : (
                <Route path={HOME_PATH} element={<Login />} />
              )}
              {!isLoggedIn ? (
                <Route path={SIGN_UP_PATH} element={<SignUp />} />
              ) : null}

              <Route
                path={`${PROFILE_PATH}/:username/*`}
                element={
                  <Layout>
                    <Profile />
                  </Layout>
                }
              />
              <Route path="/chats/:username" element={<Chats />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
