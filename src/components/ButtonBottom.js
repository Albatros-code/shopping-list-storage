import React from 'react';

// MUI stuff
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    buttonBottom: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        height: '50px',
        minWidth: '50px',
        borderRadius: '5px',
        transition: 'all 0.2s',

        '&:hover': {
            background: 'rgba(199,199,199,0.3)',
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main        
        }
    },
    footerText: {
        textTransform: 'uppercase',
        fontSize: '10px',
        position: 'fixed',
        bottom: '5px'
    },
    textBorder: {
        //borderBottom: '1px solid',
        minWidth: '50px',
        fontColor: "red"
    },
    iconText: {
        textTransform: 'uppercase',
        fontWeight: 700
    }
})

const ButtonBottom = React.forwardRef((props, ref) => {
    const { icon: Icon, typography, classes, label, onClick, text, color = 'inherit', size = '40px' } = props
    
    return(
        <Tooltip title={label}>
            <div ref={ref} onClick={onClick} className={classes.buttonBottom}>
                {Icon && <Icon color={color} style={{fontSize: size, bottom: text ? '8px' : null, position: text ? 'relative' : 'inherit'}} />}
                {typography && 
                    <div style={{width: size, bottom: text ? '8px' : null, position: text ? 'relative' : 'inherit'}} className={classes.textBorder}>
                        <Typography className={classes.iconText}>{typography}</Typography>
                    </div>
                }
                {text &&            
                <Typography className={classes.footerText}>{text}</Typography>
                }
            </div>
        </Tooltip>
    )
})

export default withStyles(styles)(ButtonBottom)