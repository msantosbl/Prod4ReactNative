import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { db } from '../../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import FirestoreComponent from '../Firebase/FlatlistComponent'; // Asegúrate de que el componente esté importado correctamente.

export const DetailComponent = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'jugadores'));
      const playersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(playersData);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

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

      {/* Flatlist para mostrar los jugadores */}
      <View style={styles.firestoreContainer}>
        <Text style={styles.sectionTitle}>Team Details</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.title}>{item.name}</Text>
              <Text>Position: {item.position}</Text>
              <Text>Age: {item.age} years old</Text>
              <Text>Heigh: {item.height}</Text>
              <Text>Weight: {item.weight}</Text>
              <Text>Ppg: {item.ppg}</Text>
              <Text>Apg: {item.apg}</Text>
              <Text>Rpg: {item.rpg}</Text>
            </View>
          )}
        />
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
    color: '#fff',
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
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
});

export default DetailComponent;
