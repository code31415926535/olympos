import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { getTaskByName, submitFile } from '../util'

import NavBar from "../components/NavBar"
import FlexContainerCenter from "../containers/FlexContainerCenter"
import {CircularProgress, Tab, Tabs} from "material-ui"
import Header from "../components/basic/Header"
import Multiline from "../components/basic/Multiline"
import ResultTable from "../components/ResultTable";
import SubmitFile from "../components/dialogs/SubmitFile";
import Paragraph from "../components/basic/Paragraph";

class Task extends Component {
    constructor(props) {
        super(props);

        this.state = {
            globalError: null,
            taskData: null,
            error: null
        }
    }

    componentWillMount() {
        const { session, params: {taskName} } = this.props;

        getTaskByName(session.token, taskName, (result) => {
            this.setState(() => {
                return {
                    globalError: null,
                    taskData: result,
                    error: null
                }
            })
        }, () => {
            this.setState(() => {
                return {
                    globalError: null,
                    taskData: null,
                    error: true
                }
            })
        })
    }


    _OnSubmit() {
        return (file) => {
            const {session: {token}, toScreen, params: {taskName}} = this.props;

            submitFile(token, taskName, file, () => {
                toScreen('task/' + taskName)
            }, () => {
                this.setState((state) => {
                    Object.assign({}, state, {
                        globalError: "Failed to submit file ... Try again later"
                    })
                })
            })
        }
    };

    render() {
        const { session, toScreen, params: {taskName} } = this.props;
        const { taskData, error, globalError } = this.state;

        if (session.token === null) {
            toScreen('/login');
            return null
        }

        if (error !== null) {
            return (<ErrorOutline />)
        }

        if (taskData === null) {
            return (<CircularProgress size={60} />)
        }

        return (
            <div>
                <NavBar screen={'task/' + taskName} />
                <br />
                <br />
                <FlexContainerCenter>
                    <Tabs>
                        <Tab label="Description">
                            <div style={{
                                margin: "10px",
                                padding: "35px"
                            }}>
                                <Header text={taskData.name}>
                                    <SubmitFile onSubmit={this._OnSubmit()}/>
                                </Header>
                                {globalError &&
                                    <Paragraph text={globalError} color="error"/>
                                }
                                <Multiline text={taskData.description} />
                            </div>
                        </Tab>
                        <Tab label="Results">
                            <div style={{
                                margin: "10px",
                                padding: "35px"
                            }}>
                                <ResultTable session={session} taskName={taskData.name} />
                            </div>
                        </Tab>
                    </Tabs>
                </FlexContainerCenter>
            </div>
        )
    }
}

Task.propTypes = {
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

const ReduxTask = connect(
    mapStateToProps,
    mapDispatchToProps
)(Task);

export default ReduxTask