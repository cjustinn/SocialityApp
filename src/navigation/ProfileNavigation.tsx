import { createStackNavigator } from "@react-navigation/stack";
import { useColorModeValue } from "native-base";
import { useContext } from "react";

import ProfileScreen from "../screens/ProfileScreen";
import { UserContext } from "../services/User";

const Stack = createStackNavigator();

export default function ProfileNavigation() {
    const { user } = useContext(UserContext);

    return (
        <Stack.Navigator initialRouteName="profileScreen" screenOptions={{
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

            <Stack.Screen name="profileScreen" component={ProfileScreen} initialParams={{ userId: user ? user._id : null }}/>

        </Stack.Navigator>
    )
}