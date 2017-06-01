import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AppBar from 'material-ui/AppBar'

class NavBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { session, theme, screen } = this.props;

        return (
            <AppBar title="Olympos" />
        )
    }
}

NavBar.propTypes = {
    session: PropTypes.object.isRequired,
    theme: PropTypes.string.isRequired,
    screen: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
  return {
      session: state.session,
      theme: state.theme
  }
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

const ReduxNavBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar);

export default ReduxNavBar