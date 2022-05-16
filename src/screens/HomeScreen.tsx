import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl } from 'react-native';
import { Box, Text, View, HStack, useColorModeValue, IconButton, Icon, ScrollView, useToast, Spinner, Heading, VStack } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserContext } from "../services/User";
import { auth } from "../services/Firebase";
import { API_URL } from '@env';
import PostCardComponent from '../components/PostCardComponent';

export default function HomeScreen({ navigation }: any) {
    const { user, setUser } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const ToastController = useToast();
    let screen = null;

    if (auth.currentUser) {
        if (!user || auth.currentUser.uid !== user.uuid) {
            const APIEndpoint = `${API_URL}api/users/${auth.currentUser.uid}`;
            fetch(APIEndpoint).then(d => d.json()).then(result => {
                setUser(result.data);

                loadFeedPosts();
            }).catch(err => console.log(err));
        }
    }

    const handleRefresh = () => {
        setRefreshing(true);
        setLoading(true);

        loadFeedPosts();

        setRefreshing(false);
    }

    const loadFeedPosts = () => {
        const FeedEndpoint = `${API_URL}api/posts/feed/${user ? user._id : 'invalid_user'}`;
        fetch(FeedEndpoint).then(r => r.json()).then(feedPosts => {
            setPosts(feedPosts.data);
            setLoading(false);
        }).catch(err => {

            ToastController.show({
                render: () => {
                    return (
                        <Box rounded="lg" backgroundColor="red.400" px={2} py={2}>
                            <Text color="light.50">Could not load feed posts!</Text>
                        </Box>
                    );
                }
            });
            setLoading(false);

        })
    }

    useEffect(() => {
        loadFeedPosts();
    }, []);

    if (loading) {
        screen = (
            <HStack my={4} space={2} justifyContent="center" alignItems="center">
                <Spinner color="violet.400" size="lg" accessibilityLabel="Loading user's posts..." />
                <Heading color="violet.400" fontSize="lg">Loading</Heading>
            </HStack>
        )
    } else {
        screen = (
            <VStack space={4} mb={4}>
                {
                    posts.length > 0 ?
                    posts.map(_post => {
                        return <PostCardComponent darkBackgroundColor="dark.100" lightBackgroundColor="light.50" postData={_post} navigation={navigation}/>;
                    })
                    :
                    <Text color={useColorModeValue("light.700", "dark.600")} fontSize="lg">Your feed is empty!</Text>
                }
            </VStack>
        )
    }

    return (
        <SafeAreaView>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
                <View>
                    <HStack bg={useColorModeValue("dark.100", "light.50")} px="1" py="3" justifyContent="space-between" alignItems="center" w="100%" maxW="100%" mb={4}>
                        <HStack alignItems="center" ml={2}>
                            <Text color={useColorModeValue("light.50", "dark.50")}>Your Feed</Text>
                        </HStack>
                        <HStack alignItems="center">
                            <IconButton icon={<Icon as={<MaterialIcons name="settings" />} size="md" color="dark.400" />} onPress={() => navigation.navigate("options")} />
                        </HStack>
                    </HStack>

                    <View px={4}>
                        {screen}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}