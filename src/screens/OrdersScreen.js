import React, {useEffect, useState, useCallback} from "react";
import {View, Text, RefreshControl, ScrollView, StyleSheet} from "react-native";

import {connect} from "react-redux";

import {getOrders} from "../api/api";

import OrderCard from "../components/OrderCard";
import {RALEWAY_BOLD} from "../fonts/fontsTypes";

const OrdersScreen = ({sessionId, selectedOrder, navigation}) => {
    const [orders, setOrders] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    const loadOrders = () => {
        setRefreshing(true);

        getOrders(sessionId)
            .then(response => response.json())
            .then(responseJson => {
                setOrders(responseJson.orders)
            })
            .finally(() => {
                setRefreshing(false)
            })
    }

    useEffect(() => {
        if (selectedOrder) {
            navigation.push('OrderInfo', {order: selectedOrder, loadOrders})
        }
        loadOrders()
    }, [])

    const onRefresh = useCallback(() => {
        loadOrders()
    }, []);

    return (
        <View style={styles.wrapper}>

            <ScrollView
                refreshControl={<RefreshControl progressViewOffset={15} refreshing={refreshing}
                                                onRefresh={onRefresh}/>}>
                {orders.length !== 0 ?
                    <View style={styles.content}>
                        {orders.map((order, i) => <OrderCard order={order} navigation={navigation}
                                                             loadOrders={loadOrders}
                                                             key={i}/>)}
                    </View> :
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>Пусто...</Text>
                    </View>}
            </ScrollView>
        </View>
    )
}

const mapStateToProps = state => {
    return {
        sessionId: state.auth.sessionId,
        selectedOrder: state.orders.selectedOrder
    }
}

export default connect(mapStateToProps)(OrdersScreen)

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '80%'
    },
    emptyText: {
        fontSize: 20,
        fontFamily: RALEWAY_BOLD,
        color: 'black'
    }
})