import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Dialog, Divider, FlatButton, IconButton} from "material-ui"
import TextField from 'material-ui/TextField'
import Create from 'material-ui/svg-icons/content/create'

class CreateEnv extends  Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            env: {
                name: "",
                image: "",
                description: "",
                out_mount: "",
                test_mount: ""
            }
        }
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
                env: Object.assign({}, state.env, {
                    name: value
                })
            })
        })
    }

    _onImage(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                env: Object.assign({}, state.env, {
                    image: value
                })
            })
        })
    }

    _onDescription(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                env: Object.assign({}, state.env, {
                    description: value
                })
            })
        })
    }

    _onOutMount(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                env: Object.assign({}, state.env, {
                    out_mount: value
                })
            })
        })
    }

    _onTestMount(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                env: Object.assign({}, state.env, {
                    test_mount: value
                })
            })
        })
    }

    render() {
        const { dialogOpen } = this.state;

        console.log(this.state);

        const actions = [(
            <FlatButton label="Create"
                        primary={true}
                        onTouchTap={() => {
                            console.log("ON TOUCH TAP")
                        }} />
        ), (
            <FlatButton label="Cancel"
                        onTouchTap={() => {
                            this._toggleDialog()
                        }} />
        )];

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
                        title="Create Environment"
                        open={dialogOpen}>
                    <TextField hintText="Name"
                               floatingLabelText="Name"
                               underlineShow={false}
                               fullWidth={true}
                               onChange={(_, v) => {
                                   this._onName(v)
                               }}/>
                    <Divider />
                    <TextField hintText="Image"
                               floatingLabelText="Image"
                               underlineShow={false}
                               fullWidth={true}
                               onChange={(_, v) => {
                                   this._onImage(v)
                               }}/>
                    <Divider />
                    <TextField
                               hintText="Description"
                               floatingLabelText="Description"
                               underlineShow={false}
                               fullWidth={true}
                               multiline={true}
                               rows={5}
                               onChange={(_, v) => {
                                   this._onDescription(v)
                               }}/>
                    <Divider />
                    <TextField hintText="Out Mount"
                               floatingLabelText="Out Mount"
                               underlineShow={false}
                               fullWidth={true}
                               onChange={(_, v) => {
                                   this._onOutMount(v)
                               }}/>
                    <Divider />
                    <TextField hintText="Test Mount"
                               floatingLabelText="Test Mount"
                               underlineShow={false}
                               fullWidth={true}
                               onChange={(_, v) => {
                                   this._onTestMount(v)
                               }}/>
                    <Divider />
                </Dialog>
            </div>
        )
    }
}

CreateEnv.propTypes = {
    toScreen: PropTypes.func.isRequired
};

export default CreateEnv