import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Delete from 'material-ui/svg-icons/content/clear'
import {Dialog, FlatButton, IconButton} from "material-ui"
import Paragraph from "../basic/Paragraph";

class SafeDelete extends Component {
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
        const { onDelete } = this.props;
        const { dialogOpen } = this.state;

        const actions = [(
            <FlatButton label="Yes"
                        primary={true}
                        onClick={() => {
                            onDelete()
                            this._toggleDialog()
                        }} />
        ),(
            <FlatButton label="Cancel"
                        onClick={() => {
                            this._toggleDialog()
                        }}/>
        )];

        return (
            <IconButton onClick={() => {
                this._toggleDialog()
            }}
                        tooltip="Delete">
                <Delete />
                <Dialog actions={actions}
                        title="Confirm Delete"
                        open={dialogOpen}>
                    <Paragraph text="Are you sure you want to delete this? You cannot undo this operation." color="error"/>
                </Dialog>
            </IconButton>
        )
    }
}

SafeDelete.propTypes = {
    onDelete: PropTypes.func.isRequired
};

export default SafeDelete