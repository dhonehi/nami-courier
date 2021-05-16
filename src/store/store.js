import { createStore, combineReducers } from 'redux';
import authReducer from "./reducers/authReducer";
import ordersReducer from "./reducers/ordersReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    orders: ordersReducer
})

const configureStore = () => {
    return createStore(rootReducer)
}

export default configureStore