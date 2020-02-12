import React from 'react'

// MUI stuff
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const styles = {
}

const Counter = (props) => (
                <ButtonGroup>
                    <Button variant="outlined" onClick={props.handleMinusClick}>-</Button>
                    <Button disabled style={{ color: "black", width: '60px' }}>
                        {props.quantity}
                    </Button>
                    <Button variant="outlined"  onClick={props.handlePlusClick}>+</Button>
                </ButtonGroup>
        )

export default withStyles(styles)(Counter)
