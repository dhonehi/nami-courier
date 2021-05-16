import {AsyncStorage} from 'react-native'

import {SELECT_ORDER, COMPLETE_ORDER} from "../actions/types";

let initialState = {
    selectedOrder: null
}

AsyncStorage.getItem('selectedOrder').then(response => {
    if (response) initialState.selectedOrder = JSON.parse(response)
})

const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SELECT_ORDER: {
            AsyncStorage.setItem('selectedOrder', JSON.stringify(action.payload))
            return {
                selectedOrder: action.payload
            }
        }
        case COMPLETE_ORDER: {
            AsyncStorage.removeItem('selectedOrder')
            return {
                selectedOrder: null
            }
        }
        default:
            return state
    }
}

export default ordersReducer