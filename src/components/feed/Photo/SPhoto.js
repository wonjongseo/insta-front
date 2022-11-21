import styled from "styled-components";
import { FatText } from "../../shared";

export const PhotoContainer = styled.div`
  background-color: white;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 60px;
  min-width: 615px;
  max-width: 615px;
`;

export const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    align-items: center;
  }

  border-bottom: 1px solid rgb(239, 239, 239);
`;

export const Username = styled(FatText)`
  margin-left: 15px;
`;

export const PhotoFile = styled.img`
  min-width: 100%;
  max-width: 100%;
`;

export const PhotoData = styled.div`
  padding: 12px 15px;
`;

export const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 20px;
  }
`;

export const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

export const Likes = styled(FatText)`
  margin-top: 15px;
  display: block;
`;
