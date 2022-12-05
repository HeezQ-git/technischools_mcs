import { css } from '@emotion/core';
import { themes } from '../../constants/colors.styles';
import { include } from '../../constants/mixins.styles';

const headerHeight = 75;
const logoHeight = 57;

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
    border-radius: 20px;
    padding: ${(headerHeight - logoHeight) / 2}px 24px;
    ${include.mobile} {
      ${opened && `
      height: 165px;
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
  darkmode: css`
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        list-style: none;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 5px;
        padding-left: 16px;
  `,
  spacing: css`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
  `,
  toggleSwitch: (rotated) => css`
        padding: 4px;
        background: transparent;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: grid;
        place-content: center;
        place-items: center;
        transition: .5s;
        svg {
            transition: 0.1s;
            transform: ${rotated ? 'scale(-1, 1)' : 'scale(1)'}; 
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
        flex-wrap: wrap;
        align-items: center;
      }
  `,
  links: (theme) => css`
      display: flex;
      align-items: center;
      gap: 16px;
      margin-right: 48px;

      a {
        cursor: pointer;
        transition: 0.2s;
        font-weight: 400;
        padding: 8px 16px;
        border-radius: 12px;
        &:hover {
          background-color: ${themes[theme].hoverItemColor};
          font-weight: 500;
      }
    }
    ${include.mobile} {
      margin-right: 0;
      gap: 8px;
    }
  `,
  buttons: css`
      display: flex; 
      align-items: center; 
      gap: 16px;
  `,
  hamburgerContainer: css`
      
  `,
  hamburger: (theme) => css`
      display: none;
        ${include.mobile} {
          height: ${logoHeight}px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
  `,
  // menu: (opened) => css`
  //     display: flex;
  //     align-items: center;
  //     gap: 16px;
  //     ${include.mobile} {
  //       ${opened ? `
  //       display: flex;
  //       flex-direction: column;
  //       align-items: flex-end;
  //       ` : `display: none; opacity: 0;`}

  //     }
  // `,


}
