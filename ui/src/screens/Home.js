import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import NavBar from "../components/NavBar"
import FlexContainerCenter from "../containers/FlexContainerCenter"
import WellcomeMessage from "../components/WellcomeMessage"

class Home extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { session, toScreen } = this.props;

        if (session.token === null) {
            toScreen('/login');
            return null
        }

        return (
            <div>
                <NavBar screen='home' />
                <br />
                <br />
                <FlexContainerCenter>
                    <WellcomeMessage />
                </FlexContainerCenter>
            </div>
        )
    }
}

Home.propTypes = {
    session: PropTypes.object.isRequired,
    toScreen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        session: state.session
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        toScreen: (name) => {
            dispatch(push(name))
        }
    }
};

const ReduxHome = connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

export default ReduxHome