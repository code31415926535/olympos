import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Dialog, Divider, FlatButton, IconButton, SelectField} from "material-ui"
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import Edit from 'material-ui/svg-icons/content/create'

class ChangeUserPermission extends Component {
    constructor(props) {
        super(props);

        const { user: { permission } } = this.props;

        this.state = {
            selectedItem: permission,
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

    _handleSelection(val) {
        this.setState((state) => {
            return Object.assign({}, state, {
                selectedItem: val
            })
        })
    };

    render() {
        const { onEdit, user: {username, email} } = this.props;
        const { dialogOpen, selectedItem } = this.state;

        const permissions = ["regular", "student", "teacher", "admin"];

        const actions = [(
            <FlatButton label="Change"
                        primary={true}
                        onClick={() => {
                            onEdit(username, selectedItem);
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
                        tooltip="Edit">
                <Edit />
                <Dialog actions={actions}
                        title="Change User Permissions"
                        open={dialogOpen}>
                    <TextField hintText="Username"
                               floatingLabelText="Username"
                               underlineShow={false}
                               fullWidth={true}
                               disabled={true}
                               defaultValue={username}/>
                    <Divider />
                    <TextField hintText="Email"
                               floatingLabelText="Email"
                               underlineShow={false}
                               fullWidth={true}
                               disabled={true}
                               defaultValue={email}/>
                    <Divider />
                    <SelectField value={selectedItem}
                                 floatingLabelText="Permission"
                                 onChange={(e, id, val) => {
                                     this._handleSelection(val)
                                 }}>
                        {permissions.map((item, key) => {
                            return (
                                <MenuItem value={item} key={key} primaryText={item} />
                            )
                        })}
                    </SelectField>
                </Dialog>
            </IconButton>
        )
    }
}

ChangeUserPermission.propTypes = {
    user: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired
};

export default ChangeUserPermission