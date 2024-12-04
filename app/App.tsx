import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import OurTabs from '@/components/TabBar/Navigation';
import {PlayersComponent} from "@/components/PlayerCrudComponent/CrudComponent"; // Ruta correcta

const App = () => {
  return (
    <NavigationContainer>
      <OurTabs /> {/* Aquí va tu Tab Navigator */}

    </NavigationContainer>
  );
};

export default App;
