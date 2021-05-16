import React, {useState} from 'react'

import {createStackNavigator} from "@react-navigation/stack"
import {NavigationContainer} from "@react-navigation/native";

import {connect} from "react-redux";

import Login from "../screens/Login";
import OrdersScreen from "../screens/OrdersScreen";
import OrderInfoScreen from "../screens/OrderInfoScreen";

import Header from "../components/Header";

const AuthStack = createStackNavigator()
const OrdersStack = createStackNavigator()
const MainStack = createStackNavigator()

const MainStackNavigator = ({isLoggedIn}) => {
    return (
        <MainStack.Navigator initialRouteName={isLoggedIn ? 'Orders' : 'Auth'}>
            <MainStack.Screen name="Auth" component={AuthStackNavigator} options={{header: () => null}}/>
            <MainStack.Screen name="Orders" component={OrdersStackNavigator} options={{header: () => null}}/>
        </MainStack.Navigator>
    )
}

const AuthStackNavigator = () => (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Auth" component={Login} options={{header: () => null}}/>
    </AuthStack.Navigator>
)

const OrdersStackNavigator = () => (
    <OrdersStack.Navigator>
        <OrdersStack.Screen name="Orders" component={OrdersScreen} options={{
            header: () => <Header title="Заказы"/>
        }}/>
        <OrdersStack.Screen name="OrderInfo" component={OrderInfoScreen} options={{
            header: () => <Header title="Заказ" isShowBackBtn={true} />
        }} />
    </OrdersStack.Navigator>
)

const Routes = (props) => {
    return (
        <NavigationContainer>
            <MainStackNavigator isLoggedIn={props.isLoggedIn}/>
        </NavigationContainer>
    )
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
    }
}

export default connect(mapStateToProps)(Routes)