import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { submitLogin } from '../actions'

import TextField from 'material-ui/TextField'
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right'
import Paragraph from "./basic/Paragraph";

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }
    }

    _onUsernameType(value) {
        this.setState((state) => {
            return {
                username: value,
                password: state.password
            }
        })
    }

    _OnPasswordType(value) {
        this.setState((state) => {
            return {
                username: state.username,
                password: value
            }
        })
    }

    render() {
        const { session, onLogin } = this.props;

        const errorMsg = session.error === null ? null : (
          <Paragraph text={session.error} color='error'/>
        );

        return (
            <Card zDepth={2}>
                <CardTitle style={{textAlign: "center"}}>
                    <h2> Login to Olympos </h2>
                </CardTitle>
                <CardText style={{
                    padding: "35px",
                    textAlign: "center"
                }}>
                    <TextField hintText="Username"
                               floatingLabelText="Username"
                               underlineShow={false}
                               fullWidth={true}
                               onChange={(_, v) => {
                                   this._onUsernameType(v)
                               }}/>
                    <Divider />
                    <TextField hintText="***"
                               floatingLabelText="Password"
                               type="password"
                               underlineShow={false}
                               fullWidth={true}
                               onChange={(_, v) => {
                                   this._OnPasswordType(v)
                               }}/>
                    <Divider />
                    <br />
                </CardText>
                <CardActions style={{
                    padding: "35px"

                }}>
                    {errorMsg}
                    <RaisedButton label="Login"
                                  labelPosition="before"
                                  primary={true}
                                  icon={<ChevronRight/>}
                                  onClick={() => {
                                      onLogin(this.state.username, this.state.password)
                                  }}/>
                </CardActions>
            </Card>
        )
    }
}

LoginForm.propTypes = {
    session: PropTypes.object.isRequired,
    onLogin: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        session: state.session
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (username, password) => {
            dispatch(submitLogin(username, password))
        }
    }
};

const ReduxLoginForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);

export default ReduxLoginForm