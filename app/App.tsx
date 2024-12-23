import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import {HomePageComponent} from "@/components/HomepageComponent/HomepageComponent";


const App = () => {
  return (
    <NavigationContainer>

        <HomePageComponent />
    </NavigationContainer>
  );
};

export default App;
