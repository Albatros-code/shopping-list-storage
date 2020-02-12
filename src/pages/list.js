import React, { useState, useEffect } from 'react'

// MUI stuff
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/DeleteOutline';
import BackIcon from '@material-ui/icons/KeyboardBackspace';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import ToggleOffIcon from '@material-ui/icons/ToggleOffOutlined';
import ToggleOnIcon from '@material-ui/icons/ToggleOnOutlined';

// Redux
import { connect } from 'react-redux';
import { deleteList } from '../redux/actions/dataActions';

// Components
import PageLayout from '../components/pageLayout';
import ButtonBottom from '../components/ButtonBottom';

const styles = (theme) => ({
    mealColor: {
        color: theme.palette.primary.main
    }
});

function List(props){
    
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [listId, setListId] = useState('');
    
    const [complex, setComplex] = useState(false);

    useEffect(() => {
        setListId(props.match.params.listId)
    },[props.match.params.listId])
 
    const { storedLists, deleteList, products, loading, history, classes } = props
    
    const list = () => {
        if (storedLists.hasOwnProperty(listId)){
            const list = storedLists[listId].items
            if (complex) return list
            else {
                let simpleList = [];
                let complexList = [];
                
                list.forEach(item => {
                    if (products[item.productId].type === 'single') simpleList.push({...item});
                    if (products[item.productId].type === 'meal') complexList.push({...item});
                })
                
                if (complexList.length > 0)
                complexList.forEach(itemSet => {
                    const ingredientsArray = Object.keys(products[itemSet.productId].ingredients)
                    ingredientsArray.forEach(item => {
                        let itemIndex = simpleList.findIndex(simpleProduct => simpleProduct.productId === item)

                        itemIndex >= 0 ? (
                            simpleList[itemIndex].quantity += parseInt(products[itemSet.productId].ingredients[item])
                        ) : (
                            simpleList.push({productId: item, quantity: parseInt(products[itemSet.productId].ingredients[item])})
                        )
                    })
                })

                simpleList.sort((a,b) => {           
                    const nameA = products[a.productId].productName;
                    const nameB = products[b.productId].productName;
        
                    if (nameA > nameB) return 1;
                    if (nameB > nameA) return -1;
                    return 0
                })

                return simpleList
            }
        } else {
            return []
        }
    }

    const mealStyle = (item) => (products[item.productId].type === 'meal' ? classes.mealColor : null)

    const content = list().map(item => (
        item === null ? null :
        <TableRow key={item.productId} hover>
            <TableCell className={mealStyle(item)}>
                {products[item.productId].productName}
            </TableCell>
            <TableCell align="center" className={mealStyle(item)}>
                {item.quantity}
            </TableCell>
        </TableRow>))

    const footer = 
        <>
            <ButtonBottom
                onClick={() => setDeleteDialogOpen(true)}
                label={"Delete list"}
                icon={DeleteIcon}
            />
            <ButtonBottom
                onClick={() => history.push("/stored-lists")}
                label={"Back"}
                icon={BackIcon}
            />
        </>
    const footerRight =
        <>
            <ButtonBottom
                onClick={() => {setComplex(!complex)}}
                label={"Toggle single/sets"}
                icon={!complex ? ToggleOffIcon : ToggleOnIcon}
                text={"Sets"}
                color={complex ? 'primary' : 'inherit'}
            />
        </>

    const title = storedLists.hasOwnProperty(listId) ? storedLists[listId].listName : !loading ? "List doesn't exist" : ""
    
    const deleteDialog =
        <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this list?"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Once you delete stored list there is no way to bring it back.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary" autoFocus>
                Cancel
            </Button>
            <Button onClick={() => deleteList(listId, history)} color="primary">
                Delete
            </Button>
            </DialogActions>
        </Dialog>

    return (
        <>
            <PageLayout 
                title={title}
                tableContent={content}
                tableHeaders={['Product Name', 'Quantity']}
                footer={footer}
                footerRight={footerRight}
                tableSizing={['70%', '30%']}
            />
            {deleteDialog}
        </>
    )
}

const mapStateToProps = (state) => ({
    storedLists: state.data.storedLists,
    products: state.data.products,
    loading: state.UI.loading
})

const mapActionToProps = {
    deleteList
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(List));
