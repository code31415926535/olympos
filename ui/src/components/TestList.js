import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getTestList } from '../util'

import {CircularProgress} from "material-ui"
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import TestCard from "./cards/TestCard"
import Grid from "../containers/Grid"

class TestList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            testData: null,
            error: null
        }
    }

    componentWillMount() {
        const { session } = this.props;

        getTestList(session.token, (result) => {
            this.setState(() => {
                return {
                    testData: result,
                    error: null
                }
            })
        }, () => {
            this.setState(() => {
                return {
                    testData: null,
                    error: true
                }
            })
        })
    }

    render() {
        const { testData, error } = this.state;

        if (error !== null) {
            return (<ErrorOutline />)
        }

        if (testData === null) {
            return (<CircularProgress size={60} />)
        }

        return (
            <Grid>
                {testData.map((item, key) => {
                    return (
                        <TestCard test={item} key={key}/>
                    )
                })}
            </Grid>
        )
    }
}

TestList.propTypes = {
    session: PropTypes.object.isRequired
};

export default TestList