import styled from "styled-components";

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const UserDetailInfo = styled.div`
  display: flex;
  margin-right: 35px;
  div {
    margin-right: 5px;
  }
`;

const FatText = styled.div`
  font-weight: 600;
`;

const UserDetailsInfo = ({ user }) => {
  return (
    <>
      <Column>
        <UserDetailInfo>
          <div>掲示物</div>
          <FatText>{user.photos?.length}</FatText>
        </UserDetailInfo>
        <UserDetailInfo>
          <div>Follower</div>
          <FatText>{user.totalFollower}</FatText>
        </UserDetailInfo>
        <UserDetailInfo>
          <div>Following</div>
          <FatText>{user.totalFollowing}</FatText>
        </UserDetailInfo>
      </Column>
      <Column>
        <FatText></FatText>
      </Column>
    </>
  );
};
export default UserDetailsInfo;
