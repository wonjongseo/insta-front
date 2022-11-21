import styled from "styled-components";

export const SHeader = styled.header`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  padding: 18px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Wrapper = styled.div`
  max-width: 930px;

  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Column = styled.div`
  position: relative;

  width: 100%;
  display: flex;
  flex-direction: column;
  form {
    display: flex;
    width: 100%;
    input {
      width: 100%;
    }
  }
`;
export const Input = styled.input`
  background-repeat: no-repeat;
  border: 1px solid #ccc;
  padding: 5px 5px;
  justify-items: center;

  &::-webkit-input-placeholder {
    background-image: url(https://cdn1.iconfinder.com/data/icons/hawcons/32/698627-icon-111-search-256.png);
    background-size: contain;
    background-position: 1px center;
    background-repeat: no-repeat;
    text-align: center;
    text-indent: 0;
  }

  width: 140%;
  border-radius: 3px;
  padding: 7px;
  background-color: #efefef;
  ${(props) => (props.hasError ? "tomato" : props.theme.borderColor)};

  &::placeholder {
    font-size: 14px;
  }
`;
export const Icon = styled.div`
  margin-left: 18px;
  cursor: pointer;
`;

export const Btn = styled.span`
  background-color: ${(props) => props.theme.accent};
  color: white;
  border-radius: 4px;
  padding: 5px 15px;
  font-weight: 600;
`;
export const Button = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  padding: 4px 15px;
  color: white;
  font-weight: 600;
`;

export const IconsContainer = styled.div`
  display: flex;
  width: 100%;
  font-size: 17px;
  justify-content: end;
  align-items: center;
`;
