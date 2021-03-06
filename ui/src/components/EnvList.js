import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getEnvList, deleteEnv, createEnv } from '../util'

import {CircularProgress} from "material-ui"
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import EnvCard from "./cards/EnvCard"
import Grid from '../containers/Grid'
import Paragraph from "./basic/Paragraph"
import CreateEnv from "./dialogs/CreateEnv"
import Header from "./basic/Header";

class EnvList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            globalError: null,
            envData: null,
            error: null
        }
    }

    _fetch(token) {
        getEnvList(token, (result) => {
            this.setState((state) => {
                return Object.assign({}, state, {
                    envData: result,
                    error: null
                })
            })
        }, () => {
            this.setState((state) => {
                return Object.assign({}, state, {
                    envData: null,
                    error: true
                })
            })
        })
    }

    componentWillMount() {
        const { session: {token} } = this.props;

        this._fetch(token)
    }

    _delete() {
        return (name) => {
            const {session: {token}} = this.props;

            deleteEnv(token, name, () => {
                this._fetch(token)
            }, () => {
                this.setState((state) => {
                    return Object.assign({}, state, {
                        globalError: "Failed to delete env"
                    })
                })
            })
        }
    }

    _create() {
        return (env) => {
            const { session: {token} } = this.props;

            createEnv(token, env, () => {
                this._fetch(token)
            }, () => {
                this.setState((state) => {
                    return Object.assign({}, state, {
                        globalError: "Failed to create env"
                    })
                })
            })
        }
    }

    render() {
        const { envData, error, globalError } = this.state;

        if (error !== null) {
            return (<ErrorOutline />)
        }

        if (envData === null) {
            return (<CircularProgress size={60} />)
        }

        return (
            <div>
                {globalError &&
                    <Paragraph text={globalError} color="error"/>
                }
                <Header text="Environments">
                    <CreateEnv onCreate={this._create()} />
                </Header>
                <Paragraph text="Environments are an isolated medium where tests run." />
                <br />
                <Grid>
                    {envData.map((item, key) => {
                        return (
                            <EnvCard env={item} key={key} onDelete={this._delete()} />
                        )
                    })}
                </Grid>
            </div>
        )
    }
}

EnvList.propTypes = {
    session: PropTypes.object.isRequired
};

export default EnvList