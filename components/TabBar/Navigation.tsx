
import React from "react";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { NavigationContainer } from "@react-navigation/native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';




const Tab = createBottomTabNavigator();

function OurTabs(){
    return (
        <Tab.Navigator initialRouteName="Players"
        screenOptions={{
            tabBarActiveTintColor: 'yellow'
        }}>
        <Tab.Screen 
        name='Players' 
        component={HomeScreen}
        options={{
            tabBarIcon: ({color, size }) => (
                <Ionicons name="basketball" size={24} color="white" />
            ),
            headerShown: false,

        }}
        />
        <Tab.Screen 
        name='Stats' 
        component={HomeScreen}
        options={{
            tabBarIcon: ({ color, size}) => (
                <MaterialIcons name="query-stats" size={24} color="white" />
            )
        }}
        />
        <Tab.Screen 
        name='Multimedia' 
        component={HomeScreen}
        options={{
            tabBarIcon: ({ color, size}) => (
                <AntDesign name="youtube" size={24} color="red" />
            )
        }}
        />
        </Tab.Navigator>
    );
}

export default function Navigation() {
    return(
    <NavigationContainer>
        <OurTabs/>
    </NavigationContainer>
    );
}