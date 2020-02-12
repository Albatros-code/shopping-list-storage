import React, { Component, Fragment } from 'react'

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

// Redux
import { connect } from 'react-redux';
import { saveList } from '../redux/actions/dataActions';


const styles = {
    highlighted: {
        fontWeight: 'bold'
    }
};

class newList extends Component {
    constructor(){
        super();
        this.state= {
            search: '',
            selectedItems: {},
            preview: false,

            listName: '',
            setNameDialogOpen: false
        }
    }

    isSelected = (id) => {
        if (typeof(this.state.selectedItems[id]) === "undefined"){
            return false
        };
        return true
    }

    addToSelection = (productId) => {
        this.setState({
            selectedItems: {...this.state.selectedItems,
                [productId]: {
                    productId: productId,
                    quantity: 1
                }}
        })
    }

    removeFromSelection = (productId) => {
        const { [productId]: value, ...newArray } = this.state.selectedItems;
            this.setState({
                selectedItems: newArray
            })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    handleClick = (event) => {
        let productId = event.currentTarget.getAttribute('product');
        if (!this.isSelected(productId)) {      
            this.addToSelection(productId);
        } else {
            this.removeFromSelection(productId);
        }
    }

    handlePlusClick = (productId) => {
        if (!this.isSelected(productId)){
            this.addToSelection(productId);
        } else {
            let product = this.state.selectedItems[productId];
            this.setState({
                selectedItems: {
                    ...this.state.selectedItems,
                    [productId]: {
                        ...product,
                        quantity: product.quantity += 1
                    }
                }
            })
        }
    }

    handleMinusClick = (productId) => {
        let product = this.state.selectedItems[productId];
        if (!this.isSelected(productId)){
            return null
        } else if (product.quantity === 1) {
            this.removeFromSelection(productId)
        } else {
            let product = this.state.selectedItems[productId];
            this.setState({
                selectedItems: {
                    ...this.state.selectedItems,
                    [productId]: {
                        ...product,
                        quantity: product.quantity -= 1
                    }
                }
            })
        }
    }

    render() {
        const { classes, userId, saveList, history } = this.props
        const { setNameDialogOpen, selectedItems } = this.state
        const productsObject = this.props.products

        const generateList = () => {
            const itemsArray = [];
            for (const item in selectedItems) {
                itemsArray.push({
                    productId: selectedItems[item].productId,
                    quantity: selectedItems[item].quantity
                })
            }

            return {
                listName: this.state.listName,
                owner: userId,
                createdAt: new Date().toISOString(),
                items: itemsArray
            }
        }

        const products = (() => {
            let array = []
            for (const product in productsObject) {
                array.push({
                    productId: product,
                    ...productsObject[product]
                    }
                )
            }
            return array
        })()

        const searchField = 
            <form noValidate autoComplete="off">
                <TextField
                    fullWidth
                    onChange={this.handleChange}
                    size="small" 
                    label="Search..."
                    type="search"
                    variant="outlined" 
                    value={this.state.search}
                    name="search"
                />
            </form>
        
        const filteredProducts = products.map(product => (
            (product.productName.includes(this.state.search.toLowerCase()) && 
            (this.state.preview ? this.isSelected(product.productId) : true)) ? (
                <TableRow key={product.productId} hover>
                    <TableCell  product={product.productId} onClick={this.handleClick} component="th" scope="row" className={this.isSelected(product.productId) ? classes.highlighted : ""}>
                        {product.productName}
                    </TableCell>
                    <TableCell align="right">
                        <Counter 
                            quantity={this.isSelected(product.productId) ? this.state.selectedItems[product.productId].quantity : 0}
                            handlePlusClick={() => this.handlePlusClick(product.productId)}
                            handleMinusClick={() => this.handleMinusClick(product.productId)}
                        />
                    </TableCell>
                </TableRow> 
            ): null
        ))

        const setNameDialog =
            <Dialog open={setNameDialogOpen} onClose={() => this.setState({ setNameDialogOpen: false })} aria-labelledby="form-dialog-title">
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
                                onChange={this.handleChange}
                                value={this.state.listName}
                                name="listName"
                            />
                        </form>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.setState({ setNameDialogOpen: false })} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => saveList(generateList(), history)} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        const footer = 
            <Fragment>
                <ButtonBottom
                    onClick={() => this.setState({preview: !this.state.preview, search: ''})}
                    label={"Toggle view"}
                    icon={!this.state.preview ? <ToggleOnIcon /> : <ToggleOffIcon />}
                />
                <ButtonBottom
                    onClick={() => this.setState({selectedItems: [], preview: false})}
                    label={"Clear"}
                    icon={<ClearIcon />}
                />
                <ButtonBottom
                    onClick={() => this.setState({ setNameDialogOpen: true })}
                    label={"Save"}
                    icon={<SaveIcon />}
                />
            </Fragment>

        return (
            <Fragment>
                <PageLayout
                title={"New list"}
                tableSizing={['70%', '30%']}
                tableHeaders={[searchField]}
                tableContent={filteredProducts}
                footer={footer}
                />
                {setNameDialog}
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    products: state.data.products,
    userId: state.user.user.userId
})

const mapActionToProps = {
    saveList
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(newList));
