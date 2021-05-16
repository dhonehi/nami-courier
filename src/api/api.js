import io from 'socket.io-client/dist/socket.io'

const BASE_URL = 'https://namisushi.ru/api/'

export const signin = (loginData) => {
    return fetch(BASE_URL + 'signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(loginData)
    })
}

export const getOrders = (sessionId) => {
    return fetch(BASE_URL + 'admin/orders?condition=0&delivery=true', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Cookie': `${sessionId}`
        }
    })
}

export const getOrderInfo = (orderId, sessionId) => {
    return fetch(BASE_URL + `admin/order/${orderId}`, {
        method: 'GET',
        headers: {
            'Cookie': `${sessionId}`
        }
    })
}

export const startExecutionOrder = (orderId, sessionId) => {
    return fetch(BASE_URL + `order/${orderId}/condition/20`, {
        method: 'PATCH',
        headers: {
            'Cookie': `${sessionId}`
        }
    })
}

export const completeExecutionOrder = (orderId, sessionId) => {
    return fetch(BASE_URL + `order/${orderId}/condition/30`, {
        method: 'PATCH',
        headers: {
            'Cookie': `${sessionId}`
        }
    })
}

export const connectToWs = (sessionId) => {
    return io('https://namisushi.ru/', {
        jsonp: false,
        path: '/ws',
        extraHeaders: {
            'Cookie': `${sessionId}`
        }
    });
}