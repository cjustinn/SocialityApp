import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";

const BottomTabs = createBottomTabNavigator();

export default function BottomTabNavigation() {
    return (
        <BottomTabs.Navigator initialRouteName="Home" screenOptions={{
            tabBarShowLabel: false,
            headerShown: true,
            headerStyle: {
                backgroundColor: "#fff"
            },
            headerTitleAlign: 'left'
        }}>
            <BottomTabs.Screen name="Home" component={HomeScreen} options={{
                tabBarLabel: "Feed",
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size}/>
                )
            }}/>
            <BottomTabs.Screen name="Profile" component={ProfileScreen} options={{
                tabBarLabel: "Profile",
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="cup" color={color} size={size}/>
                )
            }}/>
        </BottomTabs.Navigator>
    );
}