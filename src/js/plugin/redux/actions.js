import { SET_ITEMS } from "./reducers/items";

// use this to enable logging

export const setItems = items => {
    return (dispatch, getState) => {
        
        //const state = getState()
        //console.log('state :', state);

        dispatch({
            type: SET_ITEMS,
            payload: {
                items: items
            }
        })
    }
};

// same thing but no access to the state

// export const setItems = items => {
//     return {
//         type: SET_ITEMS,
//         payload: {
//             items: items
//         }
//     }
// };


