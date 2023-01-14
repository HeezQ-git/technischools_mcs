import { themes, colors } from '../../../constants/colors.styles';
import { css } from '@emotion/react';
import { include } from '../../../constants/mixins.styles';

export const AdminPanelStyles = {
  container: css`
    width: 100%;
    padding-bottom: 24px;
    display: flex;
    gap: 50px;
    ${include.tablet} {
        flex-direction: column;
    }
  `,
  createAccount: (theme) => css`
    flex: 1;
    height: 75vh;
    flex-direction: column;
    background-color: ${themes[theme].backgroundPrimary};
    border-radius: 16px;
    padding: 24px;
    gap: 24px;
    display: flex;
    align-items: center;
    h2 {
      font-weight: 500;
      font-size: 18px;
    } 
  `,
  createAccountHeader: css`
    display: flex;
    align-items: center;
    height: 40px;
    width: 100%;
  `,
  form: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    padding-top: 5px;
  `,
  rowGroup: css`
    display: flex;
    flex-direction: row;
    gap: 16px;
  `,

}

export const AccountListStyles = {
  container: (theme) => css`
    flex: 1;
    height: 75vh;
    background-color: ${themes[theme].backgroundPrimary};
    border-radius: 16px;
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
    height: 55vh;
    overflow-y: scroll;
  `,
  itemInfo: css`
    display: flex;
    gap: 16px;
    span {
      color: ${colors.gray};
    }
  `,
  accountItem: css`
    width: 100%;
    height: 55px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  accountMain: (theme) => css`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    height: 45px;
    border-radius: 12px;
    padding-inline: 16px;
    transition: background-color 0.2s ease -in -out;
    &:hover {
      height: 50px;
      background-color: ${themes[theme].hoverItemColor};
    }
  `,
  accountTitle: css`
    display: flex;
    align-items: center;
    gap: 8px;
    height: 95%;
    margin-block: 5px;
  `,
  accountDate: css`
    color: ${colors.gray};
    width: 200px;
    text-align: right;
  `,
  loading: css`
    color: ${colors.grayAlert}
    font-size: 16px;
    margin-block: 48px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-around;
  `,

}

