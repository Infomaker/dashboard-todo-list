import { SET_ITEMS } from "./actionTypes";

export const setItems = content => ({
    type: SET_ITEMS,
    payload: {
        content
    }
});
