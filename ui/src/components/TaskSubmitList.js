import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getTaskList } from '../util'

import {CircularProgress} from "material-ui"
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import Grid from '../containers/Grid'
import TaskSubmitCard from "./cards/TaskSubmitCard";

class TaskSubmitList extends Component {
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
        const { toScreen } = this.props;
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
                    return (
                        <TaskSubmitCard task={item}
                                        key={key}
                                        onMoreClick={() => {
                                            toScreen('/task/' + item.name)
                                        }}/>
                    )
                })}
            </Grid>
        )
    }
}

TaskSubmitList.propTypes = {
    session: PropTypes.object.isRequired,
    toScreen: PropTypes.func.isRequired
};

export default TaskSubmitList