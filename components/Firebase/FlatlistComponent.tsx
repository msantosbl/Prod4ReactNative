import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { firebase, db } from '../../FirebaseConfig';

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
}

interface FlatListComponentProps {
  collectionName: string;
  fieldsToShow: string[];
}

const FlatListComponent: React.FC<FlatListComponentProps> = ({ collectionName, fieldsToShow }) => {
  const [data, setData] = useState<FirestoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const items: FirestoreItem[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreItem));
      setData(items);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
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
    } catch (error) {
      console.error('Error adding player:', error);
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

  const editPlayer = (player: FirestoreItem) => {
    setEditingPlayer({ ...player });
  };

  const saveChanges = async () => {
    if (editingPlayer) {
      try {
        const playerDoc = doc(db, collectionName, editingPlayer.id);
        await setDoc(playerDoc, editingPlayer);
        setData(prev => prev.map(player => (player.id === editingPlayer.id ? editingPlayer : player)));
        setEditingPlayer(null);
      } catch (error) {
        console.error('Error saving changes:', error);
      }
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

  const filteredData = data.filter(player => player.name.toLowerCase().includes(filterTerm.toLowerCase()));

  const renderFormFields = () => {
    return fieldsToShow.map(field => (
        <TextInput
            key={field}
            style={styles.input}
            placeholder={`Player ${field.charAt(0).toUpperCase() + field.slice(1)}`}
            value={(newPlayer as any)[field]}
            onChangeText={text => setNewPlayer(prev => ({ ...prev, [field]: text }))}
        />
    ));
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
        <TextInput
            style={styles.input}
            placeholder="Filter by name"
            value={filterTerm}
            onChangeText={setFilterTerm}
        />
        <View style={styles.form}>
          {renderFormFields()}
          <Button title="Add Player" onPress={addPlayer} />
        </View>
        <FlatList
            data={filteredData}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemContent}>
                    {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.playerImage} />
                    ) : null}
                    <View style={styles.textContent}>
                      <Text style={styles.title}>{item.name}</Text>
                      <Text>{item.position}</Text>
                      <TouchableOpacity onPress={() => editPlayer(item)}>
                        <Text style={styles.actionText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deletePlayer(item.id)}>
                        <Text style={styles.actionText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
            )}
        />

        {editingPlayer && (
            <Modal transparent={true} animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Edit Player</Text>
                  {fieldsToShow.map(field => (
                      <TextInput
                          key={field}
                          style={styles.input}
                          placeholder={`Edit ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                          value={(editingPlayer as any)[field]}
                          onChangeText={text => setEditingPlayer(prev => ({ ...prev!, [field]: text }))}
                      />
                  ))}
                  <Button title="Pick Image" onPress={pickImage} />
                  {editingPlayer.image && (
                      <Image source={{ uri: editingPlayer.image }} style={styles.imagePreview} />
                  )}
                  <View style={styles.modalActions}>
                    <Button title="Cancel" onPress={() => setEditingPlayer(null)} />
                    <Button title="Save" onPress={saveChanges} />
                  </View>
                </View>
              </View>
            </Modal>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  itemContent: {
    flexDirection: 'row', // Para alinear imagen y texto horizontalmente
    alignItems: 'center',
  },
  playerImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 10, // Puedes ajustar el borderRadius si lo deseas
  },
  textContent: {
    flex: 1, // Esto asegura que el texto ocupe el espacio restante
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  form: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
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
  actionText: {
    color: 'blue',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default FlatListComponent;
