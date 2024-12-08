import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';

export const MediaComponent = () => {
    const exploreTeam = () => {
        console.log('Exploring our team');
    };

    return (
        <ScrollView contentContainerStyle={styles.heroContainer}>
            {/* Encabezado con logo y texto */}
            <View style={styles.logo}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logoImage}
                    alt="Logo de Frontcraft BC"
                />
            </View>

            <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Welcome to Frontcraft BC</Text>
                <Text style={styles.heroSubtitle}>Where Passion Meets Excellence on the Court</Text>
                <TouchableOpacity style={styles.heroCta} onPress={exploreTeam}>
                    <Text style={styles.heroCtaText}>Explore our Team</Text>
                </TouchableOpacity>
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
    heroCta: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    heroCtaText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
});
