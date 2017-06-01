import React, { Component } from 'react'
import PropTypes from 'prop-types'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

injectTapEventPlugin();

class AppBody extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { theme } = this.props;

        let muiTheme = null;
        if (theme === 'light') {
            muiTheme = lightBaseTheme;
        } else if (theme === 'dark') {
            muiTheme = darkBaseTheme;
        }

        return (
            <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
                {this.props.children}
            </MuiThemeProvider>
        )
    }
}

AppBody.propTypes = {
    theme: PropTypes.oneOf(['dark', 'light']).isRequired
};

AppBody.defaultProps = {
    theme: 'light'
};

export default AppBody