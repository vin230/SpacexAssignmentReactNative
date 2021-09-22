import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function RenderItem({ item }) {
    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', }}>
                <Image style={styles.img} source={{ uri: item.links.mission_patch }} />
            </View>
            <View>
                <Text style={styles.txt}>Number: {item.flight_number}</Text>
                <Text style={styles.txt}>Mission_name: {item.mission_name}</Text>
                <Text style={styles.txt}>Launch_year: {item.launch_year}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex:1,
        //backgroundColor:'red',
        alignItems: 'center',
        //height: 125,
        width: 125,
        justifyContent: 'center',
        margin: 5,
        borderWidth: 0.5,
    },
    img: {
        height: 50,
        width: 50,
        alignSelf: 'center'
    },
})