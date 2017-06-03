import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getTestList, deleteTest, createTest, createTestFile } from '../util'

import {CircularProgress} from "material-ui"
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import TestCard from "./cards/TestCard"
import Grid from "../containers/Grid"
import Paragraph from "./basic/Paragraph";
import Header from "./basic/Header";
import CreateTest from "./dialogs/CreateTest";

class TestList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            globalError: null,
            testData: null,
            error: null
        }
    }

    _fetch(token) {
        getTestList(token, (result) => {
            this.setState(() => {
                console.log(result);
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

    componentWillMount() {
        const { session: {token} } = this.props;

        this._fetch(token)
    }

    _delete() {
        return (name) => {
            const {session: {token}} = this.props;

            deleteTest(token, name, () => {
                this._fetch(token)
            }, () => {
                this.setState((state) => {
                    return Object.assign({}, state, {
                        globalError: "Failed to delete test"
                    })
                })
            })
        }
    }

    _create() {
        return (test) => {

            console.log(test);

            const { session: {token} } = this.props;

            createTest(token, test, () => {
                this._fetch(token)
            }, () => {
                this.setState((state) => {
                    return Object.assign({}, state, {
                        globalError: "Failed to create test"
                    })
                })
            })
        }
    }

    _addFile() {
        return (testName, file) => {
            const { session: {token} } = this.props;

            createTestFile(token, testName, file, () => {
                this._fetch(token)
            }, () => {
                this.setState((state) => {
                    return Object.assign({}, state, {
                        globalError: "Failed to create test file"
                    })
                })
            })
        }
    }

    render() {
        const { session } = this.props;
        const { testData, error, globalError } = this.state;

        if (error !== null) {
            return (<ErrorOutline />)
        }

        if (testData === null) {
            return (<CircularProgress size={60} />)
        }

        return (
            <div>
                {globalError &&
                    <Paragraph text={globalError} color="error"/>
                }
                <Header text="Tests">
                    <CreateTest session={session} onCreate={this._create()}/>
                </Header>
                <Paragraph text="Tests consist of a test configuration file and a list of other test files." />
                <br />
                <Grid>
                    {testData.map((item, key) => {
                        return (
                            <TestCard session={session} test={item} key={key} onDelete={this._delete()} onAddFile={this._addFile()}/>
                        )
                    })}
                </Grid>
            </div>
        )
    }
}

TestList.propTypes = {
    session: PropTypes.object.isRequired
};

export default TestList