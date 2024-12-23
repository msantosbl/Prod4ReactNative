import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import FlatListComponent from '../Firebase/FlatlistComponent';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const HomePageComponent: React.FC = () => {
  const exploreTeam = () => {
    console.log('Exploring our team');
  };

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('Token:', token);
    } catch (error) {
      console.error('Error getting token:', error);
    }
  }

  useEffect(() => {
  getToken();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.heroContainer}>
      {/* Encabezado con logo y texto */}
      <ImageBackground
        source={require('../../assets/images/baloncesto.jpg')} // Cambia "header-background.jpg" al nombre de tu imagen
        style={styles.headerBackground}
      />
      
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

      {/* Componente de Firestore */}
      <View style={styles.firestoreContainer}>
        <Text style={styles.sectionTitle}>Our Team</Text>
        <FlatListComponent collectionName="jugadores" fieldsToShow={['name', 'image', 'position', 'age', 'height', 'weight', 'ppg', 'apg', 'rpg']} />
      </View>
    </ScrollView>
  );
};

// Estilos
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
    color:'#fff',
    fontWeight: 'bold',
  },
  firestoreContainer: {
    marginTop: 20,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff'
  },
  headerBackground: {

  },
});
