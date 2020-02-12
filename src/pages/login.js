import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

// Redux
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

// MUI stuff
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ShoppingIcon from '@material-ui/icons/ShoppingCartTwoTone';

// Components
import PageLayout from '../components/pageLayout'

const styles = {
    container: {
        textAlign: 'center',
        maxWidth: "300px"
    }
};

function Login(props){
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    
    const { classes, history, loginUser } = props

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    const handleLogin = useCallback(() => {
        const login = () => loginUser(email, password, history);
        const errors = login()
        if (errors){
            setErrors({errors})
            console.log(errors)
        }
    }, [email, password, history, loginUser]);

    useEffect(() => {
        const enterPressed = (e) => {
            if (e.key === 'Enter') handleLogin() 
        }
        window.addEventListener('keydown', enterPressed);
        return () => {
            window.removeEventListener('keydown', enterPressed);
          };
    }, [handleLogin]);

    const content = 
        <div className={classes.container}>
            <ShoppingIcon style={{ fontSize: 60 }}  />
            <Typography variant="h2">Login</Typography>
            <form noValidate autoComplete="off">
                <TextField
                    autoFocus
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
            </form>
            {errors.general &&
                <Typography style={{ marginTop: "10px", color: "red" }} variant="body1">{errors.general}</Typography>
            }
            <Button style={{ marginTop: "10px" }}  variant="contained" color="primary" onClick={() => handleLogin()}>Login</Button>
            <Typography style={{ marginTop: "10px", fontWeight: "100" }} variant="body2">dont have an account? sign up <Link to={"/signup"}>here</Link></Typography>
        </div>
    return (
        <PageLayout
            content={content}
        />
    )
}

const mapStateToProps = (state) => ({
    errors: state.UI.errors
})

export default connect(mapStateToProps, { loginUser })(withStyles(styles)(Login));
