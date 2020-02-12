import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

// MUI stuff
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'

import HomeIcon from '@material-ui/icons/Home';
import NewListIcon from '@material-ui/icons/NoteAddOutlined';
import StoredListIcon from '@material-ui/icons/DescriptionOutlined';
import LogutIcon from '@material-ui/icons/CloseOutlined';
import LoginIcon from '@material-ui/icons/ExitToAppOutlined';

// Redux
import { logoutUser } from '../redux/actions/userActions'
import { connect } from 'react-redux';

const styles = (theme) => ({
    navButton: {
        borderRadius: '0px',
        flexGrow: 1,
        padding: '3px'
    },
    navButtonText: {
        display: 'block',
        fontSize: '10px',
        //marginTop: '-3px'
    },
    navbar: {
        minHeight: '50px',
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'stretch',
        padding: '0px!important',
        [theme.breakpoints.up('sm')]: {
            width: '70%',
        }
    }
})

function Navbar(props) {
    const { classes, authenticated, loading, logoutUser, history } = props;
        
    return (
    <div>
      <AppBar style={{justifyContent: 'space-around', flexDirection: 'row'}}>
        <Toolbar className={classes.navbar}>
            {loading || props.isFake ? (
                <Typography></Typography>
            ) : (
                <Fragment>
                    <Button component={Link} to="/" className={classes.navButton}>
                        <Grid container direction='column' alignItems='center'>
                            <HomeIcon style={{ fontSize: 30 }}/>
                            <Typography variant="body2" className={classes.navButtonText}>
                                Home
                            </Typography>
                        </Grid>
                    </Button>
                    {!authenticated ? (
                        <Button component={Link} to="/login" className={classes.navButton}>
                            <Grid container direction='column' alignItems='center'>
                            <LoginIcon style={{ fontSize: 30 }}/>
                            <Typography variant="body2" className={classes.navButtonText}>
                                Login
                            </Typography>
                        </Grid>
                        </Button>
                    ) : (
                        <Fragment>
                            <Button component={Link} to="/new-list" className={classes.navButton}>
                                <Grid container direction='column' alignItems='center'>
                                    <NewListIcon style={{ fontSize: 30 }}/>
                                    <Typography variant="body2" className={classes.navButtonText}>
                                        New list
                                    </Typography>
                                </Grid>
                            </Button>
                            <Button component={Link} to="/stored-lists" className={classes.navButton}>
                                <Grid container direction='column' alignItems='center'>
                                    <StoredListIcon style={{ fontSize: 30 }}/>
                                    <Typography variant="body2" className={classes.navButtonText}>
                                        Stored lists
                                    </Typography>
                                </Grid>
                            </Button>
                            <Button onClick={() => (logoutUser(history))} className={classes.navButton}>
                                <Grid container direction='column' alignItems='center'>
                                    <LogutIcon style={{ fontSize: 30 }}/>
                                    <Typography variant="body2" className={classes.navButtonText}>
                                        Logout
                                    </Typography>
                                </Grid>
                            </Button>
                        </Fragment>
                    )}
                </Fragment>
            )}            
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
    loading: state.UI.loading
})

const mapActionstoProps = {
    logoutUser
}

export default connect(mapStateToProps, mapActionstoProps)(withStyles(styles)(withRouter(Navbar)));