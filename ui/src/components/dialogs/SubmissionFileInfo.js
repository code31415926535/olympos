import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Dialog, FlatButton, IconButton} from "material-ui"
import InfoOutline from 'material-ui/svg-icons/action/info-outline'
import Multiline from "../basic/Multiline"

class SubmissionFileInfo extends  Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false
        }
    }

    _toggleDialog() {
        this.setState((state) => {
            return Object.assign({}, state, {
                dialogOpen: !state.dialogOpen
            })
        })
    };

    render() {
        const { submissionFile } = this.props;
        const { dialogOpen } = this.state;

        const closeButton = (
          <FlatButton label="Close"
                      onTouchTap={() => {
                          this._toggleDialog()
                      }} />
        );

        return (
            <div>
                <IconButton onTouchTap={() => {
                                this._toggleDialog()
                            }}>
                    <InfoOutline />
                </IconButton>
                <Dialog actions={closeButton}
                        title="Submission File"
                        open={dialogOpen}>
                    <Multiline text={submissionFile} />
                </Dialog>
            </div>
        )
    }
}

SubmissionFileInfo.propTypes = {
    submissionFile: PropTypes.string.isRequired
};

export default SubmissionFileInfo