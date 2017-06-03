import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { enableUniqueIds } from 'react-html-id'

import {Dialog, FlatButton, IconButton} from "material-ui"
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import Syntax from "../basic/Syntax"

class SubmitFile extends  Component {
    constructor(props) {
        super(props);

        enableUniqueIds(this);

        this.state = {
            fileSelected: false,
            file: {
                name: "",
                content: ""
            },
            dialogOpen: false
        }
    }

    _onFileSelect(file) {

        const name = file.name;

        const fr = new FileReader();
        fr.onload = () => {
            const content = fr.result;
            this.setState((state) => {
                return Object.assign({}, state, {
                    file: {
                        name,
                        content
                    },
                    fileSelected: true
                })
            })
        };
        fr.readAsText(file, 'UTF-8');

    };

    _toggleDialog() {
        this.setState((state) => {
            return Object.assign({}, state, {
                dialogOpen: !state.dialogOpen,
                fileSelected: false
            })
        })
    };

    render() {
        const { dialogOpen, fileSelected, file: {name, content} } = this.state;
        const uploadId = this.nextUniqueId();

        const actions = [(
            <FlatButton primary={true}
                        label="Choose">
                <input type="file"
                       name="File"
                       onChange={() => {
                           this._onFileSelect(document.getElementById(uploadId).files[0])
                       }}
                       id={uploadId} style={{
                    position: "absolute",
                    zIndex: 2,
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    cursor: "pointer"
                }}/>
            </FlatButton>
        ), (
            <FlatButton label="Close"
                        onTouchTap={() => {
                            this._toggleDialog()
                        }} />
        )];

        const actionsSecond = [(
            <FlatButton label="Upload"
                        primary={true} />
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
                    <FileUpload />
                </IconButton>
                <Dialog actions={actions}
                        title="Choose File"
                        open={dialogOpen}>
                    <div>

                    </div>
                </Dialog>
                <Dialog actions={actionsSecond}
                        open={fileSelected}
                        title={name}>
                    <Syntax filename={name}>
                        {content}
                    </Syntax>
                </Dialog>

            </div>
        )
    }
}

SubmitFile.propTypes = {};

export default SubmitFile