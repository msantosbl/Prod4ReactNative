import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

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
  fieldsToShow: string[]; // Prop para controlar qué campos mostrar
}

const FlatListComponent: React.FC<FlatListComponentProps> = ({ collectionName, fieldsToShow }) => {
  const [data, setData] = useState<FirestoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newPlayer, setNewPlayer] = useState<FirestoreItem>({ id: '', name: '', position: '', height: '', weight: '', ppg: '', apg: '', rpg: '', image: '' });
  const [filterTerm, setFilterTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const items: FirestoreItem[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreItem));
      setData(items);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = async () => {
    if (!newPlayer.name || !newPlayer.position) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    try {
      const playerDoc = doc(collection(db, collectionName));
      await setDoc(playerDoc, { ...newPlayer, id: playerDoc.id });
      setData(prev => [...prev, { ...newPlayer, id: playerDoc.id }]);
      setNewPlayer({ id: '', name: '', position: '', height: '', weight: '', ppg: '', apg: '', rpg: '', image: '' });
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  const deletePlayer = async (id: string) => {
    try {
      const playerDoc = doc(db, collectionName, id);
      await deleteDoc(playerDoc);
      setData(prev => prev.filter(player => player.id !== id));
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const filteredData = data.filter(player =>
    player.name.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const renderFormFields = () => {
    return (
      <>
        {fieldsToShow.includes('name') && (
          <TextInput
            style={styles.input}
            placeholder="Player Name"
            value={newPlayer.name}
            onChangeText={(text) => setNewPlayer((prev) => ({ ...prev, name: text }))}
          />
        )}
        {fieldsToShow.includes('position') && (
          <TextInput
            style={styles.input}
            placeholder="Player Position"
            value={newPlayer.position}
            onChangeText={(text) => setNewPlayer((prev) => ({ ...prev, position: text }))}
          />
        )}
        
        {fieldsToShow.includes('height') && (
          <TextInput
            style={styles.input}
            placeholder="Player Height"
            value={newPlayer.height}
            onChangeText={(text) => setNewPlayer((prev) => ({ ...prev, height: text }))}
          />
        )}
        {fieldsToShow.includes('weight') && (
          <TextInput
            style={styles.input}
            placeholder="Player Weight"
            value={newPlayer.weight}
            onChangeText={(text) => setNewPlayer((prev) => ({ ...prev, weight: text }))}
          />
        )}
        {fieldsToShow.includes('ppg') && (
          <TextInput
            style={styles.input}
            placeholder="Player PPG"
            value={newPlayer.ppg}
            onChangeText={(text) => setNewPlayer((prev) => ({ ...prev, ppg: text }))}
          />
        )}
        {fieldsToShow.includes('apg') && (
          <TextInput
            style={styles.input}
            placeholder="Player APG"
            value={newPlayer.apg}
            onChangeText={(text) => setNewPlayer((prev) => ({ ...prev, apg: text }))}
          />
        )}
        {fieldsToShow.includes('rpg') && (
          <TextInput
            style={styles.input}
            placeholder="Player RPG"
            value={newPlayer.rpg}
            onChangeText={(text) => setNewPlayer((prev) => ({ ...prev, rpg: text }))}
          />
        )}
        {fieldsToShow.includes('image') && (
          <TextInput
            style={styles.input}
            placeholder="Player Image"
            value={newPlayer.image}
            onChangeText={(text) => setNewPlayer((prev) => ({ ...prev, image: text }))}
          />
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
        keyExtractor={(item) => item.id}
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
});

export default FlatListComponent;
