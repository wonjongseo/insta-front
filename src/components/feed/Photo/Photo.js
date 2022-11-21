import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as SolidHeart,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "../../Avatar";
import {
  PhotoContainer,
  PhotoHeader,
  Username,
  PhotoFile,
  PhotoData,
  PhotoActions,
  PhotoAction,
  Likes,
} from "./SPhoto";
import { gql, useMutation } from "@apollo/client";

import Comments from "../Comments/Comments";
import { Link } from "react-router-dom";
import { PROFILE_PATH } from "../../user/Profile/Profile";

const DELETE_PHOTO_MUTATION = gql`
  mutation deletePhoto($id: Int!) {
    deletePhoto(id: $id) {
      ok
      error
    }
  }
`;
const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($photoId: Int!) {
    toggleLike(photoId: $photoId) {
      ok
      error
    }
  }
`;

const Photo = ({ photo }) => {
  const deletePhotoUpload = (cache, result) => {
    const {
      data: {
        deletePhoto: { ok, error },
      },
    } = result;

    if (ok) {
      cache.evict({
        id: `Photo:${photo.id}`,
      });
    }
  };
  const [deletePhoto] = useMutation(DELETE_PHOTO_MUTATION, {
    variables: {
      id: photo.id,
    },
    update: deletePhotoUpload,
  });

  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;

    if (ok) {
      const id = `Photo:${photo.id}`;
      cache.modify({
        id,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likes(prev) {
            return photo.isLiked ? prev - 1 : prev + 1;
          },
        },
      });
      // const fragment = gql`
      //   fragment ToggleLikeFragment on Photo {
      //     isLiked
      //     likes
      //   }
      // `;

      // const result = cache.readFragment({
      //   id,
      //   fragment,
      // });
      // if ("isLiked" in result && "likes" in result) {
      //   const { isLiked, likesZ } = result;
      //   cache.writeFragment({
      //     id,
      //     fragment,
      //     data: {
      //       isLiked: !isLiked,
      //       likes: isLiked ? likes - 1 : likes + 1,
      //     },
      //   });
      // }
    }
  };

  const [toggleLike, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      photoId: photo.id,
    },
    update: updateToggleLike,
  });

  return (
    <PhotoContainer key={photo.id}>
      <PhotoHeader>
        <div>
          <Link to={`${PROFILE_PATH}/${photo.user.username}`}>
            <Avatar lg={true} url={photo.user.avatar} />
          </Link>
          <Link to={`${PROFILE_PATH}/${photo.user.username}`}>
            <Username>{photo.user.username}</Username>
          </Link>
        </div>
        {photo.isMine ? (
          <div>
            <PhotoAction onClick={deletePhoto}>
              <FontAwesomeIcon icon={faRemove} />
            </PhotoAction>
          </div>
        ) : null}
      </PhotoHeader>

      <PhotoFile src={photo.file} />
      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction onClick={toggleLike}>
              <FontAwesomeIcon
                style={{ color: photo.isLiked ? "tomato" : "inherit" }}
                icon={photo.isLiked ? SolidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faComment} />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faPaperPlane} />
            </PhotoAction>
          </div>
          <div>
            <PhotoAction>
              <FontAwesomeIcon icon={faBookmark} />
            </PhotoAction>
          </div>
        </PhotoActions>
        <Likes>{photo.likes === 1 ? "1 like" : `${photo.likes} likes`}</Likes>

        <Comments
          photoId={photo.id}
          author={photo.user.username}
          caption={photo.caption}
          comments={photo.comments}
          commentNumber={photo.commentNumber}
        />
      </PhotoData>
    </PhotoContainer>
  );
};

export default Photo;
