import React, {useState} from 'react'
import {Text, Image, Alert, StyleSheet, ScrollView, TextInput, TouchableOpacity, View} from "react-native";
import {RALEWAY_BOLD, RALEWAY_EXTRA_BOLD} from "../fonts/fontsTypes";

import {FontAwesome5, MaterialIcons} from '@expo/vector-icons';

import {connect} from "react-redux";

import {login} from "../store/actions/auth";
import Preloader from "../components/Preloader";

import {signin} from "../api/api";

const Login = ({login, navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const logIn = () => {
        if (!email || !password) {
            Alert.alert('Ошибка', 'Не все поля заполнены!')
            return
        }

        setLoading(true)

        signin({email, password})
            .then(async response => {
                if (!response.ok) {
                    if (response.status === 400) Alert.alert('Ошибка', 'Неверный email или пароль!')
                    else Alert.alert('Ошибка', 'Что-то пошло не так!')
                } else {
                    return {
                        userInfo: await response.json(),
                        sessionId: response.headers.get('set-cookie')
                    }
                }
            })
            .then(responseJson => {
                if (responseJson) {
                    login(responseJson)
                    navigation.replace('Orders')
                }
            })
            .finally(() => {
                setLoading(false)
            })

    }

    return (
        <View style={styles.wrapper}>
            <ScrollView style={{flex: 1}}>
                <View style={styles.content}>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>Войдите в NamiCourier</Text>
                    </View>
                    <View style={styles.logoWrapper}>
                        <Image source={require('../../assets/login-logo.png')} style={styles.logo}/>
                    </View>
                    <View style={styles.inputs}>
                        <View style={styles.inputWrapper}>
                            <FontAwesome5 name="user-alt" size={20} color="black"/>
                            <TextInput style={styles.input} value={email} onChangeText={setEmail}
                                       placeholder="Адрес электронной почты"/>
                        </View>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="lock" size={20} color="black"/>
                            <TextInput style={styles.input} value={password} onChangeText={setPassword}
                                       placeholder="Пароль" secureTextEntry={true}/>
                        </View>
                    </View>
                    <TouchableOpacity onPress={logIn}>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>Войти в систему</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {loading && <Preloader/>}
        </View>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        login: (userInfo) => {
            dispatch(login(userInfo))
        },
    }
}

export default connect(null, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#214d67',
        flex: 1
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: '#214d67',
        height: '100%'
    },
    titleWrapper: {
        marginTop: 100,
        alignItems: 'center'
    },
    title: {
        color: 'white',
        fontSize: 30,
        fontFamily: RALEWAY_EXTRA_BOLD,
        textAlign: 'center',
        lineHeight: 50,
        width: '60%'
    },
    logoWrapper: {
        marginTop: 20,
        alignItems: 'center'
    },
    logo: {
        width: 300,
        height: 300
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        width: '100%',
        borderRadius: 4,
        paddingHorizontal: 14,
        marginTop: 25,
        backgroundColor: 'white',
    },
    input: {
        marginLeft: 14,
        width: '100%',
        height: '100%',
    },
    inputs: {
        flex: 1,
        justifyContent: 'center'
    },
    btn: {
        backgroundColor: '#D13C35',
        borderRadius: 4,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 10
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: RALEWAY_BOLD
    }

})