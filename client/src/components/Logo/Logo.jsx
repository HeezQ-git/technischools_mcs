import { css } from "@emotion/core";
import { useContext } from "react";
import { ThemeContext } from "../../App";
import { colors } from "../../constants/colors.styles";

const Logo = ({ size }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <svg
      css={css`width: ${size}px; height: ${size}px; fill: ${theme === 'dark' ? '#fff' : colors.primary}`}
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 210.78 185.84"
    ><defs /><path
        className="cls-1"
        d="M361.38,256c0,.25,0,.49,0,.74a97.85,97.85,0,0,1-7,37.34,87,87,0,0,1-19.71,29.62A90.61,90.61,0,0,1,304,343.23a99,99,0,0,1-20.78,5.61,7,7,0,0,1-1,.08H220.67a6.15,6.15,0,0,1-5-2.51l-63.9-86.75a6.18,6.18,0,0,1,0-7.32l63.9-86.75a6.15,6.15,0,0,1,5-2.51h61.52a7,7,0,0,1,1,.08A99,99,0,0,1,304,168.77a90.61,90.61,0,0,1,30.66,19.53,87,87,0,0,1,19.71,29.62,97.85,97.85,0,0,1,7,37.34C361.39,255.51,361.39,255.75,361.38,256Z"
        transform="translate(-150.61 -163.08)"
      /></svg
    >
  )
}


export default Logo;