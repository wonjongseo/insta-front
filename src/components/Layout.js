import { useMatch } from "react-router-dom";
import styled from "styled-components";
import UploadPhoto from "../screens/UploadPhoto/UploadPhoto";
import Header from "./Header/Header";

const Content = styled.main`
  max-width: 930px;
  margin: 0 auto;
  margin-top: 45px;
  width: 100%;
  display: flex;
  flex-direction: column;

  align-items: center;
`;

const TotalContainer = styled.div`
  opacity: ${(p) => (p.isUploadPass ? 0.5 : 1)};
`;
const Layout = ({ children }) => {
  const isUploadPass = useMatch("upload/:id");
  return (
    <>
      <TotalContainer isUploadPass={isUploadPass}>
        <Header />
        <Content>{children}</Content>
      </TotalContainer>
      {isUploadPass !== null ? <UploadPhoto /> : null}
    </>
  );
};

export default Layout;
