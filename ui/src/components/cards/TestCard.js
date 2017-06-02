import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Card, CardHeader, CardText, CardTitle, CardActions, IconButton} from "material-ui"

import Delete from 'material-ui/svg-icons/content/clear'
import Edit from 'material-ui/svg-icons/content/create'
import More from 'material-ui/svg-icons/navigation/more-horiz'

import Value from "../basic/Value"
import Multiline from "../basic/Multiline"

class TestCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expended: false,
            depth: 1
        }
    }

    _hover(on) {
        let depth = 1;
        if (on) {
            depth = 3;
        }

        this.setState((state) => {
            return Object.assign({}, state, {
                depth: depth
            })
        })
    }

    render() {
        const { test, maxTextLength } = this.props;

        const { depth, expanded } = this.state;

        let shownDescription = test.description;
        if (shownDescription.length > maxTextLength) {
            shownDescription = shownDescription.substring(0, 97).concat('...')
        }

        return (
            <Card zDepth={depth}
                  expandable={true}
                  expanded={expanded}
                  onMouseOver={() => {
                      this._hover(true)
                  }}
                  onMouseOut={() => {
                      this._hover(false)
                  }}
                  onExpandChange={(expanded) => {
                      this.setState({
                          expanded: expanded
                      });
                  }}>
                <CardHeader actAsExpander={true}
                            showExpandableButton={true}>
                </CardHeader>
                <CardText>
                    <CardTitle title={test.name} />
                    <br />
                    {expanded ? (
                        <Multiline text={test.description} />
                    ) : (
                        <Multiline text={shownDescription} />
                    )}
                </CardText>
                <CardText expandable={true}>
                    <Value label="Running environment: " value={test.env.name} />
                </CardText>
                <CardActions>
                    <IconButton disabled={true}
                                tooltip="Delete">
                        <Delete />
                    </IconButton>
                    <IconButton disabled={true}
                                tooltip="Edit">
                        <Edit />
                    </IconButton>
                    <IconButton disabled={true}
                                tooltip="More">
                        <More />
                    </IconButton>
                </CardActions>
            </Card>
        )
    }
}

TestCard.propTypes = {
    test: PropTypes.object.isRequired,
    maxTextLength: PropTypes.number
};

TestCard.defaultProps = {
    maxTextLength: 100
};

export default TestCard