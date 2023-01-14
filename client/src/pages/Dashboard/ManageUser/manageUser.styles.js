import { css } from '@emotion/react';
import { include } from '../../../constants/mixins.styles';
import { themes } from '../../../constants/colors.styles';

export const ManageUserStyles = {
    manageUser: css`
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
    `,
    container: (theme) => css`
        background-color: ${themes[theme].backgroundPrimary};
        border-radius: 16px;
        padding: 24px;
    `,
    box: css`
        margin: 0 auto;
        width: 90%;
        display: flex;
        flex-direction: column;
        gap: 15px;
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
        gap: 15px;
        ${include.mobile} {
          flex-direction: column;
          gap: 15px;
        }
    `,
    buttons: css`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `
}