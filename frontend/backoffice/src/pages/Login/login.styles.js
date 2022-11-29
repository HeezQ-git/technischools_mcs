import { css } from '@emotion/react';
import { include } from '../../constants/mixins.styles';
import { colors, themes } from '../../constants/colors.styles';

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
        border-radius: 20px;
        padding: 10px;
        padding-block: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
    `,
    logo: css`
        width: 200px;
        margin-bottom: 16px;
        ${include.mobile} {
            width: 150px;
        }
    `,
    loginError: css`
        color: ${colors.error};
        // display: grid;
        display: flex;
        align-items: center;
        // place-items: center;
        gap: 3px;
        margin-top: 8px;
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
