
export const SET_ITEMS = "SET_ITEMS";
const initialState = []

export default function (state = initialState, action) {
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