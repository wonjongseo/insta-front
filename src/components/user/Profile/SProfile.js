import styled from "styled-components";

export const Avatar = styled.div`
  background-color: rgb(219, 219, 219);
  border: 2px solid rgb(170, 170, 170);
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: 150px;
  &:svg {
    width: 100%;
    height: 100%;
  }
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
`;

export const UserInfo = styled.div`
  width: 65%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ProfileContainer = styled.div`
  height: 130px;
  width: 100%;
  justify-content: space-around;
  display: flex;
`;
export const ImageContainer = styled.div`
  width: 35%;

  display: flex;
  justify-content: center;
`;

export const Column = styled.div`
  display: flex;
  align-items: center;
`;

export const Username = styled.div`
  font-size: 22px;
`;

export const UserDetailInfo = styled.div`
  display: flex;
  margin-right: 35px;
  div {
    margin-right: 5px;
  }
`;

export const Button = styled.label`
  border: 1px solid rgb(219, 219, 219);
  padding: 6px 9px;
  border-radius: 4px;
  font-weight: 600;
`;
