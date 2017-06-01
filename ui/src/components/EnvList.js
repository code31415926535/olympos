import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {GridList} from "material-ui";

class EnvList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { envData } = this.props;

        return (
            <GridList cols={3}
                      colHeight={400}
                      padding={10}>

            </GridList>
        )
    }
}