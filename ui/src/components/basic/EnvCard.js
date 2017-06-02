import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Card, CardHeader, CardText, CardTitle, CardActions, IconButton} from "material-ui"

import Delete from 'material-ui/svg-icons/content/clear'
import Edit from 'material-ui/svg-icons/content/create'
import Value from "./Value"
import Multiline from "./Multiline"

class EnvCard extends Component {
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
        const { env, maxTextLength } = this.props;

        const { depth, expanded } = this.state;

        let shownDescription = env.description;
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
                    <CardTitle title={env.name} />
                    <br />
                    {expanded ? (
                        <Multiline text={env.description} />
                    ) : (
                        <Multiline text={shownDescription} />
                    )}
                 </CardText>
                 <CardText expandable={true}>
                     <Value label="Image name:" value={env.image} />
                     <Value label="Output Mount:" value={env["out_mount"]} />
                     <Value label="Test Mount:" value={env["test_mount"]} />
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
                 </CardActions>
            </Card>
        )
    }
}

EnvCard.propTypes = {
    env: PropTypes.object.isRequired,
    maxTextLength: PropTypes.number
};

EnvCard.defaultProps = {
    maxTextLength: 100
};

export default EnvCard