import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getTestByName } from '../../util'

import {Dialog, Divider, FlatButton, IconButton} from "material-ui"
import TextField from 'material-ui/TextField'
import Create from 'material-ui/svg-icons/content/add'

class CreateTask extends  Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            task: {
                name: "",
                test: "",
                description: ""
            },

            testValid: true,
            testObject: null
        }
    }

    _checkTest() {
        const { task: {test} } = this.state;
        const { session: {token} } = this.props;

        getTestByName(token, test, (result) => {
            console.log(result);
            this.setState((state) => {
                return Object.assign({}, state, {
                    testObject: result,
                    testValid: true
                })
            })
        }, () => {
            this.setState((state) => {
                return Object.assign({}, state, {
                    testObject: null,
                    testValid: false
                })
            })
        })
    }

    _resetTest() {
        this.setState((state) => {
            return Object.assign({}, state, {
                testObject: null,
                testValid: true
            })
        })
    }

    _toggleDialog() {
        this.setState((state) => {
            return Object.assign({}, state, {
                dialogOpen: !state.dialogOpen
            })
        })
    };

    _onName(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                task: Object.assign({}, state.task, {
                    name: value
                })
            })
        })
    }

    _onDescription(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                task: Object.assign({}, state.task, {
                    description: value
                })
            })
        })
    }

    _onTest(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                task: Object.assign({}, state.task, {
                    test: value
                })
            })
        })
    }

    render() {
        const { onCreate } = this.props;
        const { dialogOpen, task, testObject, testValid } = this.state;

        const actions = [(
            <FlatButton label="Create"
                        primary={true}
                        onTouchTap={() => {
                            onCreate(Object.assign({}, task, {
                                test: testObject
                            }));
                            this._toggleDialog()
                        }} />
        ), (
            <FlatButton label="Cancel"
                        onTouchTap={() => {
                            this._toggleDialog()
                        }} />
        )];

        let errorMsg = "";
        if (testValid === false) {
            errorMsg = "Test not found."
        }

        return (
            <div style={{
                float: "right"
            }}>
                <IconButton onTouchTap={() => {
                    this._toggleDialog()
                }}>
                    <Create />
                </IconButton>
                <Dialog actions={actions}
                        title="Create Task"
                        open={dialogOpen}>
                    <TextField hintText="Name"
                               floatingLabelText="Name"
                               underlineShow={false}
                               fullWidth={true}
                               onChange={(_, v) => {
                                   this._onName(v)
                               }}/>
                    <Divider />
                    <TextField
                        hintText="Description"
                        floatingLabelText="Description"
                        underlineShow={false}
                        fullWidth={true}
                        multiLine={true}
                        rows={5}
                        onChange={(_, v) => {
                            this._onDescription(v)
                        }}/>
                    <Divider />
                    <TextField
                        hintText="Test"
                        floatingLabelText="Test"
                        underlineShow={false}
                        fullWidth={true}
                        errorText={errorMsg}
                        onFocus={() => {
                            this._resetTest()
                        }}
                        onBlur={() => {
                            this._checkTest()
                        }}
                        onChange={(_, v) => {
                            this._onTest(v)
                        }}/>
                    <Divider />
                </Dialog>
            </div>
        )
    }
}

CreateTask.propTypes = {
    session: PropTypes.object.isRequired,
    onCreate: PropTypes.func.isRequired
};

export default CreateTask