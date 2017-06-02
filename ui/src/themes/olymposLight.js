/* Based on: https://github.com/callemall/material-ui/blob/master/src/styles/baseThemes/lightBaseTheme.js */

import {
    cyan500,
    grey300, grey500,
    white, darkBlack, fullBlack, lightBlue400, lightBlue800, grey600, tealA200,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: lightBlue800,
        primary2Color: grey600,
        primary3Color: grey300,
        accent1Color: tealA200,
        accent2Color: lightBlue400,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: cyan500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
};