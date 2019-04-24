
export const SET_ITEMS = "SET_ITEMS";
const initialState = []

export function setItems(state = initialState, action) {
    console.log("setItems", action)
    switch (action.type) {
        case SET_ITEMS: {
            const { items } = action.payload;

            return [
                ...items
            ]
        }
        default:
            return state;
    }
}

import {
    FETCH_TODOS_BEGIN,
    FETCH_TODOS_SUCCESS,
    FETCH_TODOS_FAILURE
} from '../todoActions';

const todoInitialState = {
    items: [],
    loading: false,
    error: null
};

export function todoReducer(state = todoInitialState, action) {
    console.log("todoReducer", action)
    switch (action.type) {
        case FETCH_TODOS_BEGIN:
            // Mark the state as "loading" so we can show a spinner or something
            // Also, reset any errors. We're starting fresh.
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_TODOS_SUCCESS:
            // All done: set loading "false".
            // Also, replace the items with the ones from the server
            return {
                ...state,
                loading: false,
                items: action.payload.todos
            };

        case FETCH_TODOS_FAILURE:
            // The request failed. It's done. So set loading to "false".
            // Save the error, so we can display it somewhere.
            // Since it failed, we don't have items to display anymore, so set `items` empty.
            //
            // This is all up to you and your app though:
            // maybe you want to keep the items around!
            // Do whatever seems right for your use case.
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                items: []
            };

        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}

export default { setItems, todoReducer };