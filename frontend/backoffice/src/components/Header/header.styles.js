import { css } from '@emotion/core';
import { include } from '../../constants/mixins.styles';
import { colors, themes } from '../../constants/colors.styles';

export const HeaderStyles = {
  header: css`
    margin-inline: auto;
    margin-bottom: 36px;
    width: 100%;
    height: 75px;
    `,
  container: (theme) => css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${themes[theme].backgroundPrimary};
        border-radius: 20px;
    `,
  content: css`
        width: 95%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
      height: 57px;
      cursor: pointer;
      user-select: none;
    `,
  buttons: css`
      display: flex; 
      align-items: center; 
      gap: 8px;
    `,
}
