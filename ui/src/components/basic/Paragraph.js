import React, { Component } from 'react'
import PropTypes from 'prop-types'
import muiThemeable from 'material-ui/styles/muiThemeable'

class Paragraph extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { text, color, muiTheme } = this.props;

        let colorValue = null;
        switch (color) {
            case 'primary':
                colorValue = muiTheme.palette.primary1Color;
                break;
            case 'secondary':
                colorValue = muiTheme.palette.secondaryTextColor;
                break;
            case 'accent':
                colorValue = muiTheme.palette.accent1Color;
                break;
            default:
                colorValue = muiTheme.palette.textColor;
        }

        return (
            <p style={{color: colorValue}}>
                {text}
            </p>
        )
    }
}

Paragraph.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent']).isRequired
};

Paragraph.defaultProps = {
    color: 'default'
};

export default muiThemeable()(Paragraph)