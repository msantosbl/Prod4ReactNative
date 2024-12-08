import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, FlatList, Button, Alert, ImageBackground, Pressable, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as VideoPicker from 'expo-image-picker';
import {useNavigation} from "@react-navigation/native";
import { Video } from 'expo-av';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Importa de Firebase Storage
import { db, storage } from '../../FirebaseConfig'; // Usa tu configuración corregida

import firebase from "firebase/compat";


interface Player {
    id: string;
    name: string;
    position: string;
    image: string;
    video?: string | null;
}

export const MediaComponent = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'jugadores'));
            const playerList: Player[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
            setPlayers(playerList);
        } catch (error) {
            console.error('Error fetching players:', error);
        } finally {
            setLoading(false);
        }
    };

    const pickVideo = async (playerId: string) => {
        let result = await VideoPicker.launchImageLibraryAsync({
            mediaTypes: VideoPicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const source = { uri: result.assets[0].uri };

            const filename = source.uri.substring(source.uri.lastIndexOf('/') + 1);
            const storageRef = ref(storage, `video/${filename}`);

            try {
                const response = await fetch(source.uri);
                const blob = await response.blob();
                await uploadBytes(storageRef, blob);

                const downloadURL = await getDownloadURL(storageRef);

                // Actualizar Firestore con la URL del video
                const playerDoc = doc(db, "jugadores", playerId);
                await setDoc(playerDoc, { video: downloadURL }, { merge: true });

                Alert.alert("Éxito", "El video se subió correctamente.");
            } catch (error) {
                console.error("Error al subir el video:", error);
                Alert.alert("Error", "Hubo un problema al subir el video.");
            }
        } else {
            console.log("No se seleccionó ningún video");
        }
    };
    const navigation = useNavigation(); 

    const goToHomePage = () => {
    
        navigation.navigate("Players"); 
      };
      const exploreTeam = () => {
        console.log('Exploring our team');
      };
    const deleteVideo = async (playerId: string) => {
        try {
            const playerDoc = doc(db, 'jugadores', playerId);
            await setDoc(playerDoc, { video: null }, { merge: true });
            setPlayers(prev => prev.map(p => (p.id === playerId ? { ...p, video: null } : p)));
            Alert.alert('Success', 'Video deleted successfully');
        } catch (error) {
            console.error('Error deleting video:', error);
            Alert.alert('Error', 'Failed to delete video');
        }
    };

    const renderPlayerItem = ({ item }: { item: Player }) => (
        <View style={styles.playerCard}>
            <Image source={{ uri: item.image }} style={styles.playerImage} />
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerPosition}>{item.position}</Text>
            {item.video ? (
                <View>
                    <Text style={styles.videoLabel}>Best Play Video:</Text>
                    <Video
                        source={{ uri: item.video }}
                        style={styles.videoPlayer}
                        useNativeControls

                    />
                    <Button title="Edit Video" onPress={() => pickVideo(item.id)} />
                    <Button title="Delete Video" onPress={() => deleteVideo(item.id)} />
                </View>
            ) : (
                <Button title="Add Video" onPress={() => pickVideo(item.id)} />
            )}
        </View>
    );


    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
         <ImageBackground
        source={require('../../assets/images/baloncesto.jpg')} // Cambia "header-background.jpg" al nombre de tu imagen
        style={styles.headerBackground}
          />
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
        <TouchableOpacity style={styles.heroCta} onPress={exploreTeam}>
          <Text style={styles.heroCtaText}>Explore our Team</Text>
        </TouchableOpacity>
      </View>


      
      <Text style={styles.sectionTitle}>Team Media</Text>
            <FlatList
                data={players}
                keyExtractor={(item) => item.id}
                numColumns={3} // Tres columnas
                renderItem={renderPlayerItem}
                contentContainerStyle={styles.gridContainer}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBackground: {
    
    },
    headerContent: {
        alignItems: 'center',
    },
    logoImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff', 
        textAlign: 'center',
    },
    gridContainer: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    playerCard: {
        flex: 1,
        margin: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
    },
    playerImage: {
        width: 50, // Imagen más pequeña
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
    },
    playerName: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    playerPosition: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    videoLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    videoPlayer: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },

    heroContainer: {
        flexGrow: 1,
        padding: 16,
      },
      logo: {
        alignItems: 'center',
        marginBottom: 20,
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
        color: '#fff',
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
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff'
      }
});

