import styled from "styled-components";

export const CommentContainer = styled.div`
  div {
    display: flex;
  }
  display: flex;
  justify-content: space-between;

  margin-bottom: 10px;
`;
export const CommentCaption = styled.div`
  margin-left: 10px;
  mark {
    background-color: inherit;
    color: ${(p) => p.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;
