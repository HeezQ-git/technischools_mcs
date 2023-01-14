import { css } from '@emotion/core';
import { themes } from './constants/colors.styles';

export const AppStyles = {
  global: (theme = 'dark', preflight) => css`
    * {
      color-scheme: ${theme};
    }
    *::-webkit-scrollbar {
      background-color: ${themes[theme].backgroundPrimary};
      width: 16px;
    }

    *::-webkit-scrollbar-track {
      background-color: ${themes[theme].backgroundPrimary};
    }

    *::-webkit-scrollbar-thumb {
      background-color: ${themes[theme].scrollbarBackground};
      border-radius: 16px;
      border: 5.7px solid ${themes[theme].backgroundPrimary};
    }

    *::-webkit-scrollbar-button {
      display: none !important;
    }
    ${preflight}
    `,
  app: (theme = 'dark') => css`
        @font-face {
            font-family: "Fixel";
            src: url("assets/fonts/MacPawFixel-VF.ttf")
        }
        min-height: 100vh;
        padding-top: 10px;
        background-color: ${themes[theme].backgroundColor};
        color: ${themes[theme].textPrimary};

        font-family: 'Roboto', sans-serif;

        scroll-behavior: smooth;
        -webkit-tap-highlight-color: transparent; 
        :root {
            color-scheme: ${theme} !important;
        }
    `,
  container: css`
        width: 93%;
        margin: auto;
        min-height: 100vh;
    `,
  centered: css`
        height: 100vh;
        display: grid;
        vertical-align: center;
    `,
}
