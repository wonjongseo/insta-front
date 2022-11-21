import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import styled from "styled-components";
import useUser from "../../../hooks/useUser";
import { PROFILE_PATH } from "../../user/Profile/Profile";
import Comment from "../Comment/Comment";
import { CommentsContainer, CommentCount, CommentBox } from "./SComments";

const CREATE_COMMENT_MUCATATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      comment {
        id
        payload
        createdAt
        isMine
      }
    }
  }
`;
const Comments = ({ photoId, author, caption, comments, commentNumber }) => {
  const { data: userData } = useUser();

  const { register, handleSubmit, setValue, getValues } = useForm();
  const commentUpdate = (cache, result) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        createComment: { ok, error, comment },
      },
    } = result;

    if (ok && userData?.me?.me) {
      const newComment = {
        id: comment.id,
        __typename: "Comment",
        createdAt: Date.now().toString(),
        payload,
        isMine: true,
        user: {
          ...userData?.me?.me,
        },
      };
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment CreateCommentFragment on Comment {
            id
            createdAt
            payload
            isMine
            user {
              username
              avatar
            }
          }
        `,
      });

      console.log(newCacheComment);
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            return [...prev, newCacheComment];
          },
        },
      });
    }
  };
  const [createComment, { loading }] = useMutation(CREATE_COMMENT_MUCATATION, {
    update: commentUpdate,
  });

  const onValid = ({ payload }) => {
    if (!loading) {
      createComment({
        variables: {
          payload,
          photoId,
        },
      });
    }
  };

  return (
    <CommentsContainer>
      <Link to={`${PROFILE_PATH}/${author}`}>
        <Comment author={author} payload={caption} />
      </Link>
      <CommentCount>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentCount>
      <ul>
        {comments.map((comment) => (
          <Comment
            id={comment.id}
            isMine={comment.isMine}
            key={comment.id}
            author={comment.user.username}
            payload={comment.payload}
          />
        ))}
      </ul>

      <CommentBox>
        <Form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("payload", { required: true })}
            placeholder="コメントする"
          />
          <Button value={"掲示"} type="submit" />
        </Form>
      </CommentBox>
    </CommentsContainer>
  );
};

const Form = styled.form`
  width: 100%;
`;
const Input = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
`;
const Button = styled.input`
  width: 30px;
  padding: 5px;

  cursor: pointer;
`;
export default Comments;
