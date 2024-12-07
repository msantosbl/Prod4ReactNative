import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

interface FirestoreItem {
  id: string;
  name: string;
  position: string;
}

const FlatListComponent: React.FC = () => {
  const [data, setData] = useState<FirestoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newPlayer, setNewPlayer] = useState<FirestoreItem>({ id: '', name: '', position: '' });
  const [filterTerm, setFilterTerm] = useState('');
  const [editedPlayer, setEditedPlayer] = useState<FirestoreItem | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'jugadores'));
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
    try {
      const playerDoc = doc(collection(db, 'jugadores'));
      await setDoc(playerDoc, { ...newPlayer, id: playerDoc.id });
      setData(prev => [...prev, { ...newPlayer, id: playerDoc.id }]);
      setNewPlayer({ id: '', name: '', position: '' });
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };


  const deletePlayer = async (id: string) => {
    try {
      const playerDoc = doc(db, 'jugadores', id);
      await deleteDoc(playerDoc);
      setData(prev => prev.filter(player => player.id !== id));
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const filteredData = data.filter(player =>
      player.name.toLowerCase().includes(filterTerm.toLowerCase())
  );

  if (loading) {
    return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        {/* Filter Section */}
        <TextInput
            style={styles.input}
            placeholder="Filter by name"
            value={filterTerm}
            onChangeText={setFilterTerm}
        />

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
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text>{item.position}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => setEditedPlayer(item)}>
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deletePlayer(item.id)}>
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            )}
        />

        {/* Edit Player Modal */}
        {editedPlayer && (
            <View style={styles.modal}>
              <TextInput
                  style={styles.input}
                  placeholder="Player Name"
                  value={editedPlayer.name}
                  onChangeText={(text) => setEditedPlayer({ ...editedPlayer, name: text })}
              />
              <TextInput
                  style={styles.input}
                  placeholder="Player Position"
                  value={editedPlayer.position}
                  onChangeText={(text) => setEditedPlayer({ ...editedPlayer, position: text })}
              />

              <Button title="Cancel" onPress={() => setEditedPlayer(null)} />
            </View>
        )}
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionText: {
    color: 'blue',
    marginHorizontal: 10,
  },
  modal: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
  },
});

export default FlatListComponent;
