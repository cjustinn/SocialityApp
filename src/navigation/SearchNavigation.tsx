import { createStackNavigator } from "@react-navigation/stack";

import SearchScreen from "../screens/SearchScreen";
import SearchResultsScreen from "../screens/SearchResultsScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { useColorModeValue } from "native-base";

const Stack = createStackNavigator();

export default function SearchNavigation() {
    return (
        <Stack.Navigator initialRouteName="search" screenOptions={{
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
            <Stack.Screen name="search" component={SearchScreen}/>
            <Stack.Screen name="searchresults" component={SearchResultsScreen} initialParams={{
                results: []
            }} options={{
                headerTitle: "Search Results",
                headerShown: true
            }}/>
            <Stack.Screen name="profile" component={ProfileScreen} initialParams={{
                userId: null
            }}/>
        </Stack.Navigator>
    )
}