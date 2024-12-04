import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { HomePageComponent } from '../../components/HomepageComponent/HomepageComponent'; // Tu componente de la página de inicio

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
    
      <HomePageComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1, // Permite que ScrollView ocupe todo el espacio disponible
  },
});
