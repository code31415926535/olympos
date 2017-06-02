import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Card, CardText, CardTitle, CardActions, IconButton} from "material-ui"

import Delete from 'material-ui/svg-icons/content/clear'
import Edit from 'material-ui/svg-icons/content/create'
import Value from "./Value"

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
        const { user } = this.props;
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
                    <IconButton disabled={true}
                                tooltip="Delete">
                        <Delete />
                    </IconButton>
                    <IconButton disabled={true}
                                tooltip="Change Permission">
                        <Edit />
                    </IconButton>
                </CardActions>
            </Card>
        )
    }
}

UserCard.propTypes = {
    user: PropTypes.object.isRequired
};

UserCard.defaultProps = {
    maxTextLength: 100
};

export default UserCard