import { combineReducers, applyMiddleware } from "redux";
import items from "./items";

export default combineReducers({ 
    items: items
})