import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getTaskList, deleteTask, createTask } from '../util'

import {CircularProgress} from "material-ui"
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import Grid from '../containers/Grid'
import TaskCard from "./cards/TaskCard"
import Paragraph from "./basic/Paragraph"
import Header from "./basic/Header"
import CreateTask from "./dialogs/CreateTask";

class TaskList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            globalError: null,
            taskData: null,
            error: null
        }
    }

    _fetch(token) {
        getTaskList(token, (result) => {
            this.setState(() => {
                return {
                    taskData: result,
                    error: null
                }
            })
        }, () => {
            this.setState(() => {
                return {
                    taskData: null,
                    error: true
                }
            })
        })
    }

    componentWillMount() {
        const { session: {token} } = this.props;

        this._fetch(token)
    }

    _delete() {
        return (name) => {
            const {session: {token}} = this.props;

            deleteTask(token, name, () => {
                this._fetch(token)
            }, () => {
                this.setState((state) => {
                    return Object.assign({}, state, {
                        globalError: "Failed to delete task"
                    })
                })
            })
        }
    }

    _create() {
        return (task) => {
            const { session: {token} } = this.props;

            createTask(token, task, () => {
                this._fetch(token)
            }, () => {
                this.setState((state) => {
                    return Object.assign({}, state, {
                        globalError: "Failed to create env"
                    })
                })
            })
        }
    }

    render() {
        const { session } = this.props;
        const { taskData, error, globalError } = this.state;

        if (error !== null) {
            return (<ErrorOutline />)
        }

        if (taskData === null) {
            return (<CircularProgress size={60} />)
        }

        return (
            <div>
                {globalError &&
                    <Paragraph text={globalError} color="error"/>
                }
                <Header text="Tasks">
                    <CreateTask session={session} onCreate={this._create()} />
                </Header>
                    <Paragraph text="Task are assignments that students can complete. A task always has a test assigned to it." />
                <br />
                <Grid>
                    {taskData.map((item, key) => {
                        return (
                            <TaskCard task={item} key={key} onDelete={this._delete()} />
                        )
                    })}
                </Grid>
            </div>
        )
    }
}

TaskList.propTypes = {
    session: PropTypes.object.isRequired
};

export default TaskList