
import React from 'react'

export const Store = React.createContext();

const initialState = {
    items: []
}

export const setStoreItems = (dispatch, items) => {
    dispatch({
        type: 'SET_DATA',
        payload: items
    })
}

function itemsReducer(state, action) {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, items: action.payload };
        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = React.useReducer(itemsReducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider
        value={value}>{props.children}
    </Store.Provider>
}
