import { createStackNavigator } from "@react-navigation/stack";
import { useColorModeValue } from "native-base";
import { useContext } from "react";

import ProfileScreen from "../screens/ProfileScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import FollowersListScreen from "../screens/FollowersListScreen";
import ActivityDetailsScreen from "../screens/ActivityDetailsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

import { UserContext } from "../services/User";

const Stack = createStackNavigator();

export default function ProfileNavigation() {
    const { user } = useContext(UserContext);

    return (
        <Stack.Navigator initialRouteName="userProfile" screenOptions={{
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

            <Stack.Screen name="userProfile" component={ProfileScreen} initialParams={{ userId: user ? user._id : null }}/>
            <Stack.Screen name="profile" component={ProfileScreen} initialParams={{ userId: user ? user._id : null }}/>
            <Stack.Screen name="createPost" component={CreatePostScreen} options={{
                headerTitle: "Create Post",
                headerShown: true
            }}/>
            <Stack.Screen name="followerlist" component={FollowersListScreen} initialParams={{ userId: null, displayName: null, type: 'follower' }} options={{
                headerTitle: "Followers",
                headerShown: true
            }}/>
            <Stack.Screen name="followinglist" component={FollowersListScreen} initialParams={{ userId: null, displayName: null, type: 'following' }} options={{
                headerTitle: "Following",
                headerShown: true
            }}/>
            <Stack.Screen name="activitydetails" component={ActivityDetailsScreen} options = {{
                headerTitle: "Activity",
                headerShown: true
            }}/>
            <Stack.Screen name="editprofile" component={EditProfileScreen} options={{
                headerTitle: "Edit Profile",
                headerShown: true
            }}/>
        </Stack.Navigator>
    )
}