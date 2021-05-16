import {AsyncStorage} from 'react-native'

import {LOGIN, LOGOUT} from "../actions/types";

let isLoggedIn = false

let initialState = {
    isLoggedIn,
    userInfo: null,
    sessionId: null
}

AsyncStorage.getItem('isLoggedIn').then(response => {
    if (response && response === 'true') {
        const getUserInfo = AsyncStorage.getItem('userInfo'), getSessionId = AsyncStorage.getItem('sessionId')

        Promise.all([getUserInfo, getSessionId]).then(response => {
            initialState.isLoggedIn = true
            initialState.userInfo = JSON.parse(response[0])
            initialState.sessionId = response[1]
        })
    }
    else initialState.isLoggedIn = false
})

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN: {
            AsyncStorage.setItem('isLoggedIn', 'true')
            AsyncStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo))
            AsyncStorage.setItem('sessionId', action.payload.sessionId)
            return {
                isLoggedIn: true,
                userInfo: action.payload.userInfo,
                sessionId: action.payload.sessionId
            }
        }
        case LOGOUT: {
            AsyncStorage.removeItem('isLoggedIn')
            AsyncStorage.removeItem('userInfo')
            AsyncStorage.removeItem('sessionId')
            return {
                isLoggedIn: false,
                userInfo: null,
                sessionId: null
            }
        }
        default:
            return state
    }
}

export default authReducer