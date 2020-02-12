import { 
    SAVE_LIST,
    GET_STORED_LISTS,
    GET_PRODUCTS,
    LOADING_UI,
    STOP_LOADING_UI,
    DELETE_LIST
} from '../types'

import { 
    getStoredListsApi,
    getProductsApi,
    addListApi,
    deleteListApi
} from '../../backend/api';

export const getProducts = () => (dispatch) => {
    getProductsApi()
        .then(products => {
            dispatch({
                type: GET_PRODUCTS,
                payload: products
        })
    })
}

export const saveList = (list, history) => (dispatch) => {
    addListApi(list)
        .then(docRef => {
            dispatch({
                type: SAVE_LIST,
                listId: docRef.id,
                payload: list
            });
            history.push('/stored-lists')
    })
}

export const deleteList = (listId, history) => (dispatch) => {
    deleteListApi(listId)
        .then(() =>
            dispatch({
                type: DELETE_LIST,
                listId: listId
            })
        )
        .then(() =>
            history.push('/stored-lists')
        )
}

export const getStoredLists = (userId) => (dispatch, getState) => {
    const storedListsCount = Object.getOwnPropertyNames(getState().data.storedLists).length
    dispatch({
        type: LOADING_UI
    })
    if (storedListsCount <= 1){
        getStoredListsApi(userId).then(data => {
            dispatch({
                type: GET_STORED_LISTS,
                payload: data
            });
            dispatch({
                type: STOP_LOADING_UI
            })
        });
        
    }
}



/*
export const saveList = (text) => 
    ({
        type: SAVE_LIST,
        payload: text
    })
*/