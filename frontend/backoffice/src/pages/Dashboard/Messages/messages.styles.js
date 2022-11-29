import { css } from '@emotion/react';
import { themes, colors } from '../../../constants/colors.styles';
import { include } from '../../../constants/mixins.styles';

export const SendMessageStyles = {
    messages: css`
        width: 100%;
        padding-bottom: 24px;
        display: flex;
        gap: 50px;
        ${include.tablet} {
            flex-direction: column;
        }
    `,
    sendMessage: (theme) => css`
        flex: 1;
        min-height: 75vh;
        background-color: ${themes[theme].backgroundPrimary};
        border-radius: 20px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;
    `,
    fullWidth: css`
        width: 100%;
    `,
    submit: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
    radioGroup: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    `,
    button: css`
        width: 120px;
    `,
}

export const MessagesHistoryStyles = {
    history: (theme) => css`
        flex: 1;
        min-height: 75vh;
        background-color: ${themes[theme].backgroundPrimary};
        border-radius: 20px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;
    `,
    search: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        h2 {
            font-weight: 500;
            font-size: 18px;
        }
    `,
    list: css`
        max-height: 55vh;
        overflow-y: scroll;
    `,
    noMessages: css`
        text-align: center;
        font-size: 18px;
        font-weight: 500;
    `,
    openedMessage: css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    `,
    openedMessageHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
    `,
    openedMessageTitle: css`
        font-size: 20px;
        font-weight: 600;
        text-align: right;
        width: 90%;
    `,
    openedMessageInfo: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;
        width: 100%;
        gap: 16px;
    `,
    receivers: (opened) => css`
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: ${opened ? '70px' : '50px'};
        ${opened ? 'overflow-y: scroll;' : 'overflow-y: hidden;'}
        user-select: none;
        transition: max-height 0.2s ease-in-out;
    `,
    arrow: (opened) => css`
        transform: ${opened ? 'rotate(0)' : 'rotate(180deg)'};
        transition: transform 0.2s ease-in-out;
    `,
    messageItem: css`
        width: 100%;
        height: 55px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    messageMain: (theme) => css`
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        height: 45px;
        border-radius: 15px;
        padding-inline: 16px;
        transition: background-color 0.2s ease-in-out;
        &:hover {
            height: 50px;
            background-color: ${themes[theme].hoverItemColor};
        }
    `,
    messageTitle: css`
        display: flex;
        align-items: center;
        gap: 8px;
        height: 95%;
        margin-block: 5px;
    `,
    messageDate: css`
        color: ${colors.gray};
        width: 200px;
        text-align: right;
    `,
}






