import { Box, Center, HStack, Spinner, Text, useColorModeValue, useToast, VStack } from "native-base";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../services/User";
import { API_URL } from '@env';
import { ScrollView } from "react-native-gesture-handler";
import FollowRequestCardComponent from "../components/FollowRequestCardComponent";
import { RefreshControl } from "react-native";

export default function ActivityDetailsScreen({ navigation }) {

    const { user } = useContext(UserContext);

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const toastController = useToast();

    const refreshPage = () => {
        setIsRefreshing(true);

        fetchRequests();

        setIsRefreshing(false);
    }

    const fetchRequests = () => {
        const RequestsEndpoint = `${API_URL}api/followrequests/user/${user?._id}`;
        fetch(RequestsEndpoint).then(r => r.json()).then(req => {
            setRequests(req.data);
            setLoading(false);
        }).catch(err => {
            toastController.show({
                render: () => {
                    return (
                        <Box backgroundColor="red.500" px={2} py={2}>
                            <Text color="light.50">Could not retrieve your follow requests.</Text>
                        </Box>
                    )
                }
            });

            navigation.goBack();
        })
    }

    useEffect(() => {
        if (user) {

            fetchRequests();

        } else {
            toastController.show({
                render: () => {
                    return (
                        <Box backgroundColor="red.500" px={2} py={2}>
                            <Text color="light.50">Could not load the page.</Text>
                        </Box>
                    )
                }
            });

            navigation.goBack();
        }
    }, []);

    let page = null;

    if (loading) {
        page = (
            <SafeAreaView>
                <Center>
                    <HStack space={2}>
                        <Spinner size="lg" />
                        <Text color={useColorModeValue("light.50", "dark.50")} fontWeight="bold" fontSize="xl">Loading...</Text>
                    </HStack>
                </Center>
            </SafeAreaView>
        );
    } else {

        page = (
            <SafeAreaView>
                <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshPage}/>}>
                    {
                        requests.length > 0 ?
                            <VStack space={3} px={3}>
                                {
                                    requests.map(r => {
                                        return <FollowRequestCardComponent navigation={navigation} request={r} />
                                    })
                                }
                            </VStack>
                            :
                            <Center>
                                <Text color={useColorModeValue("light.50", "dark.50")} fontWeight="bold" fontSize="xl">You have no pending follow requests!</Text>
                            </Center>
                    }
                </ScrollView>
            </SafeAreaView>
        )

    }

    return page;

}