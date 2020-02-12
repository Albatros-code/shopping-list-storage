// Firebase
import * as firebase from "firebase/app";
import "firebase/auth";

import {
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    SET_USER,
    CLEAR_USER_DATA,
    CLEAR_USER_CREDENTIALS,
    LOADING_UI,
    STOP_LOADING_UI,
    SET_ERRORS,
    GET_STORED_LISTS,
    CLEAR_ERRORS
    //LOGIN_USER,
    //LOGOUT_USER,
    //LOADING_USER
} from '../types'

import { getStoredListsApi, signupUserApi, loginUserApi, getUserDataApi, isUserNameExistApi, isEmailTakenApi } from '../../backend/api';

export const signupUser = (email, password, confirmPassword, userName, history) =>  async (dispatch) => {
    dispatch({ type: LOADING_UI})
    let errors = {}
    const isEmpty = (param, arg) => arg === "" ? errors[param] = "Must not be empty" : null;
    const isEmail = (email) => !validateEmail(email) ? errors.email = "Wrong email format" : null;
    const arePasswordsMatch = (password, confirmPassword) => {
        if (password !== confirmPassword){
            errors.password = "Passwords don't match";
            errors.confirmPassword = "Passwords don't match"
        }
    }
    const isLongEnough = (param, arg) => arg.length < "6" ? errors[param] = "Min length is 6" : null;
    
    isEmail(email)
    isLongEnough("confirmPassword", confirmPassword)
    arePasswordsMatch(password, confirmPassword)
    isLongEnough("password", password)
    isEmpty("email", email);
    isEmpty("password", password)
    isEmpty("confirmPassword", confirmPassword);
    isEmpty("userName", userName); 
    
    if (!errors.hasOwnProperty('email')){
        const isEmailTaken = await isEmailTakenApi(email)
        if (isEmailTaken) errors.email = "Email is already taken."
    }

    if (!errors.hasOwnProperty('userName')) {
        const isUserNameExist = await isUserNameExistApi(userName)
        if (isUserNameExist) errors.userName = "User name is already used." 
    }

    if (!(Object.keys(errors).length === 0 && errors.constructor === Object)){
        dispatch({ type: SET_ERRORS, payload: errors })
        return
    }
    
    
    signupUserApi(email, password, userName)
        .then(data => {
            if (data) {
                history.push('/login');
                dispatch({ type: STOP_LOADING_UI })
            }
        })
        .catch(error => {
            errors = {
                [error.code]: error.message
            }
            dispatch({ type: SET_ERRORS, payload: errors })
        })
}

export const loginUser = (email, password, history) => (dispatch) => {
    // Input validation
    let errors = {}
    const isEmpty = (param, arg) => arg === "" ? errors[param] = "Must not be empty" : null;
    const isEmail = (email) => !validateEmail(email) ? errors.email = "Wrong email format" : null;
    isEmail(email)
    isEmpty("email", email);
    isEmpty("password", password)
    if (!(Object.keys(errors).length === 0 && errors.constructor === Object)){
        dispatch({ type: SET_ERRORS, payload: errors })
        return
    }

    // Call login api
    loginUserApi (email, password)
        .then((data) => {
            if (data.user.emailVerified){
                dispatch(getUserData(data.user.uid));
                dispatch({ type: CLEAR_ERRORS })
                history.push('/stored-lists');
            } else {
                firebase.auth().signOut()
                dispatch({
                    type: SET_ERRORS,
                    payload: {
                        general: "Email not verifeid."
                    }
                })
                return
            }            
        })
        .catch(error =>  {
            dispatch({
                type: SET_ERRORS,
                payload: {
                    general: "Wrong credentials, try again."
                }
            })
      });
}

export const logoutUser = (history) => (dispatch) => {
    firebase.auth().signOut()
        .then(() => {
            console.log("Sign-out successful.");

            dispatch({
                type: SET_UNAUTHENTICATED
            })
            dispatch({
                type: CLEAR_USER_DATA
            })
            dispatch({
                type: CLEAR_USER_CREDENTIALS
            })

            if (history){
                history.push('/login')
            }
        })
        .catch(function(error) {
            console.log("Sign-out errors")
            console.log(error)
        });
}

export const getUserData = (userId) => (dispatch, getState) => {
    //const storedListsCount = Object.getOwnPropertyNames(getState().data.storedLists).length
    dispatch({
        type: LOADING_UI
    })
    dispatch({
        type: SET_AUTHENTICATED
    })

    getUserDataApi(userId).then(data => {
        dispatch({
            type: SET_USER,
            payload: {
                userId: userId,
                ...data
            }
        });
        

        //if (storedListsCount <= 1){}

        getStoredListsApi(userId).then(data => {
            dispatch({
                type: GET_STORED_LISTS,
                payload: data
            });
            dispatch({
                type: STOP_LOADING_UI
            })
        });

    })
}

export const removeUserData = () => (dispatch) => {
    dispatch({
        type: SET_UNAUTHENTICATED
    })

}

const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
}