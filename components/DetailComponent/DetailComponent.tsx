import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {PlayersComponent} from "@/components/PlayerCrudComponent/CrudComponent";


export const DetailComponent = () => {
    return (
        <View>
            <Text>Detail</Text>
            <PlayersComponent></PlayersComponent>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});