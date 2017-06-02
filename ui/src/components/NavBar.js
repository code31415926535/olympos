import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { changeTheme, logOut } from '../actions'

import {
    IconMenu, FlatButton, Toggle,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle,
    IconButton, MenuItem
} from "material-ui"
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Home from 'material-ui/svg-icons/action/home'
import Manage from 'material-ui/svg-icons/action/build'
import Tasks from 'material-ui/svg-icons/social/school'
import InvertColors from 'material-ui/svg-icons/action/invert-colors'
import ExitTheApp from 'material-ui/svg-icons/action/exit-to-app'

class NavBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { session, theme, screen,
            toScreen, onThemeToggle, onLogOut } = this.props;

        let navigationMenu = null;
        if (session.token !== null) {
            navigationMenu = (
                <ToolbarGroup>
                    <IconButton onTouchTap={() => {
                                    toScreen('home')
                                }}
                                style={{
                                    marginRight: "20px"
                                }}>
                        <Home />
                    </IconButton>
                    <IconButton onTouchTap={() => {
                                    toScreen('manage')
                                }}
                                style={{
                                    marginRight: "20px"
                                }}>
                        <Manage />
                    </IconButton>
                    <IconButton onTouchTap={() => {
                                    toScreen('tasks')
                                }}>
                        <Tasks />
                    </IconButton>
                    <ToolbarSeparator/>
                </ToolbarGroup>
            )
        }

        let rightMenu = null;
        if (session.token === null) {
            if (screen === 'login') {
                rightMenu = (
                    <FlatButton label="Register"
                                primary={true}
                                onClick={() => {
                                  toScreen('register')
                                }} />
                )
            } else {
                rightMenu = (
                    <FlatButton label="Login"
                                primary={true}
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
                    <MenuItem primaryText="Logout"
                              rightIcon={<ExitTheApp/>}
                              onTouchTap={() => {
                                  onLogOut()
                              }}/>
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
                    <Toggle style={{
                                width: "60px"
                            }}
                            labelPosition="left"
                            label={<InvertColors />}
                            toggled={toggled}
                            onToggle={() => {
                                onThemeToggle();
                                toScreen('/')
                            }} />
                    <ToolbarSeparator style={{
                        margin: "20px"
                    }} />
                    {navigationMenu}
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
    onThemeToggle: PropTypes.func.isRequired,
    onLogOut: PropTypes.func.isRequired
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
        },
        onLogOut: () => {
            dispatch(logOut())
        }
    }
};

const ReduxNavBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar);

export default ReduxNavBar