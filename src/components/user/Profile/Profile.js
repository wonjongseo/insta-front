import { gql, useMutation, useQuery } from "@apollo/client";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { Link, useMatch, useParams } from "react-router-dom";
import styled from "styled-components";
import UploadPhoto from "../../../screens/UploadPhoto/UploadPhoto";
import Loading from "../../Loading";
import UserDetailsInfo from "../UserDetaislnfo/UserDetailsInfo";
import {
  Avatar,
  UserInfo,
  ProfileContainer as UserInfoContainer,
  ImageContainer,
  Column,
  Username,
  UserDetailInfo,
  Button,
} from "./SProfile";

export const PROFILE_PATH = "/profile";

const EDIT_PROFILE_MUTATAIO = gql`
  mutation editProfile(
    $firstName: String
    $lastName: String
    $username: String
    $email: String
    $password: String
    $bio: String
    $avatar: Upload
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
      bio: $bio
      avatar: $avatar
    ) {
      ok
      error
      user {
        avatar
      }
    }
  }
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      ok
      error
      user {
        firstName
        lastName
        username
        bio
        avatar
        isMe
        isFollowing
        id

        totalFollowing
        totalFollower
        photos {
          id
          file
          likes
          commentNumber
          isLiked
        }
      }
    }
  }
`;

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
      error
      user {
        id
      }
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unFollowUser($username: String!) {
    unFollowUser(username: $username) {
      ok
      error
      user {
        id
      }
    }
  }
`;
const HiddenInput = styled.input`
  display: none;
`;
const Profile = () => {
  const { username } = useParams();
  const { register, handleSubmit, getValues } = useForm();
  const followUserUpdate = (cache, result) => {
    if (!followUserLoading) {
      const cacheUserId = `User:${result.data.followUser.user.id}`;
      console.log(result);
      cache.modify({
        id: cacheUserId,
        fields: {
          isFollowing(prev) {
            return !prev;
          },
          totalFollower(prev) {
            return prev + 1;
          },
        },
      });
    }
  };
  const [followUser, { loading: followUserLoading }] = useMutation(
    FOLLOW_USER_MUTATION,
    {
      update: followUserUpdate,
    }
  );
  const unFollowUserUpdate = (cache, result) => {
    if (!unFolowUserLoading) {
      const cacheUserId = `User:${result.data.unFollowUser.user.id}`;
      console.log(cacheUserId);
      cache.modify({
        id: cacheUserId,
        fields: {
          isFollowing(prev) {
            return !prev;
          },
          totalFollower(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [unFollowUser, { loading: unFolowUserLoading }] = useMutation(
    UNFOLLOW_USER_MUTATION,
    {
      update: unFollowUserUpdate,
    }
  );
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username,
    },
  });

  const editProfileUpdate = (cache, result) => {
    const id = `User:${data.seeProfile.user.id}`;
    cache.modify({
      id,
      fields: {
        avatar() {
          return result.data.editProfile.user.avatar;
        },
      },
    });
  };
  const [editProfile, { loading: editProfileLoading }] = useMutation(
    EDIT_PROFILE_MUTATAIO,
    { update: editProfileUpdate }
  );

  const onValid = async (data) => {
    if (!editProfileLoading) {
      const { avatar } = getValues();

      await editProfile({
        variables: {
          avatar: avatar[0],
        },
      });
    }
  };

  const onClickUnFollowUser = () => {
    unFollowUser({ variables: { username } });
  };
  const onClickFollowUser = () => {
    followUser({ variables: { username } });
  };
  const isUploadPass = useMatch("profile/:username/upload/:id");
  console.log(isUploadPass);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <UserInfoContainer>
            <ImageContainer>
              <Avatar>
                {data?.seeProfile?.user?.avatar === "" ||
                data.seeProfile.user.avatar === null ? (
                  <FontAwesomeIcon size="7x" color="white" icon={faUser} />
                ) : (
                  <img alt="" src={data?.seeProfile?.user?.avatar} />
                )}
              </Avatar>
            </ImageContainer>
            <UserInfo>
              <Column>
                <UserDetailInfo>
                  <Username>{data.seeProfile.user.username}</Username>
                </UserDetailInfo>
                {data.seeProfile.user.isMe ? (
                  <>
                    <Button htmlFor="tmp">プロピル編集</Button>
                    <HiddenInput
                      onChangeCapture={handleSubmit(onValid)}
                      {...register("avatar")}
                      multiple
                      id="tmp"
                      type="file"
                    />
                  </>
                ) : data.seeProfile.user.isFollowing ? (
                  <Button onClick={() => onClickUnFollowUser()}>
                    unFollow
                  </Button>
                ) : (
                  <Button onClick={() => onClickFollowUser()}>follow</Button>
                )}
              </Column>
              <UserDetailsInfo user={data.seeProfile.user} />
            </UserInfo>
          </UserInfoContainer>
          <div>
            <Link to={"/chats/" + username}>Chat</Link>
          </div>
          <UserPhotosContainer>
            <Photos>
              {data.seeProfile.user.photos.map((photo) => (
                <Temp key={photo.id}>
                  <Image src={photo.file} />
                </Temp>
              ))}
            </Photos>
          </UserPhotosContainer>
        </>
      )}
      {isUploadPass !== null ? <UploadPhoto /> : null}
    </>
  );
};

const Temp = styled.div`
  width: 100%;
  height: 100%;
  background-color: red;
`;

const UserPhotosContainer = styled.div`
  margin-top: 100px;
  border-top: 1px solid ${(p) => p.theme.borderColor};
  /* background-color: red; */
  width: 100%;
  height: 100px;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const Photos = styled.div`
  margin-top: 50px;
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 40px;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
`;
export default Profile;
