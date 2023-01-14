import { css } from '@emotion/react';
import { themes } from '../../constants/colors.styles';

export const LoginStyles = {
    loginMain: css`
        height: 100%;
    `,
    loginCenter: css`
        height: 100%;
        display: grid;
        align-items: center;
    `,
    login: (theme) => css`
        background-color: ${themes[theme].backgroundPrimary};
        border-radius: 16px;
        padding: 10px;
        padding-block: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    `,
    title: css`
        font-weight: bold;
        font-size: 20px;
    `,
    inputs: css`
        display: flex;
        flex-direction: column;
        padding-top: 30px;
        gap: 15px;
        width: 75%;
    `,
    button: css`
        margin-top: 24px;
    `
}
