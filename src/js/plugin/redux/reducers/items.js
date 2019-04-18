import { SET_ITEMS } from "../actionTypes";

const initialState = {
    reduxItems: ['test','test2','test3']
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_ITEMS: {
            const { items } = action.payload;
            return {
                reduxItems: items
            };
        }
        default:
            return state;
    }
}