import React, { Fragment } from 'react';

// Redux
import { connect } from 'react-redux';

// MUI stuff
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
//import { useTheme } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const footerHeight = '55';
const containerWidth = '900px';

const styles = theme => ({
    body: {
        margin: '0px'
    },
    container: {
        boxSizing: 'border-box',
        paddingTop: '60px',
        maxWidth: containerWidth,
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '100vh',
        backgroundColor: 'white',
        [theme.breakpoints.up('sm')]: {
            width: '70%',
        }
    },
    title: {
        textAlign: 'center',
        fontWeight: 100
    },
    header: {
        fontWeight: 500,
        maxWidth: containerWidth,
        padding: '0px 10px',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        
        marginBottom: '-1px',
    },
    footer: {
        flexWrap: 'nowrap',
        position: 'fixed',
        bottom: '0px',
        padding: '5px',
        height: `${footerHeight}px`,
        textAlign: 'center',
        fontWeight: 100,
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        backgroundColor: 'rgba(250,250,250,1)',
        //background: 'linear-gradient(0deg, rgba(17,221,170,0.25) 4%, rgba(255,255,255,1) 42%)',
        [theme.breakpoints.up('sm')]: {
            width: '70%',
        }
    },
    table: {
        flex: 1,
        justifyContent: 'center',
        padding: '0px 10px',
        overflowX: 'auto',
        overflowY: 'overlay',
        paddingBottom: '-3px',
        marginBottom: `${footerHeight -1}px`,
        width: '100%',
        '&::-webkit-scrollbar': {
            width: '0.4em'
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '0.25em',
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
          }
          
    },
})

function pageLayout(props){
    const { classes, loading } = props

    const tableSizing =
        <colgroup>
            {props.tableSizing &&
            props.tableSizing.map((colSize, index) => (
                <col key={"colSize" + index} width={colSize}/>
            ))}
        </colgroup>
        
    const tableHeaders = 
        <Fragment>
            {props.tableHeaders && ((() => {
                let headerCells = []
                for (let i = 0; i < props.tableHeaders.length; i++){
                    headerCells.push(
                    <TableCell key={'header' + i}>{props.tableHeaders[i]}</TableCell>
                    )
                }
                return headerCells
            })())}
        </Fragment>

    return(
        <Grid container direction="column" justify="space-evenly" className={classes.container} spacing={0}>
            {props.title &&
            <Grid item>
                <Typography variant="body1" className={classes.title}>{props.title}</Typography>
            </Grid>
            }

            {!loading && !props.isFake ? (
            <Fragment>
                {props.tableHeaders &&
                <Grid item className={classes.header} container>                    
                    <TableContainer>
                        <Table size="small" aria-label="a dense table" style={{marginBottom: '-1.5px', overflow: 'hidden'}}>
                            {tableSizing}
                            <TableHead>
                                <TableRow>
                                    {tableHeaders}
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                </Grid>
                }
                <Grid item className={classes.table} style={{ marginBottom: !props.footer ? '5px' : null}} container>
                    {props.content}
                    {props.tableContent &&
                    <TableContainer>
                        <Table size="small" aria-label="a dense table">
                            {tableSizing}
                            <TableBody>
                                {props.tableContent}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    }
                </Grid>
                {props.footer &&
                    <Grid container className={classes.footer}>
                        {props.footerRight &&
                        <Grid item container justify="flex-start" alignItems="center">
                            {props.footerRight}
                        </Grid>
                        }
                        <Grid item container justify="flex-end">
                            {props.footer}
                        </Grid>
                    </Grid>
                }
            </Fragment>
            ) : (
                <Grid item className={classes.table} container style={{alignItems: 'center'}}>
                    <CircularProgress />
                </Grid>
            )}     
        </Grid>
    )
}

const mapStateToProps = (state) => ({
    loading: state.UI.loading
})

export default connect(mapStateToProps, {})(withStyles(styles)(pageLayout))