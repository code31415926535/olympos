import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {CircularProgress, Dialog, FlatButton, IconButton} from "material-ui"
import { IconOk, IconFail, IconUnknown } from '../icons'
import Paragraph from "../basic/Paragraph"
import {TableBody, Table, TableRow, TableRowColumn} from "material-ui/Table/index"

class SubmissionResultInfo extends  Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false
        }
    }

    _toggleDialog() {
        this.setState((state) => {
            return Object.assign({}, state, {
                dialogOpen: !state.dialogOpen
            })
        })
    };

    render() {
        const { resultModel } = this.props;
        const { dialogOpen } = this.state;

        console.log(resultModel);

        if (resultModel === null || resultModel === undefined) {
            return (<CircularProgress size={40} />)
        }

        const { result: {status_code, message}, total, passed, cases } = resultModel;

        const resultIcon = (status_code === 0 && total === passed) ? (
            <IconOk />
        ) : (
            <IconFail />
        );

        const closeButton = (
            <FlatButton label="Close"
                        onTouchTap={() => {
                            this._toggleDialog()
                        }} />
        );

        return (
            <div>
                <IconButton onTouchTap={() => {
                    this._toggleDialog()
                }}>
                    {resultIcon}
                </IconButton>
                <Dialog actions={closeButton}
                        title="Results"
                        open={dialogOpen}>
                    { status_code !== 0 ? (
                            <div>
                                <Paragraph text={message} color="error" />
                            </div>
                        ) : (
                            <div>
                                <Paragraph text="Test ran successfully" color="primary"/>
                            </div>
                        )
                    }
                    <Table>
                        <TableBody displayRowCheckbox={false}
                                   showRowHover={true}>
                        {cases.map((item, key) => {
                            return (
                                <TableRow key={key}>
                                    <TableRowColumn>
                                        <Paragraph text={item.name} color="primary"/>
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {item.status === 'passed' &&
                                            <IconOk/>
                                        }
                                        {item.status === 'failed' &&
                                            <IconFail/>
                                        }
                                        {item.status === 'skipped' &&
                                            <IconUnknown/>
                                        }
                                    </TableRowColumn>
                                </TableRow>
                            )
                        })}
                        </TableBody>
                    </Table>
                </Dialog>
            </div>
        )
    }
}

SubmissionResultInfo.propTypes = {
    resultModel: PropTypes.object.isRequired
};

export default SubmissionResultInfo