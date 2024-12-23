import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/app';
import 'firebase/storage';

interface FirestoreItem {
  id: string;
  name: string;
  position: string;
  height: string;
  weight: string;
  ppg: string;
  apg: string;
  rpg: string;
  image: string;
  video?: string | null;
}

const collectionName = 'jugadores';

const FlatListComponent: React.FC = () => {
  const [data, setData] = useState<FirestoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlayer, setSelectedPlayer] = useState<FirestoreItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlayer, setNewPlayer] = useState<FirestoreItem>({
    id: '',
    name: '',
    position: '',
    height: '',
    weight: '',
    ppg: '',
    apg: '',
    rpg: '',
    image: '',
  });
  const [editingPlayer, setEditingPlayer] = useState<FirestoreItem | null>(null);
  const [filterTerm, setFilterTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [addPlayerModalVisible, setAddPlayerModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const items: FirestoreItem[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as FirestoreItem));
      setData(items);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSelect = (player: FirestoreItem) => {
    setSelectedPlayer(player);
    setModalVisible(true);
  };

  const addPlayer = async () => {
    if (!newPlayer.name || !newPlayer.position) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
    try {
      const playerDoc = doc(collection(db, collectionName));
      await setDoc(playerDoc, { ...newPlayer, id: playerDoc.id });
      setData(prev => [...prev, { ...newPlayer, id: playerDoc.id }]);
      setNewPlayer({
        id: '',
        name: '',
        position: '',
        height: '',
        weight: '',
        ppg: '',
        apg: '',
        rpg: '',
        image: '',
      });
      setAddPlayerModalVisible(false); // Close modal after adding
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  const editPlayer = (player: FirestoreItem) => {
    setEditingPlayer({ ...player }); // Set the player to be edited
    setAddPlayerModalVisible(true); // Open the modal for editing
  };

  const saveChanges = async () => {
    if (editingPlayer) {
      try {
        const playerDoc = doc(db, collectionName, editingPlayer.id);
        await setDoc(playerDoc, editingPlayer); // Update player info in Firestore
        setData(prev =>
            prev.map(player => (player.id === editingPlayer.id ? editingPlayer : player))
        );
        setEditingPlayer(null); // Reset editing player state
        setAddPlayerModalVisible(false); // Close the modal after saving
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    }
  };

  const deletePlayer = async (id: string) => {
    try {
      const playerDoc = doc(db, collectionName, id);
      await deleteDoc(playerDoc);
      setData(prev => prev.filter(player => player.id !== id));
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const source = { uri: result.assets[0].uri };
      if (editingPlayer) {
        setEditingPlayer(prev => ({ ...prev!, image: source.uri }));
      } else {
        setNewPlayer(prev => ({ ...prev, image: source.uri }));
      }
    } else {
      console.log('No image selected');
    }
  };

  const uploadImage = async () => {
    if (!newPlayer.image) {
      Alert.alert('Error', 'No image selected for upload');
      return;
    }
    setUploading(true);
    try {
      const response = await fetch(newPlayer.image);
      const blob = await response.blob();
      const filename = newPlayer.image.substring(newPlayer.image.lastIndexOf('/') + 1);
      const storageRef = firebase.storage().ref().child(filename);
      await storageRef.put(blob);
      const downloadURL = await storageRef.getDownloadURL();
      setNewPlayer(prev => ({ ...prev, image: downloadURL }));
      Alert.alert('Success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Image upload failed:', error);
    }
    setUploading(false);
  };

  const filteredData = data.filter(player => player.name.toLowerCase().includes(filterTerm.toLowerCase()));

  const renderFormFields = () => {
    return (
        <>
          <TextInput
              style={styles.input}
              placeholder="Player Name"
              value={editingPlayer ? editingPlayer.name : newPlayer.name}
              onChangeText={text => {
                if (editingPlayer) {
                  setEditingPlayer(prev => ({ ...prev!, name: text }));
                } else {
                  setNewPlayer(prev => ({ ...prev, name: text }));
                }
              }}
          />
          <TextInput
              style={styles.input}
              placeholder="Player Position"
              value={editingPlayer ? editingPlayer.position : newPlayer.position}
              onChangeText={text => {
                if (editingPlayer) {
                  setEditingPlayer(prev => ({ ...prev!, position: text }));
                } else {
                  setNewPlayer(prev => ({ ...prev, position: text }));
                }
              }}
          />
          <TextInput
              style={styles.input}
              placeholder="Height"
              value={editingPlayer ? editingPlayer.height : newPlayer.height}
              onChangeText={text => {
                if (editingPlayer) {
                  setEditingPlayer(prev => ({ ...prev!, height: text }));
                } else {
                  setNewPlayer(prev => ({ ...prev, height: text }));
                }
              }}
          />
          <TextInput
              style={styles.input}
              placeholder="Weight"
              value={editingPlayer ? editingPlayer.weight : newPlayer.weight}
              onChangeText={text => {
                if (editingPlayer) {
                  setEditingPlayer(prev => ({ ...prev!, weight: text }));
                } else {
                  setNewPlayer(prev => ({ ...prev, weight: text }));
                }
              }}
          />
          <TextInput
              style={styles.input}
              placeholder="PPG"
              value={editingPlayer ? editingPlayer.ppg : newPlayer.ppg}
              onChangeText={text => {
                if (editingPlayer) {
                  setEditingPlayer(prev => ({ ...prev!, ppg: text }));
                } else {
                  setNewPlayer(prev => ({ ...prev, ppg: text }));
                }
              }}
          />
          <TextInput
              style={styles.input}
              placeholder="APG"
              value={editingPlayer ? editingPlayer.apg : newPlayer.apg}
              onChangeText={text => {
                if (editingPlayer) {
                  setEditingPlayer(prev => ({ ...prev!, apg: text }));
                } else {
                  setNewPlayer(prev => ({ ...prev, apg: text }));
                }
              }}
          />
          <TextInput
              style={styles.input}
              placeholder="RPG"
              value={editingPlayer ? editingPlayer.rpg : newPlayer.rpg}
              onChangeText={text => {
                if (editingPlayer) {
                  setEditingPlayer(prev => ({ ...prev!, rpg: text }));
                } else {
                  setNewPlayer(prev => ({ ...prev, rpg: text }));
                }
              }}
          />
          {editingPlayer?.image && (
              <Image source={{ uri: editingPlayer.image }} style={styles.imagePreview} />
          )}
          {newPlayer.image && !editingPlayer && (
              <Image source={{ uri: newPlayer.image }} style={styles.imagePreview} />
          )}
          <Button title="Pick Image" onPress={pickImage} />
          <Button title="Upload Image" onPress={uploadImage} disabled={uploading} />
        </>
    );
  };

  if (loading) {
    return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Button title="Add Player" onPress={() => setAddPlayerModalVisible(true)} />

        <TextInput
            style={styles.input}
            placeholder="Filter by name"
            value={filterTerm}
            onChangeText={setFilterTerm}
        />
        <FlatList
            data={filteredData}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={styles.item}>
                  <TouchableOpacity onPress={() => handlePlayerSelect(item)}>
                    <Image source={{ uri: item.image }} style={styles.thumbnail} />
                    <Text>{item.name}</Text>
                    <Text>{item.position}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editPlayer(item)}>
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deletePlayer(item.id)}>
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
            )}
        />

        {addPlayerModalVisible && (
            <Modal transparent={true} animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {editingPlayer ? 'Edit Player' : 'Add Player'}
                  </Text>
                  {renderFormFields()}
                  <Button title="Save" onPress={editingPlayer ? saveChanges : addPlayer} />
                  <Button title="Cancel" onPress={() => setAddPlayerModalVisible(false)} />
                </View>
              </View>
            </Modal>
        )}

        {selectedPlayer && (
            <Modal visible={modalVisible} animationType="slide " onRequestClose={() => setModalVisible(false)}>
              <View style={styles.modalContainer}>
                <Text>{selectedPlayer.name}</Text>
                <Text>Position: {selectedPlayer.position}</Text>
                <Text>Height: {selectedPlayer.height}</Text>
                <Text>Weight: {selectedPlayer.weight}</Text>
                <Text>PPG: {selectedPlayer.ppg}</Text>
                <Text>APG: {selectedPlayer.apg}</Text>
                <Text>RPG: {selectedPlayer.rpg}</Text>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </Modal>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  item: {
    flex: 1,
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  actionText: {
    color: 'red',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default FlatListComponent;
