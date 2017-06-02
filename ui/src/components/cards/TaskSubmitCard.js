import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Card, CardHeader, CardText, CardTitle, CardActions, IconButton} from "material-ui"

import More from 'material-ui/svg-icons/navigation/more-horiz'

import Multiline from "../basic/Multiline"

class TaskSubmitCard extends Component {
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
        const { task, maxTextLength, onMoreClick } = this.props;

        const { depth, expanded } = this.state;

        let shownDescription = task.description;
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
                    <CardTitle title={task.name} />
                    <br />
                    {expanded ? (
                        <Multiline text={task.description} />
                    ) : (
                        <Multiline text={shownDescription} />
                    )}
                </CardText>
                <CardActions>
                    <IconButton onClick={() => {
                                    onMoreClick()
                                }}>
                        <More />
                    </IconButton>
                </CardActions>
            </Card>
        )
    }
}

TaskSubmitCard.propTypes = {
    task: PropTypes.object.isRequired,
    maxTextLength: PropTypes.number,
    onMoreClick: PropTypes.func.isRequired
};

TaskSubmitCard.defaultProps = {
    maxTextLength: 100
};

export default TaskSubmitCard