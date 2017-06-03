import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getEnvByName } from '../../util'

import {Dialog, Divider, FlatButton, IconButton} from "material-ui"
import TextField from 'material-ui/TextField'
import Create from 'material-ui/svg-icons/content/add'

class CreateTest extends  Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            test: {
                name: "",
                env: "",
                description: ""
            },

            envValid: true,
            envObject: null
        }
    }

    _checkEnv() {
        const { test: {env} } = this.state;
        const { session: {token} } = this.props;

        getEnvByName(token, env, (result) => {
            this.setState((state) => {
                return Object.assign({}, state, {
                    envObject: result,
                    envValid: true
                })
            })
        }, () => {
            this.setState((state) => {
                return Object.assign({}, state, {
                    envObject: null,
                    envValid: false
                })
            })
        })
    }

    _resetEnv() {
        this.setState((state) => {
            return Object.assign({}, state, {
                envObject: null,
                envValid: true
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
                test: Object.assign({}, state.test, {
                    name: value
                })
            })
        })
    }

    _onDescription(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                test: Object.assign({}, state.test, {
                    description: value
                })
            })
        })
    }

    _onEnvironment(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                test: Object.assign({}, state.test, {
                    env: value
                })
            })
        })
    }

    render() {
        const { onCreate } = this.props;
        const { dialogOpen, test, envObject, envValid } = this.state;

        console.log(test);

        const actions = [(
            <FlatButton label="Create"
                        primary={true}
                        onTouchTap={() => {
                            onCreate(Object.assign({}, test, {
                                env: envObject
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
        if (envValid === false) {
            errorMsg = "Env not found."
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
                        title="Create Test"
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
                        hintText="Environment"
                        floatingLabelText="Environment"
                        underlineShow={false}
                        fullWidth={true}
                        errorText={errorMsg}
                        onFocus={() => {
                            this._resetEnv()
                        }}
                        onBlur={() => {
                            this._checkEnv()
                        }}
                        onChange={(_, v) => {
                            this._onEnvironment(v)
                        }}/>
                    <Divider />
                </Dialog>
            </div>
        )
    }
}

CreateTest.propTypes = {
    session: PropTypes.object.isRequired,
    onCreate: PropTypes.func.isRequired
};

export default CreateTest