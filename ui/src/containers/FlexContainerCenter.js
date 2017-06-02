import React, { Component } from 'react'

import { Container, Row, Col } from 'react-grid-system'

class FlexContainerCenter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <Container fluid={true}>
                <Row>
                    <Col xs={0} sm={0} md={1} lg={2} xl={2} />
                    <Col xs={12} sm={12} md={10} lg={8} xl={8}>
                        {children}
                    </Col>
                    <Col xs={0} sm={0} md={1} lg={2} xl={2} />
                </Row>
            </Container>
        )
    }
}

export default FlexContainerCenter