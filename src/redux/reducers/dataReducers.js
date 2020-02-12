import {
    SAVE_LIST,
    GET_STORED_LISTS,
    GET_PRODUCTS,
    CLEAR_USER_DATA,
    DELETE_LIST

} from '../types';

const initialState = {
    storedLists: {},
    products: {}
}

export default function (state = initialState, action){
    switch(action.type){
        case GET_PRODUCTS:
            return {
                ...state,
                products: action.payload
            } 
        case SAVE_LIST:
            return {
                ...state,
                storedLists: {
                    [action.listId]: {
                        ...action.payload
                    },
                    ...state.storedLists
                }
            }
        case GET_STORED_LISTS:
            return {
                ...state,
                storedLists: {
                    ...action.payload
                }
            }
        case CLEAR_USER_DATA:
            return {
                ...state,
                storedLists: {}
            }
        case DELETE_LIST:
            const { [action.listId]: value, ...withoutDeleted } = state.storedLists;
            return {
                ...state,
                storedLists: withoutDeleted
            }
        default:
            return state;
    }
}