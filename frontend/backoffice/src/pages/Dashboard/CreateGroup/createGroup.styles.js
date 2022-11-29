import { css } from '@emotion/react';
import { colors, themes } from '../../../constants/colors.styles';

export const CreateGroupStyles = {
    createGroup: css`
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
    `,
    container: (theme) => css`
        width: 100%;
        background-color: ${themes[theme].backgroundPrimary};
        border-radius: 20px;
        padding: 24px;
    `,
    box: css`
        margin: 0 auto;
        width: 90%;
        display: flex;
        flex-direction: column;
        gap: 16px;
    `,
    title: css`
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 15px;
    `,
    names: css`
        width: 100%;
        display: flex;
        justify-content: space-between;
    `,
    select: css`
        display: flex;
        align-items: center;
        gap: 20px;
    `,
    buttons: css`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
    responseError: css`
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: -10px;
        color: ${colors.error};
        opacity: 0.8;
    `
}

