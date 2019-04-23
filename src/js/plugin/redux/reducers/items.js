// import { SET_ITEMS } from "../actionTypes";

export const SET_ITEMS = "SET_ITEMS";

// const initialState = {
//     items: ['test', 'test2', 'test3']
// };

const initialState = []

export default function (state = initialState, action) {
    console.log("redux.items", state, action)
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