import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { CrudComponent } from "@/components/PlayerCrudComponent/CrudComponent";

interface FirestoreItem {
  id: string;
  name: string;
  position: string;
}

interface FirestoreComponentProps {
  collectionName: string;
}

const FirestoreComponent: React.FC<FirestoreComponentProps> = ({ collectionName }) => {
  const [data, setData] = useState<FirestoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newPlayer, setNewPlayer] = useState<FirestoreItem>({ id: '', name: '', position: '' });

  useEffect(() => {
    fetchPlayers();
  }, [collectionName]);

  const fetchPlayers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const items: FirestoreItem[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreItem));
      setData(items);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = async () => {
    if (!newPlayer.name || !newPlayer.position) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    // Add player logic here (Firebase add function)
    // After adding:
    setNewPlayer({ id: '', name: '', position: '' });
    fetchPlayers(); // Refresh players
  };

  const editPlayer = async (id: string, updatedData: Partial<FirestoreItem>) => {
    try {
      await updateDoc(doc(db, collectionName, id), updatedData);
      fetchPlayers(); // Refresh players
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  const deletePlayer = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchPlayers(); // Refresh players
    } catch (error) {
      console.error("Error deleting player:", error);
    }
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
        {/* Add Player Form */}
        <View style={styles.form}>
          <TextInput
              style={styles.input}
              placeholder="Player Name"
              value={newPlayer.name}
              onChangeText={(text) => setNewPlayer((prev) => ({ ...prev, name: text }))}
          />
          <TextInput
              style={styles.input}
              placeholder="Player Position"
              value={newPlayer.position}
              onChangeText={(text) => setNewPlayer((prev) => ({ ...prev, position: text }))}
          />
          <Button title="Add Player" onPress={addPlayer} />
        </View>

        {/* Players List */}
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.title}>{item.name || 'Unnamed Player'}</Text>
                  <Text>{item.position || 'No position'}</Text>
                  {/* Edit/Delete actions */}
                  <CrudComponent
                      player={item}
                      onEdit={(updatedData) => editPlayer(item.id, updatedData)}
                      onDelete={() => deletePlayer(item.id)}
                  />
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
  form: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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

export default FirestoreComponent;
