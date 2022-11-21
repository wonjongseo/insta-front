import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const MAIN_COLOR = "#0095f6";
export const lightTheme = {
  accent: MAIN_COLOR,
  bgColor: "#FAFAFA",
  fontColor: "rgb(38, 38, 38)",
  borderColor: "rgb(219, 219, 219)",
};

export const darkTheme = {
  fontColor: "white",
  bgColor: "#000",
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    input {
      all:unset;
    }
    body {
        background-color:${(props) => props.theme.bgColor};
        font-size:14px;
        font-family:'Open Sans', sans-serif;
        color:${(props) => props.theme.fontColor};
    }
    *{
        box-sizing: border-box;
    }
    svg{
      color:black
    }
    a {
      color :inherit;
        text-decoration: none ;
    }
    
`;
