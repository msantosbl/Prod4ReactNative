import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const MediaComponent = () => {
    const navigation = useNavigation(); // Hook de navegación

    const goToHomePage = () => {
        // @ts-ignore
        navigation.navigate("Players"); // Asegúrate de que el nombre coincida con el del Tab.Navigator
    };

    return (
        <ScrollView contentContainerStyle={styles.heroContainer}>
            {/* Encabezado con logo y texto */}
            <Pressable style={styles.logo} onPress={goToHomePage}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logoImage}
                    alt="Logo de Frontcraft BC"
                />
            </Pressable>

            <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Welcome to Frontcraft BC</Text>
                <Text style={styles.heroSubtitle}>Where Passion Meets Excellence on the Court</Text>
            </View>

            {/* Contenido específico del MediaComponent */}
            <View style={styles.content}>
                <Text>Media</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    heroContainer: {
        flexGrow: 1,
        padding: 16,
    },
    logo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    heroContent: {
        alignItems: 'center',
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
});
