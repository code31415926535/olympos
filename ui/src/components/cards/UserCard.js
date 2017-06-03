import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Card, CardText, CardTitle, CardActions, IconButton} from "material-ui"

import Edit from 'material-ui/svg-icons/content/create'
import Value from "../basic/Value"
import SafeDelete from "../dialogs/SafeDelete";
import ChangeUserPermission from "../dialogs/ChangeUserPermission";

class UserCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            depth: 1
        }
    }

    _hover(on) {
        let depth = 1;
        if (on) {
            depth = 3;
        }

        this.setState((state) => {
            return Object.assign({}, state, {
                depth: depth
            })
        })
    }

    render() {
        const { user, onDelete, onEdit } = this.props;
        const { depth } = this.state;

        return (
            <Card zDepth={depth}
                  onMouseOver={() => {
                      this._hover(true)
                  }}
                  onMouseOut={() => {
                      this._hover(false)
                  }}>
                <CardText>
                    <CardTitle title={user.username} />
                    <br />
                    <Value label="Email:" value={user.email} />
                    <Value label="Permission:" value={user.permission} />
                </CardText>
                <CardActions>
                    <SafeDelete onDelete={() => {
                        onDelete(user.username)
                    }}>
                    </SafeDelete>
                    <ChangeUserPermission user={user}
                                          onEdit={onEdit}/>
                </CardActions>
            </Card>
        )
    }
}

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
};

UserCard.defaultProps = {
    maxTextLength: 100
};

export default UserCard