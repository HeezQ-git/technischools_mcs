import { css } from '@emotion/core';
import { themes } from '../../constants/colors.styles';
import { include } from '../../constants/mixins.styles';

const headerHeight = 75;
const logoHeight = 57;

function getNthByPage(page) {
  switch (page) {
    case "users":
      return 1;
    case "groups":
      return 2;
    case "messages":
      return 3;
    case "admin":
      return 4;
    default:
      return 0;
  }
}


export const HeaderStyles = {
  container: (theme, opened) => css`
    margin-inline: auto;
    margin-bottom: 36px;
    width: 100%;
    height: ${headerHeight}px;
    transition: height 0.2s ease-in-out;  
    display: flex;
    justify-content: center;
    background-color: ${themes[theme].backgroundPrimary};
    border-radius: 16px;
    padding: ${(headerHeight - logoHeight) / 2}px 24px;
    ${include.mobile} {
      ${opened && `
      height: 140px;
      `}
    } 
  `,
  content: (opened) => css`
        width: 100%;
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        ${include.mobile} {
          align-items: center;
          ${opened && `
          align-items: flex-start;
          `}
          flex-wrap: wrap;
        }

  `,
  toggleSwitch: (theme) => css`
        padding: 8px;
        border-radius: 8px;
        background: transparent;
        cursor: pointer;
        display: grid;
        place-content: center;
        place-items: center;
        transition: transform .5s;
        &:hover {
          background-color: ${themes[theme].hoverItemColor};
        }

  `,
  logo: css`
      height: ${logoHeight}px;
      cursor: pointer;
      user-select: none;
  `,
  actions: (opened) => css`
      display: flex;
      align-items: center;  
      ${include.mobile} {
        width: 100%;
        justify-content: space-between;
        margin-block: 16px;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        ${opened && `
        opacity: 1;`}
        align-items: center;
      }
  `,
  links: (theme, page) => css`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-right: 48px;
    a {
      cursor: pointer;
      transition: 0.2s;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 12px;
      &:hover {
        background-color: ${themes[theme].hoverItemColor};
      }
      &:nth-of-type(${getNthByPage(page)}) {
        background-color: ${themes[theme].hoverItemColor};
      }
    }
    ${include.mobile} {
      margin-right: 0;
      gap: 8px;
      flex-wrap: wrap;
    }
    ${include.tablet} {
      a {
        padding: 8px;
      }
    }
  `,
  buttons: css`
      display: flex; 
      align-items: center; 
      gap: 16px;
      margin-left: auto;
  `,
  hamburger: (theme) => css`
      display: none;
        ${include.mobile} {
          margin-block: auto;
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          &:hover {
            background-color: ${themes[theme].hoverItemColor};
          }
        }
  `,
  logout: (theme) => css`
    padding: 8px;
    border-radius: 8px;
    cursor: pointer; 
    transition: 0.2s;
    &:hover {
      background-color: ${themes[theme].hoverItemColor};
    }
  `
}