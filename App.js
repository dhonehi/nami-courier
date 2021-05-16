import React from 'react';

import {useFonts} from 'expo-font';

import Routes from "./src/router/Routes";

import {Provider} from "react-redux";

import configureStore from "./src/store/store";

const store = configureStore()

export default function App() {
    const [loaded] = useFonts({
        'Raleway-bold': require('./assets/fonts/Raleway/Raleway-Bold.ttf'),
        'Raleway-light': require('./assets/fonts/Raleway/Raleway-Light.ttf'),
        'Raleway-regular': require('./assets/fonts/Raleway/Raleway-Regular.ttf'),
        'Raleway-medium': require('./assets/fonts/Raleway/Raleway-Medium.ttf'),
        'Raleway-extra-bold': require('./assets/fonts/Raleway/Raleway-ExtraBold.ttf')
    });

    if (!loaded) {
        return null
    }

    return (
        <Provider store={store}>
            <Routes/>
        </Provider>
    )
}
