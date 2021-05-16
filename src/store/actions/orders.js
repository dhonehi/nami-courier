import {SELECT_ORDER, COMPLETE_ORDER} from "./types";

export const selectOrder = order => {
    return {
        type: SELECT_ORDER,
        payload: order
    }
}

export const completeOrder = () => {
    return {
        type: COMPLETE_ORDER,
    }
}