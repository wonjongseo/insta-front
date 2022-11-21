import styled from "styled-components";
import { MAIN_COLOR } from "../../../styles";

export const CommentsContainer = styled.div`
  margin-top: 30px;
`;

export const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-weight: 600;
  font-size: 10px;
`;

export const CommentBox = styled.div`
  margin-top: 10px;
  border-top: 1px solid rgb(239, 239, 239);
  form {
    margin-top: 10px;
    display: flex;
    width: 100%;

    justify-content: space-between;
    input[type="submit"] {
      color: ${MAIN_COLOR};
    }
  }
`;
