import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getTestFiles } from '../../util'

import {Card, CardHeader, CardText, CardTitle, CardActions} from "material-ui"

import Value from "../basic/Value"
import Multiline from "../basic/Multiline"
import SafeDelete from "../dialogs/SafeDelete";
import FileInfo from "../dialogs/FileInfo";
import SubmitFile from "../dialogs/SubmitFile";

class TestCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expended: false,
            depth: 1,

            files: []
        }
    }

    componentWillMount() {
        const { session: {token}, test: {name} } = this.props;

        getTestFiles(token, name, (result) => {
            this.setState((state) => {
                return Object.assign({}, state, {
                    files: result,
                })
            })
        }, () => {
            console.log("FAILED TO GET FILES!")
        })
    };

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
        const { files } = this.state;
        const { test, maxTextLength, onDelete, onAddFile } = this.props;

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
                    {files.map((file, key) => {
                        return (
                            <Value key={key} label={file.name} value={<FileInfo  customStyle={{float: "right"}} file={file} />} />
                        )
                    })}
                </CardText>
                <CardActions>
                    <SafeDelete onDelete={() => {
                        onDelete(test.name)
                    }}/>
                    <SubmitFile onSubmit={(file) => {
                        onAddFile(test.name, file)
                    }}/>
                </CardActions>
            </Card>
        )
    }
}

TestCard.propTypes = {
    test: PropTypes.object.isRequired,
    maxTextLength: PropTypes.number,
    onDelete: PropTypes.func.isRequired,
    onAddFile: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired
};

TestCard.defaultProps = {
    maxTextLength: 100
};

export default TestCard