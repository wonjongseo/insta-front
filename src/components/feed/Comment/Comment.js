import { gql, useMutation } from "@apollo/client";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FatText } from "../../shared";
import { PROFILE_PATH } from "../../user/Profile/Profile";
import { CommentCaption, CommentContainer } from "./SComment";

const DELETE_COMMENT_MUTATAION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
      error
    }
  }
`;

const Comment = ({ id, author, payload, isMine }) => {
  const deleteCommentUpdate = (cache, result) => {
    const {
      data: {
        deleteComment: { ok, error },
      },
    } = result;

    if (ok) {
      cache.evict({
        id: `Comment:${id}`,
      });
    }
  };

  const [deleteComment, { loading }] = useMutation(DELETE_COMMENT_MUTATAION, {
    variables: {
      id,
    },
    update: deleteCommentUpdate,
  });
  return (
    <CommentContainer>
      <div>
        <Link to={`${PROFILE_PATH}/${author}`}>
          <FatText>{author}</FatText>
        </Link>
        <CommentCaption>
          {payload.split(" ").map((word, index) =>
            /#[\w]+/.test(word) ? (
              <React.Fragment key={index}>
                <Link to={`/hashtags/${word}`}>{word + " "}</Link>
              </React.Fragment>
            ) : (
              <React.Fragment key={index}>{word} </React.Fragment>
            )
          )}
        </CommentCaption>
      </div>
      {isMine === true ? (
        <PhotoAction onClick={deleteComment}>
          <FontAwesomeIcon icon={faRemove} />
        </PhotoAction>
      ) : null}
    </CommentContainer>
  );
};
export const PhotoAction = styled.div`
  margin-right: 10px;
  padding: 3px;
  cursor: pointer;
`;
export default Comment;
