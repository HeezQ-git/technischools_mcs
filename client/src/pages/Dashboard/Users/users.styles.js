import { css } from '@emotion/react';
import { themes, colors } from '../../../constants/colors.styles';
import { include } from '../../../constants/mixins.styles';
import { fadeInFromNone, rotation } from '../../../constants/keyframes.styles';

export const UsersStyles = {
    panel: css`
        width: 100%;
        padding-bottom: 25px;
    `,
    container: (theme) => css`
        margin: 0 auto;
        background-color: ${themes[theme].backgroundPrimary};
        border-radius: 16px;
        padding: 24px;
    `,
    searchBar: css`
        display: flex;
        align-items: center;
        gap: 20px;
        margin-top: 16px;
    `,
    users: css`
        position: relative;
        margin-block: 16px;
        ${include.mobile} {
            padding-inline: 0;
        }
    `,
    usersContainer: css`
        height: 50px;
        transition: all 0.2s ease-in-out;
        &:hover {
            ${include.mobile} {
                height: 125px;
            }
            ${include.tablet} {
                height: 100px;
            }
        }
    `,
    user: (theme) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-block: 8px;
        padding: 4px 24px;
        height: 50px;
        border-radius: 12px;
        transition: all 0.2s ease-in-out;
        &:hover {
            background-color: ${themes[theme].hoverItemColor};
            height: 55px;
            ${include.mobile} {
                height: 125px;
            }
            ${include.tablet} {
                height: 100px;
            }
        }
    `,
    userItems: css`
        display: flex;
        align-items: center;
        gap: 30px;
        padding-left: 8px;

    `,
    onHoverInfo: (show) => css`
        display: flex;
        opacity: ${show ? 1 : 0};
        transition: all 0.2s ease-in-out;
        gap: 24px;
    `,
    icons: (show) => css`
        display: ${show ? 'flex' : 'none'};
        gap: 4px;
        margin-right: 4px;
        user-select: none;
        cursor: pointer;
        ${show ? css`animation: ${fadeInFromNone} 0.3s ease-in-out;` : ''}
        ${include.mobile} {
            flex-direction: column;
        }
    `,
    loading: css`
        display: flex;
        align-items: center;
        margin-top: 20px;
        opacity: 0.3;
        padding: 8px;
        gap: 8px;
    `,
    loader: (rotating) => css`
        animation: ${rotation} 0.6s forwards ${rotating ? 'infinite' : '0.5s'} ease;
    `,
    loadingText: css`
        color: ${colors.grayAlert}
        font-size: 16px;
        margin-block: 48px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-around;
    `,
    pagination: css`
        display: flex;
        align-items: center;
        nav {
            margin: 0 auto;
        }
    `,
    usersCount: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 24px;
        width: 100%;
    `,
    userCountText: css`
        opacity: 0.3;
        user-select: none;
        font-size: .9em;
    `,
    icon: (theme) => css`
        display: grid;
        place-items: center;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer; 
        transition: 0.2s;
        &:hover {
        background-color: ${themes[theme].hoverItemColor};
        }
    `,
}
