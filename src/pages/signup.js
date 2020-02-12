import React, { useState, useEffect, useCallback } from 'react'
import Typography from '@material-ui/core/Typography';

// Redux
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

// MUI stuff
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FaceIcon from '@material-ui/icons/Face';
import CircularProgress from '@material-ui/core/CircularProgress';

// Components
import PageLayout from '../components/pageLayout';

const styles = {
    container: {
        textAlign: 'center',
        maxWidth: "300px"
    }
};

function Signup(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [errors, setErrors] = useState({});

    const { classes, loading, history, signupUser } = props

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors]);

    const handleSignup = useCallback(() => {
        signupUser(email, password, confirmPassword, userName, history); 
    }, [email, password, confirmPassword, userName, history, signupUser])

    useEffect(() => {
        const enterPressed = (e) => {
            if (e.key === 'Enter') handleSignup() 
        }
        window.addEventListener('keydown', enterPressed);
        return () => {
            window.removeEventListener('keydown', enterPressed);
          };
    }, [handleSignup]);

    const content = 
        <div className={classes.container}>
            <FaceIcon style={{ fontSize: 60 }}  />
            <Typography variant="h2">Signup</Typography>
            <form noValidate autoComplete="off">
                <TextField
                    autoFocus
                    autoComplete="off"
                    type="email"
                    margin="dense"
                    label="Email"
                    fullWidth
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    name="email"
                    helperText={errors.email}
                    error={errors.email || errors.general ? true : false}
                />
                <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    name="password"
                    helperText={errors.password}
                    error={errors.password || errors.general ? true : false}
                />
                <TextField
                    margin="dense"
                    label="Confirm password"
                    type="password"
                    fullWidth
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    name="confirmPassword"
                    helperText={errors.confirmPassword}
                    error={errors.confirmPassword || errors.general ? true : false}
                />
                <TextField
                    margin="dense"
                    label="User name"
                    type="text"
                    fullWidth
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                    name="userName"
                    helperText={errors.userName}
                    error={errors.userName || errors.general ? true : false}
                />
            </form>
            <Button style={{ marginTop: "10px" }} disabled={loading}  variant="contained" color="primary" onClick={() => handleSignup()}>
                Signup
                {loading && <CircularProgress size={40} style={{ position: 'absolute' }} color="primary"/>}
            </Button>
            {errors.general &&
                <Typography style={{ marginTop: "10px", color: "red" }} variant="body1">{errors.general}</Typography>
            }
        </div>

    return (
        <PageLayout
            content={content}
        />
    )
}

const mapStateToProps = (state) => ({
    errors: state.UI.errors,
    loading: state.UI.loading
})

export default connect(mapStateToProps, { signupUser })(withStyles(styles)(Signup));
