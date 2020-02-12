import React, { useState } from 'react'

// MUI stuff
import { withStyles } from '@material-ui/core/styles';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import SaveIcon from '@material-ui/icons/Save';
import ToggleOffIcon from '@material-ui/icons/ToggleOffOutlined';
import ToggleOnIcon from '@material-ui/icons/ToggleOnOutlined';
import ClearIcon from '@material-ui/icons/CachedOutlined';

// Components
import Counter from '../components/Counter';
import PageLayout from '../components/pageLayout';
import ButtonBottom from '../components/ButtonBottom';
import MenuList from '../components/MenuList';

// Redux
import { connect } from 'react-redux';
import { saveList } from '../redux/actions/dataActions';


const styles = {
    highlighted: {
        fontWeight: 'bold'
    },
    filterMenu: {
        backgroundColor: 'red',
        position: 'fixed',
        width: '150px',
        bottom: '55px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '5000'
    }
};

function NewList(props){
    const [search, setSearch] = useState('');
    const [selectedItems, setSelectedItems] = useState({});
    const [preview, setPreview] = useState(false);
    const [listName, setListName] = useState('');
    const [NameDialogOpen, setNameDialogOpen] = useState(false);

    const [filter, setFilter] = useState('all');

    const filterValues = ['all', 'single', 'meal'];

    const { classes, userId, saveList, history } = props

    const isSelected = (id) => {
        if (typeof(selectedItems[id]) === "undefined"){
            return false
        };
        return true
    }

    const addToSelection = (productId) => {
        setSelectedItems({
            ...selectedItems,
            [productId]: {
                productId: productId,
                quantity: 1
            }
        })
    }

    const removeFromSelection = (productId) => {
        const { [productId]: value, ...newArray } = selectedItems;
        setSelectedItems(newArray)
    }    

    const handleClick = (e) => {
        let productId = e.currentTarget.getAttribute('product');
        if (!isSelected(productId)) {      
            addToSelection(productId);
        } else {
            removeFromSelection(productId);
        }
    }

    const handlePlusClick = (productId) => {
        if (!isSelected(productId)){
            addToSelection(productId);
        } else {
            let product = selectedItems[productId];
            setSelectedItems({
                ...selectedItems,
                [productId]: {
                    ...product,
                    quantity: product.quantity += 1
                }
            })
        }
    }

    const handleMinusClick = (productId) => {
        let product = selectedItems[productId];
        if (!isSelected(productId)){
            return null
        } else if (product.quantity === 1) {
            removeFromSelection(productId)
        } else {
            let product = selectedItems[productId];
            setSelectedItems({
                ...selectedItems,
                [productId]: {
                    ...product,
                    quantity: product.quantity -= 1
                }
            })
        }
    }

    const generateList = () => {
        const itemsArray = [];
        for (const item in selectedItems) {
            itemsArray.push({
                productId: selectedItems[item].productId,
                quantity: selectedItems[item].quantity
            })
        }

        itemsArray.sort((a,b) => {
            const typesOrder = ['meal', 'single']            
            const nameA = props.products[a.productId].productName;
            const nameB = props.products[b.productId].productName;                
            const typeA = typesOrder.indexOf(props.products[a.productId].type);
            const typeB = typesOrder.indexOf(props.products[b.productId].type);

            if (typeA === typeB){if (nameA > nameB) return 1; if (nameB > nameA) return -1;}
            else {if (typeA > typeB) return 1; if (typeB > typeA) return -1;}
            return 0
        })

        return {
            listName: listName,
            owner: userId,
            createdAt: new Date().toISOString(),
            items: itemsArray
        }
    }

    const products = (() => {
        let array = []
        for (const product in props.products) {
            array.push({
                productId: product,
                ...props.products[product]
                }
            )
        }
        return array
    })()

    const searchField = 
        <form noValidate autoComplete="off">
            <TextField
                fullWidth
                onChange={(e) => setSearch(e.target.value)}
                size="small" 
                label="Search..."
                type="search"
                variant="outlined" 
                value={search}
                name="search"
            />
        </form>
    
    const filteredProducts = products.map(product => (
        (
        product.productName.includes(search.toLowerCase()) && 
        (preview ? isSelected(product.productId) : true) &&
        (filter === 'all' ? true : product.type === filter)
        ) ? (
            <TableRow key={product.productId} hover>
                <TableCell  product={product.productId} onClick={handleClick} component="th" scope="row" className={isSelected(product.productId) ? classes.highlighted : ""}>
                    {product.productName}
                </TableCell>
                <TableCell align="right">
                    <Counter 
                        quantity={isSelected(product.productId) ? selectedItems[product.productId].quantity : 0}
                        handlePlusClick={() => handlePlusClick(product.productId)}
                        handleMinusClick={() => handleMinusClick(product.productId)}
                    />
                </TableCell>
            </TableRow> 
        ): null
    ))

    const setNameDialog =
        <Dialog open={NameDialogOpen} onClose={() => setNameDialogOpen(false)}>
            <DialogTitle id="form-dialog-title">List name</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Set unique name for your list so you can easly find later in Stored Lists section.
                    </DialogContentText>
                    <form noValidate autoComplete="off">
                        <TextField
                            autoFocus
                            margin="dense"
                            id="listName"
                            label="Set list name"
                            fullWidth
                            onChange={(e) => setListName(e.target.value)}
                            value={listName}
                            name="listName"
                        />
                    </form>
                </DialogContent>
            <DialogActions>
                <Button onClick={() => setNameDialogOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => saveList(generateList(), history)} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>

    const footer =
        <>
            <ButtonBottom
                onClick={() => {setSelectedItems([]); setPreview(false)}}
                label={"Clear"}
                icon={ClearIcon}
            />
            <ButtonBottom
                onClick={() => setNameDialogOpen(true)}
                label={"Save"}
                icon={SaveIcon}
            />
        </>
    
    const handleFilterChange = (filter) => {
        setFilter(filter)
    }
       
    const footerRight =
        <>
            <ButtonBottom
                onClick={() => {setPreview(!preview); setSearch(''); setFilter(filterValues[0])}}
                label={"Toggle view"}
                icon={!preview ? ToggleOffIcon : ToggleOnIcon}
                text={"preview"}
                color={preview ? 'primary' : 'inherit'}
            />
            <MenuList items={filterValues} selectedItem={filter} itemSelection={(item) => handleFilterChange(item)} />
        </>

    return (
        <>
            <PageLayout
            title={"New list"}
            tableSizing={['70%', '30%']}
            tableHeaders={[searchField]}
            tableContent={filteredProducts}
            footer={footer}
            footerRight={footerRight}
            />
            {setNameDialog}
        </>
    )
}

const mapStateToProps = (state) => ({
    products: state.data.products,
    userId: state.user.user.userId
})

const mapActionToProps = {
    saveList
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(NewList));
