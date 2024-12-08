import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, TextInput, Button, Alert, TouchableOpacity, Image } from 'react-native';
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const source = { uri: result.assets[0].uri };
      setNewPlayer(prev => ({ ...prev, image: source.uri }));
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
          {fieldsToShow.map(field => (
              <TextInput
                  key={field}
                  style={styles.input}
                  placeholder={`Player ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                  value={(newPlayer as any)[field]}
                  onChangeText={text => setNewPlayer(prev => ({ ...prev, [field]: text }))}
              />
          ))}
          {fieldsToShow.includes('image') && (
              <View style={styles.imageUploader}>
                <Button title="Pick Image" onPress={pickImage} />
                {newPlayer.image ? <Image source={{ uri: newPlayer.image }} style={styles.imagePreview} /> : null}
                <Button title="Upload Image" onPress={uploadImage} disabled={uploading} />
              </View>
          )}
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
                  <Text style={styles.title}>{item.name}</Text>
                  <Text>{item.position}</Text>
                  <TouchableOpacity onPress={() => deletePlayer(item.id)}>
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
            )}
        />
      </View>
  );
};

const styles = StyleSheet.create({
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
    color: 'red',
  },
  imageUploader: {
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default FlatListComponent;
