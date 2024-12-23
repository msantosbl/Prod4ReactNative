import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import {HomePageComponent} from "@/components/HomepageComponent/HomepageComponent";


import OurTabs from '@/components/TabBar/Navigation';
import {PlayersComponent} from "@/components/PlayerCrudComponent/CrudComponent"; // Ruta correcta
import {PermissionsAndroid} from 'react-native';
const App = () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  return (
    <NavigationContainer>
      <OurTabs /> {/* Aquí va tu Tab Navigator */}

        <HomePageComponent />
    </NavigationContainer>
  );
};

export default App;
