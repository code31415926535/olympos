import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Add from 'material-ui/svg-icons/content/add'
import {Paper} from "material-ui";

class CardNew extends Component {
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
        const { onClick } = this.props;
        const { depth } = this.state;

        return (
            <div style={{
                textAlign: "center"
            }}>
                <Paper zDepth={depth}
                       circle={true}
                       style={{
                           width: 128,
                           height: 128,
                           margin: 'auto'
                       }}
                       onMouseOver={() => {
                           this._hover(true)
                       }}
                       onMouseOut={() => {
                           this._hover(false)
                       }}>
                    <Add style={{
                        width: 64,
                        height: 64,
                        paddingTop: 32
                    }} />
                </Paper>
            </div>
        )
    }
}

CardNew.propTypes = {
    onClick: PropTypes.func
};

export default CardNew