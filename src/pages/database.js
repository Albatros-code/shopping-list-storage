import React, {useState} from 'react';
import PageLayout from '../components/pageLayout';

// Firebase
import {firebaseProductsDownload, firebaseProductsExport, firebaseProductsExportNew} from '../backend/api';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


function Database(){
    const style = {
        textBox: {
            height: '300px',
            overflow: 'auto',
            fontSize: '10px',
            margin: '5px 20px',
            padding: '3px',
            border: '1px solid grey',
            borderRadius: '5px'

        },
        button: {
            margin: '8px'
        }
    }

    const [textField, setTextField] = useState('');

    const getProducts = () => (
        firebaseProductsDownload().then(data => {
            setTextField(JSON.stringify(data))
        })
    )

    const setProducts = () => {
        const productsArray = JSON.parse(textField);
        firebaseProductsExport(productsArray);
    }

    const addNewProducts = () => {
        const productsArray = JSON.parse(textField);
        firebaseProductsExportNew(productsArray);
    }

    const content =
    <Grid container direction="column" alignItems="center">
        <textarea style={style.textBox} rows="4" cols="50" onChange={(e) => setTextField(e.target.value)} value={textField}/>
        <Button style={style.button} variant="contained" color="primary" onClick={() => getProducts()}>
            Get products from firebase
        </Button>
        <Button style={style.button} variant="contained" color="primary" onClick={() => setProducts()}>
            Update Database
        </Button>
        <Button style={style.button} variant="contained" color="primary" onClick={() => addNewProducts()}>
            Deploy new data
        </Button>
    </Grid>
   
    
    return(
        <PageLayout
            title={"Manage database"}
            content={content}
        />
    )
}

export default Database