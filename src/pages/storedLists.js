import React, { Fragment } from 'react'

// MUI stuff
import Button from '@material-ui/core/Button';


import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

// Redux
import { connect } from 'react-redux';

// Components
import PageLayout from '../components/pageLayout';

function StoredLists(props){

    const { storedLists, history } = props

    const storedListsRows = (() => {
        let array = []
        for (const list in storedLists) {
        array.push(
        <TableRow key={list} hover onClick={() => {props.history.push(`/stored-lists/${list}`)}}>
            <TableCell>
                {storedLists[list].listName}
            </TableCell>
            <TableCell>
                {new Date(storedLists[list].createdAt).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </TableCell>
        </TableRow>
        )}
        
        if (array.length === 0) {
            array = [
                <TableRow key={"text"}>
                    <TableCell colSpan={2} align="center">
                        {
                        <Fragment>
                            <span>There is no stored list. Create your fist list:</span>
                            <Button style={{ marginTop: "10px" }}  variant="contained" color="primary" onClick={() => history.push("/new-list")}>
                                Create new list
                            </Button>
                        </Fragment>
                        }
                    </TableCell>
                </TableRow>
            ]
        }
        return array
    })()

    return (
        <PageLayout
            title={"Stored lists"}
            tableSizing={['70%', '30%']}
            tableHeaders={['List name', 'Created at']}
            tableContent={storedListsRows}
        />
    )
}

const mapStateToProps = (state) => ({
    storedLists: state.data.storedLists,
    loading: state.UI.loading
})

const mapActionToProps = {
}

export default connect(mapStateToProps, mapActionToProps)(StoredLists);
