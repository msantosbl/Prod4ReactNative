import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HomePageComponent } from "../HomepageComponent/HomepageComponent";
import  DetailComponent  from "../DetailComponent/DetailComponent";
import { MediaComponent } from "@/components/MediaComponent/MediaComponent";

/* Crea el Tab Navigator
const Tab = createBottomTabNavigator();

/*const OurTabs: React.FC = () => {  // Asegúrate de que esté correctamente tipado
    return (
        <Tab.Navigator initialRouteName="Players" screenOptions={{ tabBarActiveTintColor: 'black' }}>
            <Tab.Screen
                name="Players"
                component={HomePageComponent}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="basketball" size={24} color="black" />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Detalles"
                component={DetailComponent}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="query-stats" size={24} color="black" />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Multimedia"
                component={MediaComponent}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="youtube" size={24} color="red" />
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

export default OurTabs;
*/