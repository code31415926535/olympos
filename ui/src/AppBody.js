import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import olymposLight from './themes/olymposLight'
import olymposDark from './themes/olymposDark'

import { grey50, grey800 } from 'material-ui/styles/colors'

injectTapEventPlugin();

const lightBackground = grey50;
const darkBackground = grey800;

class AppBody extends Component {
    constructor(props) {
        super(props)
    }

    render() {

        const { theme } = this.props;

        let muiTheme = null;
        if (theme.value === 'light') {
            muiTheme = olymposLight;
            document.body.style.background = lightBackground;
        } else if (theme.value === 'dark') {
            muiTheme = olymposDark;
            document.body.style.background = darkBackground;
        }

        return (
            <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
                {this.props.children}
            </MuiThemeProvider>
        )
    }
}

AppBody.propTypes = {
    theme: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        theme: state.theme
    }
};

const mapDispatchToProps = () => {
    return {}
};

const ReduxAppBody = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppBody);

export default ReduxAppBody