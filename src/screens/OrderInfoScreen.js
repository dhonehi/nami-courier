import React, {useEffect, useState} from "react";
import {Alert, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ScrollView, LogBox} from "react-native";
import * as Location from "expo-location";

import {BlueClockIcon, UserIcon} from "../images/OrderIcons";

import {connect} from "react-redux";

import {startExecutionOrder, completeExecutionOrder, getOrderInfo, connectToWs} from "../api/api";

import {completeOrder, selectOrder} from "../store/actions/orders";

import {RALEWAY_BOLD, RALEWAY_REGULAR} from "../fonts/fontsTypes";
import ProductCard from "../components/ProductCard";

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
])

const OrderInfoScreen = ({
                             route: {params: {order, loadOrders}},
                             selectedOrder,
                             selectCurrentOrder,
                             completeCurrentOrder,
                             sessionId,
                             navigation
                         }) => {
    let socket = null
    const [locationInstance, setLocationInstance] = useState(null)
    const [orderProducts, setOrderProducts] = useState([])

    const getLocationAsync = async () => {

        return await Location.watchPositionAsync({
                enableHighAccuracy: true,
                distanceInterval: 1,
                timeInterval: 2000
            },
            (newLocation) => {
                let coords = newLocation.coords;
                socket.emit('set-coordinates', {
                    orderId: order._id,
                    coordinates: [coords.latitude, coords.longitude]
                })
                console.log(coords)
            },
            error => console.log(error)
        )
    };

    const stopGoBack = (e) => {
        e.preventDefault()
        Alert.alert(
            'Текущий заказ!',
            'Чтобы вернуться Вы должны завершить текущий заказ!',
            [
                {
                    text: "ОК", style: 'cancel', onPress: () => {
                    }
                },
            ]
        )
    }

    const allowGoBack = (e) => {
        navigation.dispatch(e.data.action)
    }

    const startTracking = () => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            socket = connectToWs(sessionId)
            socket.on('connection', async () => {
                console.log('connection')
                const location = await getLocationAsync()
                setLocationInstance(location)
            })
        })()
    }

    const stopTracking = () => {
        if (locationInstance) locationInstance.remove()
        if (socket) {
            socket.emit('end-delivery', {orderId: order._id})
            socket.disconnect()
        }
        socket = null
        setLocationInstance(null)
    }

    const loadOrderInfo = () => {
        getOrderInfo(order._id, sessionId)
            .then(response => response.json())
            .then(responseJson => {
                setOrderProducts(responseJson.products)
            })
    }

    useEffect(() => {
        if (selectedOrder !== null) {
            navigation.removeListener('beforeRemove', allowGoBack)
            navigation.addListener('beforeRemove', stopGoBack)
            startTracking()
        } else {
            navigation.removeListener('beforeRemove', stopGoBack)
            navigation.addListener('beforeRemove', allowGoBack)
        }

        loadOrderInfo()
    }, []);

    const startExecution = () => {
        startExecutionOrder(order._id, sessionId).then(() => {
            selectCurrentOrder(order)
            startTracking()
            navigation.removeListener('beforeRemove', allowGoBack)
            navigation.addListener('beforeRemove', stopGoBack)

            Alert.alert('Заказ!', 'Вы начали доставку данного заказа')
        })
    }

    const completeExecution = () => {
        completeExecutionOrder(order._id, sessionId).then(() => {
            completeCurrentOrder()
            stopTracking()
            navigation.removeListener('beforeRemove', stopGoBack)
            navigation.goBack()
            loadOrders()

            Alert.alert('Заказ!', 'Заказ завершен')
        })
    }

    const getLocaleTimeString = (time) => {
        let timeString = new Date(time).toLocaleTimeString()
        const timeItem = timeString.split(':')
        return `${timeItem[0]}:${timeItem[1]}`
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <UserIcon/>
                <Text style={styles.userName}>{order.username} ({order.phone})</Text>
                <Text style={styles.address}>{order.address}</Text>
            </View>
            <View style={styles.generalOrderInfo}>
                <View style={styles.row}>
                    <BlueClockIcon/>
                    <View>
                        <Text style={styles.time}>{new Date(order.time).toLocaleDateString()}</Text>
                        <Text style={styles.time}>{getLocaleTimeString(order.time)}</Text>
                    </View>
                    <Text style={styles.text}>Время доставки</Text>
                </View>
                <View style={styles.row}>
                    <BlueClockIcon/>
                    <Text style={styles.cost}>{order.cost} &#8381;</Text>
                    <Text style={styles.text}>Сумма наличными</Text>
                </View>
            </View>
            <ScrollView style={{marginTop: 10}}>
                <View style={styles.products}>
                    {orderProducts.length === 0 && <ActivityIndicator size="large" color="black"/>}
                    {orderProducts.length !== 0 && orderProducts.map((orderProduct, i) => <ProductCard key={i}
                                                                                                       productInfo={orderProduct}/>)}
                </View>
            </ScrollView>
            {selectedOrder === null ?
                <TouchableOpacity style={styles.btnWrapper} onPress={startExecution}>
                    <View style={styles.getOrderBtn}>
                        <Text style={styles.getOrderBtnText}>Взять заказ</Text>
                    </View>
                </TouchableOpacity> :
                <TouchableOpacity style={styles.btnWrapper} onPress={completeExecution}>
                    <View style={styles.completeOrderBtn}>
                        <Text style={styles.completeOrderBtnText}>Завершить заказ</Text>
                    </View>
                </TouchableOpacity>}
        </View>
    )
}

const mapStateToProps = state => {
    return {
        sessionId: state.auth.sessionId,
        selectedOrder: state.orders.selectedOrder,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        selectCurrentOrder: (order) => {
            dispatch(selectOrder(order))
        },
        completeCurrentOrder: () => {
            dispatch(completeOrder())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderInfoScreen)

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    header: {
        marginTop: 15,
        alignItems: 'center',
    },
    userName: {
        marginTop: 14,
        fontSize: 19,
        fontFamily: RALEWAY_REGULAR,
        color: '#020202'
    },
    address: {
        marginTop: 10,
        fontSize: 25,
        fontFamily: RALEWAY_BOLD,
        color: '#020202'
    },
    generalOrderInfo: {
        alignItems: 'center',
        marginTop: 35,
    },
    row: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%'
    },
    time: {
        fontSize: 20,
        fontFamily: RALEWAY_REGULAR,
        color: '#020202'
    },
    cost: {
        fontSize: 18,
        fontFamily: RALEWAY_BOLD,
        color: '#020202'
    },
    text: {
        fontSize: 18,
        fontFamily: RALEWAY_REGULAR,
        color: '#020202'
    },
    btnWrapper: {
        marginTop: 'auto',
        alignItems: 'center',
        marginBottom: 30
    },
    getOrderBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '90%',
        borderRadius: 4,
        backgroundColor: '#DC1616'
    },
    getOrderBtnText: {
        fontSize: 15,
        fontFamily: RALEWAY_BOLD,
        color: '#FFFFFF'
    },
    completeOrderBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '90%',
        borderRadius: 4,
        backgroundColor: '#8DC54E'
    },
    completeOrderBtnText: {
        fontSize: 15,
        fontFamily: RALEWAY_BOLD,
        color: '#FFFFFF'
    },
    products: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 10,
        paddingHorizontal: 15,
    }
})