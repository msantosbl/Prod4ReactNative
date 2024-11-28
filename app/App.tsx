// App.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import FirestoreComponent from '../components/Firebase/FlatlistComponent';
import { NavigationContainer } from '@react-navigation/native';
import OurTabs from '../components/TabBar/Navigation';  // Ruta relativa correcta




const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Pass your Firestore collection name as a prop */}
      <FirestoreComponent collectionName="jugadores" />
      <OurTabs />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

export {App};
