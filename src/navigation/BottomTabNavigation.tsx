import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useColorModeValue } from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeNavigation from "./HomeNavigation";
import ProfileNavigation from "./ProfileNavigation";
import SearchScreen from "../screens/SearchScreen";
import { useContext } from "react";
import { UserContext } from "../services/User";

const BottomTabs = createBottomTabNavigator();

export default function BottomTabNavigation() {

    return (
        <BottomTabs.Navigator initialRouteName="Home" sceneContainerStyle={{ backgroundColor: useColorModeValue("#18181b", "#e7e5e4") }} screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            headerStyle: {
                backgroundColor: useColorModeValue("#27272a", "#fafaf9")
            },
            headerTitleAlign: 'left',
            tabBarStyle: {
                backgroundColor: useColorModeValue("#27272a", "#fafaf9"),
            }
        }}>
            <BottomTabs.Screen name="Home" component={HomeNavigation} options={{
                tabBarLabel: "Feed",
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size}/>
                ),
                tabBarActiveTintColor: "#a78bfa"
            }}/>
            <BottomTabs.Screen name="Profile" component={ProfileNavigation} options={{
                tabBarLabel: "Profile",
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="person" color={color} size={size}/>
                ),
                tabBarActiveTintColor: "#a78bfa"
            }}/>
            <BottomTabs.Screen name="Search" component={SearchScreen} options={{
                tabBarLabel: "Search",
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="magnify" color={color} size={size}/>
                ),
                tabBarActiveTintColor: "#a78bfa"
            }}/>
        </BottomTabs.Navigator>
    );
}