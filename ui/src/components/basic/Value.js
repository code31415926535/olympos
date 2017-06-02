import React, { Component } from 'react'
import PropTypes from 'prop-types'
import muiThemeable from 'material-ui/styles/muiThemeable'

class Value extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { label, value, muiTheme } = this.props;

        return (
            <p style={{
                padding: "10px"
            }}>
                <span style={{
                    color: muiTheme.palette.textColor,
                    marginRight: "35px"
                }}>
                    {label}
                </span>
                <span style={{
                    color: muiTheme.palette.secondaryTextColor
                }}>
                    {value}
                </span>
            </p>
        )
    }
}

Value.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};

Value.defaultProps = {
    color: 'default'
};

export default muiThemeable()(Value)