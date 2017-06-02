import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getUserList } from '../util'

import {CircularProgress} from "material-ui"
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import Grid from "../containers/Grid"
import UserCard from "./basic/UserCard"

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: null,
            error: null
        }
    }

    componentWillMount() {
        const { session } = this.props;

        getUserList(session.token, (result) => {
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

    render() {
        const { userData, error } = this.state;

        if (error !== null) {
            return (<ErrorOutline />)
        }

        if (userData === null) {
            return (<CircularProgress size={60} />)
        }

        return (
            <Grid>
                {userData.map((item, key) => {
                    return (
                        <UserCard user={item} key={key}/>
                    )
                })}
            </Grid>
        )
    }
}

UserList.propTypes = {
    session: PropTypes.object.isRequired
};

export default UserList