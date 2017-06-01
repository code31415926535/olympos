import React, { Component } from 'react'
import PropTypes from 'prop-types'
import muiThemeable from 'material-ui/styles/muiThemeable'

class Header extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { text, size, muiTheme } = this.props;

        switch (size) {
            case 'small':
                return (
                    <h4 style={{color: muiTheme.palette.textColor}}>
                        {this.props.children}
                        {text}
                    </h4>
                );
            case 'medium':
                return (
                    <h2 style={{color: muiTheme.palette.textColor}}>
                        {this.props.children}
                        {text}
                    </h2>
                );
            case 'large':
                return (
                    <h1 style={{color: muiTheme.palette.textColor}}>
                        {this.props.children}
                        {text}
                    </h1>
                )
        }

        return null
    }
}

Header.propTypes = {
    text: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']).isRequired
};

Header.defaultProps = {
    size: 'medium'
};

export default muiThemeable()(Header)