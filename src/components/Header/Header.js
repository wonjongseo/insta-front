import { gql, useLazyQuery, useReactiveVar } from "@apollo/client";
import {
  faGear,
  faHeart as SolidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faBookmark,
  faCompass,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { faCamera, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { isLoggedInVar, userLogOut } from "../../apollo";
import useUser from "../../hooks/useUser";
import { HOME_PATH } from "../../screens/Home";
import { UPLOAD_PHOTO_PATH } from "../../screens/UploadPhoto/UploadPhoto";
import Avatar from "../Avatar";
import Loading from "../Loading";
import { PROFILE_PATH } from "../user/Profile/Profile";
import {
  SHeader,
  Wrapper,
  Column,
  Icon,
  Button,
  IconsContainer,
  Input,
} from "./SHeader";
import { LOGIN_PATH } from "../../screens/Login";

const SEARCH_QUERY = gql`
  query searchUsers($keyword: String!) {
    searchUsers(keyword: $keyword) {
      ok
      error
      users {
        id
        username
        avatar
      }
    }
  }
`;

const SearchedUserContainer = styled.ul`
  position: absolute;
  background-color: white;

  width: 130%;

  border: 1px solid ${(p) => p.theme.borderColor};
  padding: 10px 10px 45px 10px;
  /* height: 150px; */
  left: -40px;
  top: 50px;
  display: ${(p) => (p.isSearch ? "flex" : "none")};

  a {
    align-items: center;
    width: 100%;
    height: 100%;
    display: flex;
    li {
      margin-left: 10px;
      color: black;
    }
  }
`;
const Header = () => {
  const nav = useNavigate();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { loading, data } = useUser();
  const { register, handleSubmit, setError } = useForm();
  const [searchedUsersVar, setSearchedUsersVar] = useState([]);
  const [isUserSelector, setIsUserSelector] = useState(false);
  const onCompleted = (data) => {
    const { searchUsers: result } = data;
    if (result.ok) {
      setSearchedUsersVar(result.users);
    } else {
      setError("keyword", result.error);
    }
  };
  const [searchUsers, { loading: searchLoading }] = useLazyQuery(SEARCH_QUERY, {
    onCompleted,
  });

  const onSearchSubmit = (data) => {
    if (!searchLoading) {
      const { keyword } = data;
      searchUsers({ variables: { keyword } });
    }
  };
  const onLogoutClick = () => {
    nav(LOGIN_PATH);
    userLogOut();
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <SHeader>
          <Wrapper>
            <Column>
              <Link to={HOME_PATH}>
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </Link>
            </Column>
            <Column>
              <form onSubmit={handleSubmit(onSearchSubmit)}>
                <Input
                  required
                  {...register("keyword")}
                  type={"search"}
                  placeholder="検索"
                />
              </form>
              <SearchedUserContainer isSearch={searchedUsersVar.length !== 0}>
                {searchedUsersVar.length !== 0 &&
                  searchedUsersVar.map((searchedUser) => (
                    <Link
                      onClick={() => setSearchedUsersVar([])}
                      key={searchedUser.id}
                      to={`${PROFILE_PATH}/${searchedUser.username}`}
                    >
                      <Avatar lg={true} url={searchedUser.avatar} />
                      <li>{searchedUser.username}</li>
                    </Link>
                  ))}
              </SearchedUserContainer>
            </Column>
            <Column>
              {isLoggedIn ? (
                <IconsContainer>
                  <Icon>
                    <Link to={HOME_PATH}>
                      <FontAwesomeIcon icon={faHome} size="lg" />
                    </Link>
                  </Icon>
                  <Icon>
                    <Link to={`${UPLOAD_PHOTO_PATH}/${data?.me?.me?.id}`}>
                      <FontAwesomeIcon
                        color="black"
                        icon={faCamera}
                        size="lg"
                      />
                    </Link>
                  </Icon>

                  <Icon>
                    <FontAwesomeIcon icon={faCompass} size="lg" />
                  </Icon>
                  <Icon>
                    <FontAwesomeIcon icon={SolidHeart} size="lg" />
                  </Icon>
                  <Icon onClick={() => setIsUserSelector((prev) => !prev)}>
                    <div to={`${PROFILE_PATH}/${data?.me?.me?.username}`}>
                      <div>
                        {data?.me?.me?.avatar !== null ? (
                          <Avatar url={data?.me?.me?.avatar} />
                        ) : (
                          <FontAwesomeIcon icon={faUser} size="lg" />
                        )}
                      </div>
                    </div>

                    <MySelector isUserSelector={isUserSelector}>
                      <div>
                        <div>
                          <Link
                            to={`${PROFILE_PATH}/${data?.me?.me?.username}`}
                          >
                            <FontAwesomeIcon icon={faUser} />
                            <span>プロフィール</span>
                          </Link>
                        </div>
                        {/* <div>
                          <FontAwesomeIcon icon={faGear} />
                          <span>設定</span>
                        </div> */}
                      </div>
                      <div onClick={onLogoutClick}>ログアウト</div>
                    </MySelector>
                  </Icon>
                </IconsContainer>
              ) : (
                <Link to={HOME_PATH}>
                  <Button>ログイン</Button>
                </Link>
              )}
            </Column>
          </Wrapper>
        </SHeader>
      )}
    </>
  );
};
const MySelector = styled.div`
  display: ${(p) => (p.isUserSelector ? "flex" : "none")};
  /* display: flex; */
  flex-direction: column;
  border: 1px solid ${(p) => p.theme.borderColor};
  position: absolute;
  top: 50px;
  right: 0;
  padding: 10px;
  width: 150px;
  div {
    span {
      margin-left: 12px;
    }
    margin-bottom: 10px;
    font-size: 14px;
  }
`;

export default Header;
