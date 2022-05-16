import React from 'react';
import { Text, View, useColorModeValue, ScrollView, Spinner, HStack, Heading, Divider, Box, VStack, FormControl, Input, IconButton, Icon, Button, useToast } from "native-base";
import { useContext, useEffect, useState } from "react";
import { TouchableWithoutFeedback, Keyboard, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from '@env';
import { UserContext } from "../services/User";
import PostCardComponent from "../components/PostCardComponent";
import { styles } from '../services/Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function SearchScreen({ navigation }: any) {

    const [loading, setLoading] = useState(true);
    const [explorePosts, setExplorePosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ errors, setErrors ] = useState({});

    const ToastController = useToast();
    const { user } = useContext(UserContext);
    let card = null;

    const validateSearch = () => {
        let success = true;
        let errs = {};

        if (!searchQuery || searchQuery?.trim()?.length === 0) {
            errs = { ...errs, searchQuery: "You must enter a search value!" };
            success = false;
        }

        setErrors(errs);
        return success;
    }

    const handleSearch = () => {
        if (validateSearch()) {

            const SearchEndpoint = `${API_URL}api/search?query=${searchQuery.trim().replace(' ', '%20')}`;
            fetch(SearchEndpoint).then(r => r.json()).then(searchResults => {
                navigation.navigate('searchresults', {
                    results: searchResults.data
                });
            }).catch(() => {
                ToastController.show({
                    render: () => {
                        return (
                            <Box backgroundColor="red.400" px={2} py={2} rounded="md">
                                <Text color="light.50">Could not complete search!</Text>
                            </Box>
                        )
                    }
                })
            })

        }
    }

    const handleRefresh = () => {
        setRefreshing(true);
        setLoading(true);

        loadExplorePosts();

        setLoading(false);
        setRefreshing(false);
    }

    const loadExplorePosts = () => {
        const ExplorePostsEndpoint = `${API_URL}api/posts/random?id=${user ? user._id : 'invalid_user'}`;
        fetch(ExplorePostsEndpoint).then(r => r.json()).then(posts => {
            setExplorePosts(posts.data);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        loadExplorePosts();

        setLoading(false);
    }, []);

    if (loading) {
        card = (
            <SafeAreaView>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
                    <View px={4} pt={4}>
                        <HStack my={4} space={2} justifyContent="center" alignItems="center">
                            <Spinner color="violet.400" size="lg" accessibilityLabel="Loading user's posts..." />
                            <Heading color="violet.400" fontSize="lg">Loading...</Heading>
                        </HStack>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    } else {
        card = (
            <SafeAreaView>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View mt={4}>
                            <View px={4} mb={4}>
                                <VStack space={2}>
                                    <Text color={useColorModeValue("light.50", "dark.50")} fontSize="2xl" fontWeight="bold">Search</Text>
                                    <FormControl isInvalid={'searchQuery' in errors} isRequired>
                                        <Input InputRightElement={<Icon onPress={handleSearch} as={<MaterialIcons name="search"/>} size={8} color={useColorModeValue("light.50", "dark.50")} mr={2}/>} value={searchQuery} selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} onChangeText={v => setSearchQuery(v)} type="text" placeholder="Account handle or display name..." variant="outline"/>
                                        {
                                            'searchQuery' in errors ?
                                            <FormControl.ErrorMessage>{errors.searchQuery}</FormControl.ErrorMessage>
                                            :
                                            null
                                        }
                                    </FormControl>
                                </VStack>
                            </View>

                            <Box py={4} backgroundColor={useColorModeValue("dark.100", "light.300")} borderRadius="2">
                                <VStack space={4} px={3}>
                                    <Text color={useColorModeValue("light.50", "dark.50")} fontSize="2xl" fontWeight="bold">Explore Posts</Text>
                                    
                                    {
                                        explorePosts.length > 0 ?
                                        explorePosts.map(p => {
                                            return (
                                                <PostCardComponent navigation={navigation} postData={p} />
                                            );
                                        })
                                        :
                                        <Text color={useColorModeValue("light.500", "dark.500")} fontSize="lg">We have no posts to show you!</Text>
                                    }
                                </VStack>
                            </Box>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </SafeAreaView>
        )
    }


    return card;

}