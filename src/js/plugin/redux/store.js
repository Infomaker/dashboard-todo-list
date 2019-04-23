import { createStore } from "redux";
import rootReducer from "./reducers";

// export default createStore(rootReducer);

const store = () => {
    return createStore(rootReducer)
}

export default store