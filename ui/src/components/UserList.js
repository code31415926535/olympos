import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getUserList, deleteUser, changeUserPermission } from '../util'

import {CircularProgress} from "material-ui"
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import Grid from "../containers/Grid"
import UserCard from "./cards/UserCard"
import Paragraph from "./basic/Paragraph"

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            globalError: null,
            userData: null,
            error: null
        }
    }

    _fetch(token) {
        getUserList(token, (result) => {
            this.setState(() => {
                return {
                    userData: result,
                    error: null
                }
            })
        }, () => {
            this.setState(() => {
                return {
                    userData: null,
                    error: true
                }
            })
        })
    }

    _delete() {
        return (name) => {
            const {session: {token} } = this.props;

            console.log(name);

            deleteUser(token, name, () => {
                this._fetch(token)
            }, () => {
                this.setState((state) => {
                    return Object.assign({}, state, {
                        globalError: "Failed to delete user!"
                    })
                })
            })
        }
    }

    _changePerm() {
        return (username, newPerm) => {
            const {session: {token}} = this.props;

            changeUserPermission(token, username, newPerm, () => {
                this._fetch(token)
            }, () => {
                this.setState((state) => {
                    return Object.assign({}, state, {
                        globalError: "Failed to change user permissions!"
                    })
                })
            })
        }
    }

    componentWillMount() {
        const { session: {token} } = this.props;

        this._fetch(token)
    }

    render() {
        const { userData, error, globalError } = this.state;

        if (error !== null) {
            return (<ErrorOutline />)
        }

        if (userData === null) {
            return (<CircularProgress size={60} />)
        }

        return (
            <div>
                {globalError &&
                    <Paragraph text={globalError} color="error"/>
                }
                <Grid>
                    {userData.map((item, key) => {
                        return (
                            <UserCard user={item} key={key} onDelete={this._delete()} onEdit={this._changePerm()} />
                        )
                    })}
                </Grid>
            </div>
        )
    }
}

UserList.propTypes = {
    session: PropTypes.object.isRequired
};

export default UserList