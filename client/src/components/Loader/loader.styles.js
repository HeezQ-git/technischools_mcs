import { css } from '@emotion/react';
import { colors } from '../../constants/colors.styles';

export const LoaderStyles = {
    loader: css`
        width: 100%;
        margin-top: 160px;
        text-align: center;
        color: ${colors.grayAlert};
        font-size: 1.2rem;
        font-weight: 500;
    `,
}
