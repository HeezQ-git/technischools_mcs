import { breakpoints } from "./breakpoints";
export const include = {
    smallMobile: `@media (max-width: ${breakpoints.smallMobile}px)`,
    mobile: `@media (max-width: ${breakpoints.mobile}px)`,
    tablet: `@media (max-width: ${breakpoints.tablet}px)`,
    smallScreen: `@media (max-width: ${breakpoints.smallScreen}px)`,
    desktop: `@media (max-width: ${breakpoints.desktop}px)`
};



