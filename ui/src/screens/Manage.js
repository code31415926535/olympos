import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import NavBar from "../components/NavBar"
import FlexContainerCenter from "../containers/FlexContainerCenter"
import EnvList from "../components/EnvList"
import {Tab, Tabs} from "material-ui"
import Header from "../components/basic/Header"
import Paragraph from "../components/basic/Paragraph"
import TestList from "../components/TestList"
import UserList from "../components/UserList"
import TaskList from "../components/TaskList"

class Manage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { session, toScreen } = this.props;

        if (session.token === null) {
            toScreen('/login');
            return null
        }

        return (
            <div>
                <NavBar screen='manage'/>
                <br />
                <br />
                <FlexContainerCenter>
                        <Tabs>
                            <Tab label="Environment">
                                <div style={{
                                           margin: "10px",
                                           padding: "35px"
                                       }}>
                                    <EnvList session={session} />
                                </div>
                            </Tab>
                            <Tab label="Tests">
                                <div style={{
                                           margin: "10px",
                                           padding: "35px"
                                       }}>
                                    <TestList session={session} />
                                </div>
                            </Tab>
                            <Tab label="Tasks">
                                <div style={{
                                    margin: "10px",
                                    padding: "35px"
                                }}>
                                    <TaskList session={session} />
                                </div>
                            </Tab>
                            <Tab label="Users">
                                <div style={{
                                        margin: "10px",
                                        padding: "35px"
                                    }}>
                                    <Header text="Users" />
                                    <Paragraph text="Here you can see a list of all users. You can change their permissions from here." />
                                    <br />
                                    <UserList session={session} />
                                </div>
                            </Tab>
                        </Tabs>
                </FlexContainerCenter>
            </div>
        )
    }
}

Manage.propTypes = {
    session: PropTypes.object.isRequired,
    toScreen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        session: state.session
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        toScreen: (name) => {
            dispatch(push(name))
        }
    }
};

const ReduxManage = connect(
    mapStateToProps,
    mapDispatchToProps
)(Manage);

export default ReduxManage