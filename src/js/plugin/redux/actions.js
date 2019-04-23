import { SET_ITEMS } from "./reducers/items";

export const setItems = items => {
    return (dispatch, getState) => {
        const state = getState()

        dispatch({
            type: SET_ITEMS,
            payload: {
                items: items
            }
        })
    }
};

// export const setItems = items => {
//     return {
//         type: SET_ITEMS,
//         payload: {
//             items: items
//         }
//     }
// };


