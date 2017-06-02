import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import NavBar from "../components/NavBar"
import FlexContainerCenter from "../containers/FlexContainerCenter"
import Header from "../components/basic/Header"
import Paragraph from "../components/basic/Paragraph"
import TaskSubmitList from "../components/TaskSubmitList"

class Tasks extends Component {
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
                <NavBar screen='tasks'/>
                <br />
                <br />
                <FlexContainerCenter>
                    <div style={{
                        margin: "10px",
                        padding: "35px"
                    }}>
                        <Header text="Tasks"/>
                        <Paragraph text="Here is a list of available tasks. Choose one and start coding!" />
                        <br />
                        <TaskSubmitList session={session}
                                        toScreen={toScreen}/>
                    </div>
                </FlexContainerCenter>
            </div>
        )
    }
}

Tasks.propTypes = {
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

const ReduxTask = connect(
    mapStateToProps,
    mapDispatchToProps
)(Tasks);

export default ReduxTask