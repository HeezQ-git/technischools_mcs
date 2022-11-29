import { css } from '@emotion/react';
import { themes } from '../../../constants/colors.styles';

export const TerminalStyles = {
    wrapper: css`
        z-index: 999;
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: grid;
        place-items: center;
    `,
    terminal: (theme) => css`
        background-color: ${themes[theme].backgroundPrimary};
        border-radius: 20px;
        width: 600px;
        height: 400px;
        padding: 25px;
        display: flex;
        flex-direction: column;
        outline: none;
    `,
    console: css`
        width: 100%;
        height: 100%;

    `,
    inputBox: css`
        width: 100%;
        height: 60px;
    `,
    input: css`
        width: 100%;
        height: 100%;
        outline: none;
        background-color: transparent;
    `
}