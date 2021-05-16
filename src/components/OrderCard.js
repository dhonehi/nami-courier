import React from "react";
import {View, Text, TouchableWithoutFeedback, StyleSheet} from "react-native";

import {UserIcon, ClockIcon, LoadingIcon, CourierIcon} from "../images/OrderIcons";
import {RALEWAY_BOLD, RALEWAY_MEDIUM, RALEWAY_REGULAR} from "../fonts/fontsTypes";

const OrderCard = ({order, loadOrders, navigation}) => {
    const getLocaleTimeString = (time) => {
        let timeString = new Date(time).toLocaleTimeString()
        const timeItem = timeString.split(':')
        return `${timeItem[0]}:${timeItem[1]}`
    }

    return (
        <TouchableWithoutFeedback onPress={() => navigation.push('OrderInfo', {order, loadOrders})}>
            <View style={[styles.card, {borderRightColor: order.condition !== 0 ? '#A2A2A2' : '#FFA133'}]}>
                <UserIcon/>
                <View style={styles.cardContent}>
                    <View style={styles.row}>
                        <View style={styles.cardColumn}>
                            <Text style={styles.userName}>{order.username}</Text>
                            <Text style={styles.address}>{order.address}</Text>
                        </View>
                        <View style={styles.rightIconWrapper}>
                            {order.condition === 0 ? <LoadingIcon /> : <ClockIcon />}
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.createdDate}>{getLocaleTimeString(order.createdAt)}</Text>
                        <View style={styles.delimiter} />
                        <CourierIcon />
                        <Text style={styles.completeText}>Активный заказ</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default OrderCard

const styles = StyleSheet.create({
    card: {
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 24,
        marginBottom: 14,
        height: 120,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRightWidth: 6,
    },
    cardContent: {
        flex: 1,
        marginLeft: 24,
        height: '100%',
        justifyContent: 'space-around'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardColumn: {
        flex: 1
    },
    userName: {
        marginRight: 5,
        fontSize: 19,
        fontFamily: RALEWAY_MEDIUM,
        color: '#020202',
    },
    address: {
        marginTop: 2,
        fontSize: 15,
        fontFamily: RALEWAY_REGULAR,
        color: '#363636',
    },
    createdDate: {
        fontSize: 14,
        fontFamily: RALEWAY_REGULAR,
        color: '#868686'
    },
    rightIconWrapper: {
        marginRight: 14
    },
    delimiter: {
        marginLeft: 10,
        marginRight: 13,
        width: 2,
        height: '100%',
        backgroundColor: '#868686',
        borderRadius: 3
    },
    completeText: {
        marginLeft: 10,
        fontSize: 15,
        fontFamily: RALEWAY_BOLD,
        color: '#FFA133'
    }
})

