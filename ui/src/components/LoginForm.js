import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TextField from 'material-ui/TextField'
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right'

class LoginForm extends Component {
    constructor(props) {
        super(props)
    }

    render() {
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
                               fullWidth={true}/>
                    <Divider />
                    <TextField hintText="***"
                               floatingLabelText="Password"
                               type="password"
                               underlineShow={false}
                               fullWidth={true}/>
                    <Divider />
                    <br />
                </CardText>
                <CardActions style={{
                    padding: "35px"

                }}>
                    <RaisedButton label="Login"
                                  labelPosition="before"
                                  primary={true}
                                  icon={<ChevronRight/>}/>
                </CardActions>
            </Card>
        )
    }
}

export default LoginForm