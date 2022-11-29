import { css } from '@emotion/core';
import { include } from '../../constants/mixins.styles';
import { themes } from '../../constants/colors.styles';
export const DashboardStyles = {
    dashboard: (theme) => css`
    `,
    container: css`
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 36px;
        height: 100%;
        ${include.mobile} {
            justify-content: center;
        }
    `,
    boxWrap: css`
        height: 150px;
        width: 150px;
        ${include.mobile} {
            width: 100%;
            height: 100px;
        }
    `,
    box: (theme) => css`
        width: 140px;
        height: 140px;
        border-radius: 20px;
        padding: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 18px;
        font-weight: 500;
        transition: 0.2s;
        background-color: ${themes[theme].backgroundPrimary};
        &:hover {
            width: 150px;
            height: 150px;
        }
        ${include.mobile} {
            width: 100%;
            height: 100px;
            &:hover {
                width: 100%;
                height: 100px;
            }
          }`,
}