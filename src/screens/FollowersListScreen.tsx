import { useEffect } from "react";
import { useState } from "react";
import { API_URL } from '@env';
import { Box, Center, HStack, ScrollView, Spinner, useToast, VStack, useColorModeValue, Text } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";
import { UserContext } from "../services/User";
import UserFollowCardComponent from "../components/UserFollowCardComponent";
import { RefreshControl } from "react-native";

export default function FollowersListScreen({ route, navigation }) {

    const { userId, displayName, type } = route.params;
    const { user } = useContext(UserContext);

    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ isRefreshing, setRefreshing ] = useState(false);

    const toastController = useToast();

    const refreshList = () => {
        setRefreshing(true);
        setLoading(true);

        loadList();

        setLoading(false);
        setRefreshing(false);
    }

    const loadList = () => {
        const FollowerEndpoint = `${API_URL}api/follow?type=${type}&target=${userId}`;

        fetch(FollowerEndpoint).then(data => data.json()).then(result => {
            setFollowers(result.data);

        }).catch(err => {

            toastController.show({
                render: () => {
                    return (
                        <Box backgroundColor="red.500" px={2} py={2}>
                            <Text color="light.50">Could not load followers list!</Text>
                        </Box>
                    )
                }
            });

            navigation.goBack();

            setLoading(false);
        });
    }

    useEffect(() => {

        if (userId) {

            loadList();

            setLoading(false);

        } else {

            setLoading(false);

        }

    }, []);

    let card = null;

    if (loading) {
        card = (
            <Center>
                <HStack space={2}>
                    <Spinner color={useColorModeValue("light.50", "dark.50")} size="lg" />
                    <Text color={useColorModeValue("light.50", "dark.50")} fontWeight="bold" fontSize="xl">Loading...</Text>
                </HStack>
            </Center>
        );
    } else {

        card = (
            <SafeAreaView>
                <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshList}/>}>
                    {
                        followers.length > 0 ?
                            <VStack px={4} space={3}>
                                {
                                    followers.map(follow => {
                                        return <UserFollowCardComponent navigation={navigation} followDate={ follow.dateFollowed } target={ type === "following" ? follow.followed : follow.follower } />
                                    })
                                }
                            </VStack>
                            :
                            <Center>
                                <Text color={useColorModeValue("light.50", "dark.50")} fontWeight="bold" fontSize="xl">
                                    {
                                        type === 'following' ?
                                        `${user ? (user._id === userId ? `You are` : `${displayName} is`) : `${displayName} is`} not following anybody!`
                                        :
                                        `${user ? (user._id === userId ? `You have` : `${displayName} has`) : `${displayName} has`} no followers!`
                                    }
                                </Text>
                            </Center>
                    }
                </ScrollView>
            </SafeAreaView>
        )

    }

    return card;
}