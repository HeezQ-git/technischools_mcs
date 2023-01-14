import { keyframes } from "@emotion/react";

export const fadeInFromNone = keyframes`
    0% {
      display: none;
      opacity: 0;
    }
  
    1% {
      display: block;
      opacity: 0;
    }
  
    100% {
      display: block;
      opacity: 1;
    }
`

export const rotation = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
`
