import React, { Component } from 'react'

import { Container, Row, Col } from 'react-grid-system'

class FlexContainerCenter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <Container>
                <Row>
                    <Col xs={0} sm={0} md={1} lg={1} xl={1} />
                    <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                        {children}
                    </Col>
                    <Col xs={0} sm={0} md={1} lg={1} xl={1} />
                </Row>
            </Container>
        )
    }
}

export default FlexContainerCenter