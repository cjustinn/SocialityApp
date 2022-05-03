import { createStackNavigator } from "@react-navigation/stack";
import { useColorModeValue } from "native-base";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import OptionsScreen from "../screens/OptionsScreen";

const Stack = createStackNavigator();

export default function HomeNavigation() {
    return (
        <Stack.Navigator initialRouteName="homeScreen" screenOptions={{
            headerShown: false,
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: useColorModeValue("#27272a", "#fafaf9")
            },
            headerTintColor: useColorModeValue("#fafaf9", "#18181b"),
            cardStyle: {
                backgroundColor: useColorModeValue("#18181b", "#e7e5e4")
            }
        }}>
            <Stack.Screen name="homeScreen" component={HomeScreen}/>
            <Stack.Screen name="options" component={OptionsScreen} options={{
                headerShown: true,
                headerTitle: "Options"
            }}/>
            <Stack.Screen name="profile" component={ProfileScreen} initialParams={{ userId: null }}/>
        </Stack.Navigator>
    )
}