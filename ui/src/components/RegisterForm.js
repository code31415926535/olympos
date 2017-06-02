import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { signUp } from '../util'

import TextField from 'material-ui/TextField'
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right'

class RegisterForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            email: "",

            match: true
        }
    }

    _onSignUp() {
        const { username, password, email } = this.state;

        signUp(username, password, email, () => {
            console.log("OK")
        }, () => {
            console.log("FAIL")
        })
    }

    _onUsernameType(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                username: value
            })
        })
    }

    _onPasswordType(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                password: value
            })
        })
    }

    _onConfirmType(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                confirmPassword: value,
                match: (state.confirmPassword !== "" && state.password !== "" && state.password === value)
            })
        })
    }

    _onEmailType(value) {
        this.setState((state) => {
            return Object.assign({}, state, {
                email: value
            })
        })
    }

    render() {
        const { match } = this.state;

        const errorMsg = match ? "" : "Password must match";
        console.log(this.state);

        return (
            <Card zDepth={2}>
                <CardTitle style={{textAlign: "center"}}>
                    <h2> Register to Olympos </h2>
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
                                   this._onPasswordType(v)
                               }}/>
                    <Divider />
                    <TextField hintText="***"
                               floatingLabelText="Confirm Password"
                               type="password"
                               errorText={errorMsg}
                               underlineShow={false}
                               fullWidth={true}
                               onChange={(_, v) => {
                                   this._onConfirmType(v)
                               }}/>
                    <Divider />
                    <TextField hintText="me@example.com"
                               floatingLabelText="Email Address"
                               underlineShow={false}
                               fullWidth={true}
                               onChange={(_, v) => {
                                   this._onEmailType(v)
                               }}/>
                    <Divider />
                    <br />
                </CardText>
                <CardActions style={{
                    padding: "35px"

                }}>
                    <RaisedButton label="Register"
                                  labelPosition="before"
                                  primary={true}
                                  disabled={!match}
                                  icon={<ChevronRight/>}
                                  onTouchTap={() => {
                                      this._onSignUp()
                                  }}/>
                </CardActions>
            </Card>
        )
    }
}

export default RegisterForm