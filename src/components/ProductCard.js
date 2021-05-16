import React from "react";
import {View, Text, Image, StyleSheet} from "react-native";
import {RALEWAY_BOLD, RALEWAY_EXTRA_BOLD, RALEWAY_MEDIUM} from "../fonts/fontsTypes";

const ProductCard = ({productInfo}) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.imgWrapper}>
                <Image style={styles.img} source={{
                    uri: `https://namisushi.ru${productInfo.product.images[0]}`
                }}/>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{productInfo.product.title}</Text>
                <Text style={styles.description}>{productInfo.product.description}</Text>
                <View>
                    <Text style={styles.count}>Кол-во: {productInfo.count}</Text>
                    <Text style={styles.cost}>Сумма: {productInfo.cost} &#8381;</Text>
                </View>
            </View>
        </View>
    )
}

export default ProductCard

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 10,
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 4
    },
    imgWrapper: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#1B4965',
        width: 130,
        borderRadius: 16
    },
    img: {
        width: 100,
        height: 100
    },
    content: {
        marginLeft: 20
    },
    title: {
        fontSize: 18,
        fontFamily: RALEWAY_BOLD,
        color: '#1B4965'
    },
    description: {
        marginTop: 10,
        fontSize: 15,
        fontFamily: RALEWAY_MEDIUM,
        color: '#606060',
        lineHeight: 30,
        flex: 1
    },
    count: {
        fontSize: 15,
        fontFamily: RALEWAY_EXTRA_BOLD,
        color: '#606060'
    },
    cost: {
        fontSize: 18,
        fontFamily: RALEWAY_EXTRA_BOLD,
        color: '#1B4965',
    }

})