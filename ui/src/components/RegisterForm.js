import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TextField from 'material-ui/TextField'
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right'

class RegisterForm extends Component {
    constructor(props) {
        super(props)
    }

    render() {
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
                               fullWidth={true}/>
                    <Divider />
                    <TextField hintText="***"
                               floatingLabelText="Password"
                               type="password"
                               underlineShow={false}
                               fullWidth={true}/>
                    <Divider />
                    <TextField hintText="***"
                               floatingLabelText="Confirm Password"
                               type="password"
                               underlineShow={false}
                               fullWidth={true}/>
                    <Divider />
                    <TextField hintText="me@example.com"
                               floatingLabelText="Email Address"
                               underlineShow={false}
                               fullWidth={true}/>
                    <Divider />
                    <br />
                </CardText>
                <CardActions style={{
                    padding: "35px"

                }}>
                    <RaisedButton label="Register"
                                  labelPosition="before"
                                  primary={true}
                                  icon={<ChevronRight/>}/>
                </CardActions>
            </Card>
        )
    }
}

export default RegisterForm