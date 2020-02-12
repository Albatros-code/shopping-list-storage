import {
    //LOGIN_USER,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    SET_USER,
    CLEAR_USER_CREDENTIALS
    //LOGOUT_USER,
    //LOADING_USER
} from '../types';

const initialState = {
    authenticated: false,
    user: {}
}

export default function (state = initialState, action){
    switch(action.type){
        case SET_USER:
            return {
                ...state,
                user: action.payload
            }
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true

            }
        case SET_UNAUTHENTICATED:
            return {
                ...state,
                authenticated: false
            }
        case CLEAR_USER_CREDENTIALS:
            return {
                ...state,
                user: {}
            }
        default:
            return state;
    }
}