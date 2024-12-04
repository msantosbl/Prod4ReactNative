import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router'; // Si aún necesitas este import, de lo contrario elimínalo
import { IconSymbol } from '@/components/ui/IconSymbol'; // Lo puedes eliminar si no usas iconos personalizados
import { Colors } from '@/constants/Colors'; // También puedes eliminar esto si no lo necesitas
import OurTabs from '@/components/TabBar/Navigation'; // Ruta a tu archivo de navegación personalizado
import { NavigationContainer } from '@react-navigation/native';

export default function TabLayout() {
  return (

      <OurTabs />  
 
   
  );
}

