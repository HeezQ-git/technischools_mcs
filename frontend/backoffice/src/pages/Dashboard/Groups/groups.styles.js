import { css } from '@emotion/react';
import { themes } from '../../../constants/colors.styles';
import { include } from '../../../constants/mixins.styles';

export const GroupsStyles = {
    groups: css`
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    container: (theme) => css`
        width: 100%;
        height: 75vh;
        background-color: ${themes[theme].backgroundPrimary};
        border-radius: 20px;
        padding-block: 24px;
        display: flex;
        align-items: center;
        ${include.tablet} {
            flex-direction: column;
            height: 100%;
            margin-bottom: 50px;
        }
    `,
    groupsListContainer: (theme) => css`
        flex: 0.3;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        border-right: 1px solid ${themes[theme].backgroundColor};
        ${include.tablet} {
            flex: 1;
            width: 100%;
            padding: 0 24px;
        }
    `,
    groupsListSearch: css`
        width: 80%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        a {
            font-size: 18px;
            user-select: none;
            cursor: pointer;
        }
    `,
    groupsList: css`
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        overflow-y: scroll;
        margin-right: 8px;
        padding-bottom: 24px;
        ${include.tablet} {
            max-height: 400px;
        }
    `,
    groupsListLoader: css`
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 80%;
    `,
    main: css`
        flex: 0.7;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 16px;
        ${include.tablet} {
            flex: 1;
            width: 100%;
            padding: 0 24px;
        }
    `,
    mainSearch: (theme) => css`
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        ${include.tablet} {
            border-top: 2px solid ${themes[theme].backgroundColor};
            padding-top: 16px;
        }
    `,
    mainSearchInput: css`
        width: 80%;
    `,
    userLists: css`
        display: flex;
        height: 100%;
        overflow: hidden;
        ${include.tablet} {
            flex-direction: column;
        }
    `,
    userListsTitles: (opened) => css`
        display: flex;
        justify-content: center;
        gap: 32px;
        width: 150px;
        margin-inline: auto;
        transition: all 0.2s ease;
        ${include.tablet} {
            margin-top: 7px;
            justify-content: ${opened ? 'center' : 'space-between'};
        }
    `,
    userListsTitle: (theme, opened) => css`
        font-size: 18px;
        font-weight: 500;
        color: ${themes[theme].titlesColor};
        text-align: center;
        cursor: pointer;
        &:last-child {
            display: grid;
            place-items: center;
            transform-origin: center;
            transform: rotateX(${opened ? '180deg' : '0deg'});
            transition: 0.2s;
          }
    `,
    userItemsList: (opened) => css`
        display: flex;
        flex-direction: column;
        margin-top: 16px;
        gap: 24px;
        overflow-y: scroll;
        height: 100%;
        padding: 0 8px 32px 8px;
        transition: all 0.2s ease;
        ${include.tablet} {
            max-height: ${opened ? '400px' : '0px'};
            overflow: ${opened ? 'scroll' : 'hidden'};
            ${opened && 'opacity: 1;'}
        } //? sprawdzisz czy to dziala, bo w groups.scss byla classa .closed
    `,
    usersListContainer: (theme, type) => css`
        flex: 0.5;
        height: 100%;
        padding: 8px 16px 32px 16px;
        margin-${type === 'in' ? 'right' : 'left'}: 4px;
        ${type === 'out' && `border-left: 1.5px solid ${themes[theme].backgroundColor};`}
        ${include.tablet} {
            flex: 1;
            width: 100%;
            padding-bottom: 8px;
            ${type === 'out' && `
            border-top: 2px ${themes[theme].backgroundColor} solid;
            border-left: 0;
            `}
        }
    `,
    icon: (theme) => css`
        color: ${themes[theme].iconColor};
        cursor: pointer;
    `,
    textPrimary: (theme) => css`
        color: ${themes[theme].textPrimary};
    `,
    chooseGroupTitle: css`
        color: #c2c2c2; //! TO DO ZMIANY
        font-size: 20px;
        font-weight: 500;
        text-align: center;
        margin-top: 100px;

        ${include.tablet} {
            height: 100%;
            margin-block: 20px;
        }
    `,
}

export const UserItemStyles = {
    container: (opened) => css`
        height: ${opened ? 130 : 40}px;
        ${include.mobile} {
            max - width: 250px;
        }
        &:hover {
            h2 {
                opacity: 1;
            }
        }
    `,
    item: (theme, opened) => css`
        display: ${opened ? 'grid' : 'flex'};
        height: ${opened ? 130 : 35}px;
        ${opened ?
            `background-color: ${themes[theme].hoverItemColor};
            grid-template-columns: auto 30px;` :
            `align-items: center;
            justify-content: space-between;`
        }
        padding: ${!opened && '0'} 16px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s ease;

        h2 {
            transition: all 0.2s ease;
            ${opened && `
            opacity: 1;
            margin-left: auto;
            `}
        }
        &:hover {
            ${!opened && 'height: 40px;'}
            background-color: ${themes[theme].hoverItemColor}
        }
        ${include.tablet} {
            h2 {
                opacity: 1;
            }
        }
    `,
    addToGroup: (opened) => css`
        ${opened && `
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        `}
    `,
    info: (opened) => css`
        ${opened && `grid-row-start: 2;`}
        margin-right: auto;
    `,

}

export const GroupItemStyles = {
    container: css`
        width: 80%;
        ${include.mobile} {
            max-width: 250px;
        }
    `,
    groupItem: css`
        width: 100%;
        height: 55px;
        cursor: pointer;
    `,
    groupItemButtons: (chosen, hover, editing) => css`
        opacity: ${chosen || hover || editing ? 1 : 0};
        display: flex;
        align-items: center;
        gap: 10px;
        transition: 0.2s;
        margin-right: 10px;

        h2 {
            user-select: none;
        }
    `,
    groupItemMain: (theme, chosen) => css`
        display: flex;
        align-items: center;
        width: 100%;
        height: ${chosen ? 50 : 45}px;
        border-radius: 15px;
        transition: all 0.2s ease;
        ${chosen && `background-color: ${themes[theme].hoverItemColor};`}
        &:hover {
            background-color: ${themes[theme].hoverItemColor};
            height: 50px;
        }
    `,
    groupItemNames: css`
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        height: 95%;
        margin: 5px 10px;

        h2 {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    `,
    renameInput: css`
        width: 90%;
        height: 50%;

        &::placeholder {
            user-select: none;
        }
    `,





}
