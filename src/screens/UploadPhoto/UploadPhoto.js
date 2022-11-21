import { gql, useMutation } from "@apollo/client";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../components/auth/Button";
import Input from "../../components/auth/Input";
import useUser from "../../hooks/useUser";
import { HOME_PATH } from "../Home";

export const UPLOAD_PHOTO_PATH = "upload";

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      ok
      error
      photo {
        id
        file
      }
    }
  }
`;
const UploadPhoto = () => {
  const nav = useNavigate();
  const { data: userData } = useUser();
  const { register, handleSubmit, getValues } = useForm();

  const updatePhotoUpdate = async (cache, result) => {
    const { caption } = getValues();
    const {
      data: {
        uploadPhoto: { ok, photo },
      },
    } = result;
    if (ok && userData?.me?.me) {
      const newPhoto = {
        __typename: "Photo",
        id: photo.id,
        user: {
          ...userData?.me?.me,
        },
        file: photo.file,
        caption,
        likes: 0,
        commentNumber: 0,
        comments: [],
        createdAt: Date.now() + "",
        isMine: true,
        isLiked: false,
      };

      const newCachePhoto = cache.writeFragment({
        data: newPhoto,
        fragment: gql`
          fragment CreatePhotoFragment on Photo {
            user {
              username
              avatar
            }
            id
            file
            caption
            likes
            commentNumber
            comments
            createdAt
            isMine
            isLiked
          }
        `,
      });

      await cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeFeed(prev) {
            const { photos } = prev;
            const newPhotos = [newCachePhoto, ...photos];
            return {
              ...prev,
              photos: newPhotos,
            };
          },
        },
      });

      const fUserid = `User:${userData?.me?.me?.id}`;

      const result = cache.readFragment({
        id: fUserid,
        fragment: gql`
          fragment Aa on User {
            photos {
              id
            }
            id
          }
        `,
      });
      console.log(result);
      if (result) {
        await cache.modify({
          id: fUserid,
          fields: {
            photos(prev) {
              return [newCachePhoto, ...prev];
            },
          },
        });
      } else {
        await cache.modify({
          id: fUserid,
          fields: {
            photos() {
              return [newCachePhoto];
            },
          },
        });
      }

      nav(HOME_PATH);
    }
  };
  const [uploadPhoto, { loading }] = useMutation(UPLOAD_PHOTO_MUTATION, {
    update: updatePhotoUpdate,
  });

  const onValid = async (data) => {
    const { file, caption } = getValues();
    console.log(file, caption);
    if (file.length === 0) {
      return;
    }
    if (!loading) {
      await uploadPhoto({
        variables: {
          file: file[0],
          caption,
        },
      });
    }
  };

  return (
    <PhotoUploaderContainer>
      <FormBox>
        <ExitBtn onClick={() => nav(-1)}>
          <FontAwesomeIcon icon={faRemove} />
        </ExitBtn>
        <form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("file")}
            multiple
            placeholder="File"
            type="file"
          />
          <Input {...register("caption")} placeholder="Caption" type="text" />
          <Button placeholder="Upload" type="submit" />
        </form>
      </FormBox>
    </PhotoUploaderContainer>
  );
};

const ExitBtn = styled.div`
  padding: 5px;
`;
const FormBox = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;
  padding: 35px 40px 25px 40px;
  margin-bottom: 10px;
  form {
    margin-top: 35px;
    width: 100%;
    display: flex;
    justify-items: center;
    flex-direction: column;
    align-items: center;
  }
`;
const PhotoUploaderContainer = styled.div`
  background-color: rgba(128, 128, 128, 0);
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
`;

export default UploadPhoto;
