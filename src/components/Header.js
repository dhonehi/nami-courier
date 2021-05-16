import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";

import {useNavigation} from '@react-navigation/native';

import {connect} from "react-redux";

import {FontAwesome} from '@expo/vector-icons';

import {RALEWAY_BOLD} from "../fonts/fontsTypes";

const BackBtn = () => {
    const navigation = useNavigation()

    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.btnWrapper, styles.backBtn]}>
            <FontAwesome name="long-arrow-left" size={24} color="black"/>
        </TouchableOpacity>
    )
}

const Header = ({title, isShowBackBtn, selectedOrder}) => {
    return (
        <View style={styles.header}>
            <View style={styles.content}>
                {isShowBackBtn && selectedOrder === null && <BackBtn/>}
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
        </View>
    )
}

const mapStateToProps = state => {
    return {
        selectedOrder: state.orders.selectedOrder,
    }
}

export default connect(mapStateToProps)(Header)

const styles = StyleSheet.create({
    header: {
        height: 100,
        justifyContent: 'center',
    },
    content: {
        position: 'relative',
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: RALEWAY_BOLD,
        color: '#1B4965'
    },
    btnWrapper: {
        position: 'absolute',
        left: 0,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    backBtn: {
        marginLeft: 15
    }
})