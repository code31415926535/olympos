import React, { Component } from 'react'

import { Card, CardTitle, Divider } from "material-ui";
import Build from 'material-ui/svg-icons/action/build'
import Header from './basic/Header'
import Paragraph from './basic/Paragraph'


class NotFoundCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card zDepth={2}
                   style={{
                       padding: "35px"
                   }}>
                <CardTitle>
                    <Header text="404 Not Found">
                        <Build style={{
                            paddingRight: "20px"
                        }} />
                    </Header>
                </CardTitle>
                <Divider />
                <Paragraph text=" We tried really hard, but we couldn't find this page anywhere." />
                <Paragraph text="We suggest you go back. There is nothing to see here."/>
            </Card>
        )
    }
}

export default NotFoundCard