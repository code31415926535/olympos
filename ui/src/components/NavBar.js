import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { changeTheme } from '../actions'

import {
    IconMenu, FlatButton, Toggle,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle,
    IconButton, MenuItem
} from "material-ui"
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ExitTheApp from 'material-ui/svg-icons/action/exit-to-app'
import Paragraph from "./basic/Paragraph";

class NavBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { session, theme, screen,
            toScreen, onThemeToggle, onLogOut } = this.props;

        let rightMenu = null;
        if (session.value === null) {
            if (screen === 'login') {
                rightMenu = (
                    <FlatButton label="Register"
                                secondary={true}
                                onClick={() => {
                                  toScreen('register')
                                }} />
                )
            } else {
                rightMenu = (
                    <FlatButton label="Login"
                                secondary={true}
                                onClick={() => {
                                    toScreen('login')
                                }}/>
                )
            }
        } else {
            rightMenu = (
                <IconMenu
                    iconButtonElement={
                        <IconButton><MoreVertIcon /></IconButton>
                    }
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                    <MenuItem primaryText="Logout" rightIcon={<ExitTheApp/>}/>
                </IconMenu>
            )
        }

        const toggled = theme.value === 'light';

        return (
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text="Olympos"
                                  style={{width: "120px"}}/>
                    <ToolbarSeparator style={{
                        margin: "20px"
                    }} />
                    <Paragraph text="Dark" color="secondary" />
                    <Toggle style={{
                                marginLeft: "20px",
                                width: "60px"
                            }}
                            labelPosition="right"
                            toggled={toggled}
                            onToggle={() => {
                                onThemeToggle();
                                toScreen('/')
                            }} />
                    <Paragraph text="Light" color="secondary"/>
                    <ToolbarSeparator style={{
                        margin: "20px"
                    }} />
                </ToolbarGroup>

                <ToolbarGroup lastChild={true}>
                    {rightMenu}
                </ToolbarGroup>
            </Toolbar>
        )
    }
}

NavBar.propTypes = {
    session: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    screen: PropTypes.string.isRequired,

    toScreen: PropTypes.func.isRequired,
    onThemeToggle: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
      session: state.session,
      theme: state.theme
  }
};

const mapDispatchToProps = (dispatch) => {
    return {
        toScreen: (name) => {
            dispatch(push(name))
        },
        onThemeToggle: () => {
            dispatch(changeTheme())
        }
    }
};

const ReduxNavBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar);

export default ReduxNavBar