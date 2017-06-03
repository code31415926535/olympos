import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Dialog, FlatButton, IconButton} from "material-ui"
import InfoOutline from 'material-ui/svg-icons/action/info-outline'
import Syntax from "../basic/Syntax";

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
        const { submission: { name, content } } = this.props;
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
                    <Syntax filename={name}>
                        {content}
                    </Syntax>
                </Dialog>
            </div>
        )
    }
}

SubmissionFileInfo.propTypes = {
    submission: PropTypes.object.isRequired
};

export default SubmissionFileInfo