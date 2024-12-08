import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, FlatList, Button, Alert, ImageBackground, Pressable, Modal, TextInput } from 'react-native';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import { db } from '../../FirebaseConfig';
import { useVideoPlayer, VideoView } from "expo-video";

interface Player {
    id: string;
    name: string;
    position: string;
    image: string;
    video?: string | null;
}

const PlayerItem = ({ item, onEditVideo, onDeleteVideo, onPickVideo }: {
    item: Player;
    onEditVideo: (playerId: string, currentVideo: string) => void;
    onDeleteVideo: (playerId: string) => void;
    onPickVideo: (playerId: string) => void;
}) => {
    const videoPlayer = useVideoPlayer(item.video || '');

    const handlePlayVideo = () => {
        videoPlayer.play();
    };

    return (
        <View style={styles.playerCard}>
            <Image source={{ uri: item.image }} style={styles.playerImage} />
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerPosition}>{item.position}</Text>
            {item.video ? (
                <View>
                    <Text style={styles.videoLabel}>Best Play Video:</Text>
                    <VideoView player={videoPlayer} style={styles.videoPlayer} />
                    <Button title="Play Video" onPress={handlePlayVideo} />
                    <Button title="Edit Video" onPress={() => onEditVideo(item.id, item.video ?? '')} />
                    <Button title="Delete Video" onPress={() => onDeleteVideo(item.id)} />
                </View>
            ) : (
                <Button title="Add Video" onPress={() => onPickVideo(item.id)} />
            )}
        </View>
    );
};

export const MediaComponent = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();

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

    const handleAddVideo = async (playerId: string) => {
        if (videoUrl) {
            try {
                const playerDoc = doc(db, 'jugadores', playerId);
                await setDoc(playerDoc, { video: videoUrl }, { merge: true });

                setPlayers(prev => prev.map(player =>
                    player.id === playerId ? { ...player, video: videoUrl } : player
                ));

                setModalVisible(false);
                setVideoUrl('');
                Alert.alert('Éxito', 'El enlace del video se guardó correctamente.');
            } catch (error) {
                console.error('Error al guardar el video:', error);
                Alert.alert('Error', 'Hubo un problema al guardar el video.');
            }
        } else {
            Alert.alert('Error', 'Por favor, ingresa un enlace de video válido.');
        }
    };

    const deleteVideo = async (playerId: string) => {
        try {
            const playerDoc = doc(db, 'jugadores', playerId);
            await setDoc(playerDoc, { video: null }, { merge: true });
            setPlayers(prev => prev.map(p => (p.id === playerId ? { ...p, video: null } : p)));
            Alert.alert('Éxito', 'Video eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el video:', error);
            Alert.alert('Error', 'Hubo un problema al eliminar el video.');
        }
    };

    const pickVideo = (playerId: string) => {
        setEditingPlayer(players.find(p => p.id === playerId) || null);
        setVideoUrl('');
        setModalVisible(true);
    };

    const handleEditVideo = (playerId: string, currentVideo: string) => {
        setEditingPlayer(players.find(p => p.id === playerId) || null);
        setVideoUrl(currentVideo || '');
        setModalVisible(true);
    };

    const renderPlayerItem = ({ item }: { item: Player }) => (
        <PlayerItem
            item={item}
            onEditVideo={handleEditVideo}
            onDeleteVideo={deleteVideo}
            onPickVideo={pickVideo}
        />
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
                source={require('../../assets/images/baloncesto.jpg')}
                style={styles.headerBackground}
            />
            <Pressable style={styles.logo} onPress={() => navigation.navigate("Players")}>
                <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} />
            </Pressable>

            <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Welcome to Frontcraft BC</Text>
                <Text style={styles.heroSubtitle}>Where Passion Meets Excellence on the Court</Text>
            </View>

            <Text style={styles.sectionTitle}>Team Media</Text>
            <FlatList
                data={players}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={renderPlayerItem}
                contentContainerStyle={styles.gridContainer}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TextInput
                        value={videoUrl}
                        onChangeText={setVideoUrl}
                        placeholder="Pega el enlace del video"
                        style={styles.input}
                    />
                    <Button
                        title={editingPlayer ? "Save Changes" : "Add Video"}
                        onPress={() => handleAddVideo(editingPlayer?.id || '')}
                    />
                    <Button title="Cancel" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    logoImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    heroSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    headerBackground: {
        width: '100%',
        height: 150,
        marginBottom: 20,
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
        width: 50,
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
        width: 200,
        height: 120,
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
});
