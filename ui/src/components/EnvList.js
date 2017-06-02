import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getEnvList } from '../util'

import {CircularProgress} from "material-ui"
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import EnvCard from "./basic/EnvCard"
import Grid from '../containers/Grid'
import CardNew from "./basic/CardNew"

class EnvList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            envData: null,
            error: null
        }
    }

    componentWillMount() {
        const { session } = this.props;

        getEnvList(session.token, (result) => {
            this.setState(() => {
                result.push(null);
                return {
                    envData: result,
                    error: null
                }
            })
        }, () => {
            this.setState(() => {
                return {
                    envData: null,
                    error: true
                }
            })
        })
    }

    render() {
        const { envData, error } = this.state;

        if (error !== null) {
            return (<ErrorOutline />)
        }

        if (envData === null) {
            return (<CircularProgress size={60} />)
        }

        return (
            <Grid>
                {envData.map((item, key) => {
                    if (item === null) {
                        return (
                            <CardNew/>
                        )
                    }

                    return (
                        <EnvCard env={item} key={key}/>
                    )
                })}
            </Grid>
        )
    }
}

EnvList.propTypes = {
    session: PropTypes.object.isRequired
};

export default EnvList