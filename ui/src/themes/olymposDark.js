/* Based on: https://github.com/callemall/material-ui/blob/master/src/styles/baseThemes/darkBaseTheme.js */

import {
    grey600,
    fullWhite, indigo900, indigo600, lightBlue100, indigo700,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    borderRadius: 2,
    palette: {
        primary1Color: indigo700,
        primary2Color: grey600,
        primary3Color: grey600,
        accent1Color: indigo900,
        accent2Color: indigo600,
        accent3Color: lightBlue100,
        textColor: fullWhite,
        secondaryTextColor: fade(fullWhite, 0.7),
        alternateTextColor: lightBlue100,
        canvasColor: '#303030',
        borderColor: fade(fullWhite, 0.3),
        disabledColor: fade(fullWhite, 0.3),
        pickerHeaderColor: fade(fullWhite, 0.12),
        clockCircleColor: fade(fullWhite, 0.12),
    },
};