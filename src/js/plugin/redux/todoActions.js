import { SET_ITEMS } from "./reducers/todoReducer";

// use this to enable logging

export const setItems = items => {
    return (dispatch, getState) => {

        const state = getState()
        console.log('setItems :', state);

        dispatch({
            type: SET_ITEMS,
            payload: {
                items: items
            }
        })
    }
};

export const getItems = applicationData => {
    return (dispatch, getState) => {
        dispatch(fetchTodosBegin())

        applicationData.event.send("@plugin_bundle:getLists", {
            applicationId: applicationData.applicationId,
            name: applicationData.displayName,
            callback: data => {
                const todos = data.find(x => x.applicationId === applicationData.applicationId).items;
                dispatch(fetchTodosSuccess(todos));
            }
        });
    }
};

export const FETCH_TODOS_BEGIN = 'FETCH_TODOS_BEGIN';
export const FETCH_TODOS_SUCCESS = 'FETCH_TODOS_SUCCESS';
export const FETCH_TODOS_FAILURE = 'FETCH_TODOS_FAILURE';

export const fetchTodosBegin = () => ({
    type: FETCH_TODOS_BEGIN
});

export const fetchTodosSuccess = todos => ({
    type: FETCH_TODOS_SUCCESS,
    payload: { todos }
});

export const fetchTodosFailure = error => ({
    type: FETCH_TODOS_FAILURE,
    payload: { error }
});

// same thing but no access to the state

// export const setItems = items => {
//     return {
//         type: SET_ITEMS,
//         payload: {
//             items: items
//         }
//     }
// };


