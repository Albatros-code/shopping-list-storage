import React from 'react'
import Typography from '@material-ui/core/Typography';

// MUI stuff
import { withStyles } from '@material-ui/core/styles';
import ShoppingIcon from '@material-ui/icons/ShoppingCartTwoTone';

// Components
import PageLayout from '../components/pageLayout';

const styles = {
    content: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '20%',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: "500px"
    }
};

function Home(props) {
    const { classes } = props

    const content = 
    <div className={classes.content}>
        <ShoppingIcon style={{ fontSize: 100 }}  />
        <Typography variant="h2">Shopping List App</Typography>
        <Typography variant="body1">Create your shopping list and store all of them in one place.</Typography>
    </div>

    return (
        <PageLayout 
        content={content}
    />
    )

}

export default withStyles(styles)(Home)
