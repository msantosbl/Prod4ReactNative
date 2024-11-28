
import React from "react";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { NavigationContainer } from "@react-navigation/native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HomePageComponent } from "../HomepageComponent/HomepageComponent";




const Tab = createBottomTabNavigator();

function OurTabs(){
    return (
        <Tab.Navigator initialRouteName="Players"
        screenOptions={{
            tabBarActiveTintColor: 'black'
        }}>
        <Tab.Screen 
        name='Players' 
        component={HomePageComponent}
        options={{
            tabBarIcon: ({color, size }) => (
                <Ionicons name="basketball" size={24} color="black" />
            ),
            headerShown: false,

        }}
        />
        <Tab.Screen 
        name='Detalles' 
        component={HomePageComponent}
        options={{
            tabBarIcon: ({ color, size}) => (
                <MaterialIcons name="query-stats" size={24} color="black" />
            )
        }}
        />
        <Tab.Screen 
        name='Multimedia' 
        component={HomePageComponent}
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
};