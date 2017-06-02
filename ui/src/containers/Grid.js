import React, { Component } from 'react'

import {Container, Row, Col, ClearFix} from 'react-grid-system'

class Grid extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        let grid = [];
        for (let i = 0; i !== children.length; i ++) {
            grid.push((
                <Col xs={12} sm={12} md={6} lg={6} xl={4} style={{
                    paddingBottom: "20px",
                    paddingTop: "20px"
                }}>
                    {children[i]}
                </Col>
            ));
            const onXs = true;
            const onSm = true;
            const onMd = (i+1) % 2 === 0;
            const onLg = (i+1) % 2 === 0;
            const onXl = (i+1) % 3 === 0;
            grid.push(<ClearFix xs={onXs} sm={onSm} md={onMd} lg={onLg} xl={onXl}/>)
        }

        return (
            <Container fluid={true}>
                <Row>
                    {grid.map((item) => {
                        return item
                    })}
                </Row>
            </Container>
        )
    }
}

export default Grid