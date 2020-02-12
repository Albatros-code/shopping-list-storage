import React, { Fragment } from 'react';
import PageLayout from '../components/pageLayout';

// MUI studd
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

// Icons
import SaveIcon from '@material-ui/icons/Save';

// Components
import ButtonBottom from '../components/ButtonBottom';

// Firebase

const layout = () => {

    const tableContent = () => {
        const rowsArray = [];
        for (let i = 1; i < 40; i++) {
            rowsArray.push(
            <TableRow key={i} hover>
                <TableCell>Item {i}</TableCell>
                <TableCell>Property {i}</TableCell>
                <TableCell>Value {i}</TableCell>
            </TableRow>
            )
        }
        return rowsArray
    }

    const handleClickSave = () => {
        console.log("Save icon clicked!")
    }
    const header =
        <Fragment>
            <TableCell>Head</TableCell>
            <TableCell>Head 2</TableCell>
        </Fragment>

    const footer = 
        <Fragment>
            <ButtonBottom
                onClick={() => handleClickSave()}
                label={"save list"}
                icon={SaveIcon}
            />
        </Fragment>
    
        return(
            <PageLayout
                title={"Layout Page"}
                tableContent={tableContent()}
                //content={content}
                tableHeader={header}
                tableHeaders={['Header 1', 'Header 2', 'Header 3']}
                footer={footer}
                tableSizing={['40%', '30%', '30%']}
                //content={<h1 align="right">Simple content</h1>}
            />
    )
}

export default layout