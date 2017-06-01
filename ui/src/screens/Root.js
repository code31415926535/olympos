import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

class Root extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { session, toScreen } = this.props;

        if (session.token === null) {
            toScreen('/login');
        } else {
            console.log(session);
            toScreen('/home');
        }
    }

    render() {
        return null
    }
}

Root.propTypes = {
    session: PropTypes.object.isRequired,
    toScreen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
      session: state.session,
  }
};

const mapDispatchToProps = (dispatch) => {
    return {
        toScreen: (name) => {
            dispatch(push(name))
        }
    }
};

const ReduxRoot = connect(
    mapStateToProps,
    mapDispatchToProps
)(Root);

export default ReduxRoot