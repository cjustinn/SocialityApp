import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorModeValue } from "native-base";
import LoginScreen from "../screens/LoginScreen";
import RegisterAccountScreen from "../screens/RegisterAccountScreen";

const Stack = createStackNavigator();

export default function AuthNavigation() {
    return (
        <Stack.Navigator initialRouteName="login" screenOptions={{
            headerShown: false,
            headerStyle: {
                backgroundColor: useColorModeValue("#e7e5e4", "#18181b")
            },
            headerTitleAlign: 'center',
            headerTransparent: true,
            cardStyle: { backgroundColor: useColorModeValue("#18181b", "#e7e5e4") }
        }}>
            <Stack.Screen name="login" component={LoginScreen}/>
            <Stack.Screen name="register" component={RegisterAccountScreen} options={{
                headerShown: true,
                headerTitle: "",
                headerTintColor: "#e7e5e4"
            }}/>
        </Stack.Navigator>
    )
}