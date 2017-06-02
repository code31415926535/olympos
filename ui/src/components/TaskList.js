import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getTaskList } from '../util'

import {CircularProgress} from "material-ui"
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import Grid from '../containers/Grid'
import CardNew from "./basic/CardNew"
import TaskCard from "./basic/TaskCard"

class TaskList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            taskData: null,
            error: null
        }
    }

    componentWillMount() {
        const { session } = this.props;

        getTaskList(session.token, (result) => {
            this.setState(() => {
                result.push(null);
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

    render() {
        const { taskData, error } = this.state;

        if (error !== null) {
            return (<ErrorOutline />)
        }

        if (taskData === null) {
            return (<CircularProgress size={60} />)
        }

        return (
            <Grid>
                {taskData.map((item, key) => {
                    if (item === null) {
                        return (
                            <CardNew/>
                        )
                    }

                    return (
                        <TaskCard task={item} key={key} />
                    )
                })}
            </Grid>
        )
    }
}

TaskList.propTypes = {
    session: PropTypes.object.isRequired
};

export default TaskList