import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, RefreshControl } from 'react-native';
import { useContext, useEffect, useRef, useState } from "react";
import { useColorModeValue, Text, HStack, View, Icon, Button, VStack, Avatar, Center, Divider, Box, Spinner, Heading, IconButton, AlertDialog } from "native-base";
import { UserContext } from "../services/User";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from "../services/Styles";
import { API_URL } from '@env';

export default function ProfileScreen({ route, navigation }: any) {
    const { userId } = route.params;
    const { user } = useContext(UserContext);

    const [currentUserProfile, setCurrentUserProfile] = useState(user && userId === user._id);
    const [currentlyFollowing, setCurrentlyFollowing] = useState(false);
    const [profileDetails, setProfileDetails] = useState(currentUserProfile ? (user ? user : undefined) : undefined);
    const [profileCounts, setProfileCounts] = useState<{}>(undefined);
    const [profilePosts, setProfilePosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ refreshing, setRefreshing ] = useState(false);

    const [alertBoxOpen, setAlertBoxOpen] = useState(false);
    const cancelRef = useRef(null);

    const closeAlertBox = () => setAlertBoxOpen(false);

    const unfollowUser = () => {
        const UnfollowEndpoint = `${API_URL}api/follow?following=${userId}&follower=${user._id}`;

        fetch(UnfollowEndpoint, {
            method: 'DELETE'
        }).then(() => {
            setCurrentlyFollowing(false);
            loadUserDetails();
        }).catch(err => {
            console.log(`Unfollow Error: ${err}`);
        });

        closeAlertBox();
    }

    const refreshPage = () => {
        setRefreshing(true);

        loadUserDetails();

        setRefreshing(false);
    }

    const toggleFollowStatus = () => {
        if (!currentUserProfile) {
            if (currentlyFollowing) {
                setAlertBoxOpen(true);
            } else {
                const FollowEndpoint = `${API_URL}api/follow`;

                fetch(FollowEndpoint, {
                    method: 'POST',
                    body: JSON.stringify({
                        followData: {
                            follower: user._id,
                            followed: userId
                        }
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json()).then(() => {
                    setCurrentlyFollowing(true);
                    loadUserDetails();
                }).catch(err => console.log(`Follow Error: ${err}`));
            }
        }
    }

    const loadUserDetails = () => {
        const PostsEndpoint = `${API_URL}api/posts/${userId}`;
        const CountsEndpoint = `${API_URL}api/profile/counts/${userId}`;

        if (!currentUserProfile) {
            const DetailsEndpoint = `${API_URL}api/profile/${userId}`;
            const FollowedEndpoint = `${API_URL}api/follow/status?target=${userId}&current=${user._id}`;

            // If NOT the current user's profile, get profile details.
            fetch(DetailsEndpoint).then(r => r.json()).then(data => {
                setProfileDetails(data.data);

                if (!data.data.isPrivate || (data.data.isPrivate && currentlyFollowing)) {
                    fetch(PostsEndpoint).then(r => r.json()).then(data => {
                        setProfilePosts(data.data);
                    }).catch(err => console.log(`Posts Error: ${err}`));
                }
            }).catch(err => console.log(`Profile Details Error: ${err}`));

            // If NOT the current user's profile, check if the user is followed already or not.
            fetch(FollowedEndpoint).then(r => r.json()).then(data => {
                setCurrentlyFollowing(data.data);
            }).catch(err => console.log(`Currently Following Error: ${err}`));
        } else {
            // Get user posts
            fetch(PostsEndpoint).then(r => r.json()).then(data => {
                setProfilePosts(data.data);
            }).catch(err => console.log(`Posts Error: ${err}`));
        }

        // Get user profile counts
        fetch(CountsEndpoint).then(r => r.json()).then(data => {
            setProfileCounts(data.data);
        }).catch(err => console.log(`Counts Error: ${err}`));

        setLoading(false);
    }

    useEffect(() => {

        loadUserDetails();

    }, []);

    return (
        <SafeAreaView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <HStack bg={useColorModeValue("dark.100", "light.50")} px="1" py="3" justifyContent="space-between" alignItems="center" w="100%" maxW="100%" mb={4}>
                        <HStack alignItems="center" ml={2}>
                            {
                                profileDetails?.isPrivate ? <Icon as={<MaterialIcons name="lock-outline" />} size="md" color={useColorModeValue("light.50", "dark.50")} /> : null
                            }
                            <Text color={useColorModeValue("light.50", "dark.50")} fontSize="lg"> {currentUserProfile ? user?.displayName : profileDetails?.displayName}</Text>
                        </HStack>
                        <HStack alignItems="center" mr={2}>
                            {
                                !currentUserProfile ?
                                    <Button backgroundColor={currentlyFollowing ? "red.500" : "violet.400"} onPress={toggleFollowStatus}>{currentlyFollowing ? "Unfollow" : "Follow"}</Button>
                                    :
                                    <>
                                        <IconButton icon={<Icon as={<MaterialIcons name="edit" />} size="md" color={useColorModeValue("light.50", "dark.50")} />} borderRadius="full" />
                                        <IconButton icon={<Icon as={<MaterialIcons name="add-circle-outline" />} size="md" color={useColorModeValue("light.50", "dark.50")} />} borderRadius="full" />
                                    </>
                            }
                        </HStack>
                    </HStack>

                    <VStack my={2} w="100%" maxW="100%" space={2}>
                        <HStack w="100%" px={4} space={4} alignItems="center">
                            <Avatar maxW="33%" shadow={2} size="2xl" fontSize="2xl" bgColor={useColorModeValue("light.200", "dark.200")} source={{ uri: "https://previews.dropbox.com/p/thumb/ABgaFcMCwD2Ov0_B1z3vcQV6P5U9_BcgA2m5zF1_npQv5rAC95UdB8VUf7-CIhfN3Xdctk1y2tzaoL4-U4piggjysgsGXwivdK3B_VIgJ7eMp9Mr5w2A_QYOWmCJnLmPQt_uW5VTzJaDK07CH4xlMRChBr-PnKyrxBBL1xX4M3wON5kY0bh7l1GksLyMqqgXTrmMc_dmJpBVedNpzqeJL1BECIUK9xILcZmSMRAxv0XSTv4hgkF1HNNgl95sQwdkESxjvAlI-p2lwK2Z9oNGjcCDWJNfWDnR9RTfnLNMI7PepLogCDMMQIMTdMtmfndyoJa0gtI3wSRBmR3Ev2H6D1vhaYKOf-XfK4vtUOXG-9NcAE7XBgUvHXbrx7I6Qh3sdQY/p.png" }}>
                                {profileDetails?.displayName.substring(0, 1)}
                                {
                                    profileDetails?.isVerified ?
                                    <Avatar.Badge bgColor="violet.400" flexDirection="row" alignItems="center" justifyContent="center" borderColor={ useColorModeValue("dark.50", "light.100") }><Icon as={<MaterialIcons name="verified"/>} size="md" color="violet.300"/></Avatar.Badge>
                                    :
                                    null
                                }
                            </Avatar>
                            <VStack w="67%">
                                <HStack space={1}>
                                    <Text color={useColorModeValue("light.50", "dark.50")} fontWeight="bold" fontSize="2xl">{profileDetails?.displayName}</Text>
                                </HStack>
                                <Text color={useColorModeValue("light.400", "dark.400")} fontWeight="thin" fontSize="lg">@{profileDetails?.accountHandle}</Text>
                            </VStack>
                        </HStack>

                        {
                            profileDetails?.profileBio ?
                            <Center mt={2}>
                                <View flexDirection="row" px={4}>
                                    <Text fontFamily="heading" flex={1} flexWrap="wrap" color={useColorModeValue("light.400", "dark.400")} fontWeight="thin" fontSize="md">{ profileDetails?.profileBio }</Text>
                                </View>
                            </Center>
                            :
                            null
                        }
                        <Center my={4}>
                            <HStack alignItems="center" space={5} alignContent="center" textAlign="center" px={20}>
                                <VStack space={2} alignItems="center" w="33%">
                                    <Text color={useColorModeValue("light.100", "dark.100")} fontSize="sm" fontWeight="bold">Posts</Text>
                                    <Text color={useColorModeValue("light.400", "dark.400")} fontSize="sm" fontWeight="normal">{profileCounts?.posts}</Text>
                                </VStack>
                                <VStack space={2} alignItems="center" w="34%">
                                    <Text color={useColorModeValue("light.100", "dark.100")} fontSize="sm" fontWeight="bold">Followers</Text>
                                    <Text color={useColorModeValue("light.400", "dark.400")} fontSize="sm" fontWeight="normal">{profileCounts?.followers}</Text>
                                </VStack>
                                <VStack space={2} alignItems="center" w="33%">
                                    <Text color={useColorModeValue("light.100", "dark.100")} fontSize="sm" fontWeight="bold">Following</Text>
                                    <Text color={useColorModeValue("light.400", "dark.400")} fontSize="sm" fontWeight="normal">{profileCounts?.following}</Text>
                                </VStack>
                            </HStack>
                        </Center>

                        <Box style={styles.containerUnrounded} backgroundColor={useColorModeValue("dark.100", "light.300")} borderTopColor={useColorModeValue("dark.300", "light.300")} borderTopWidth={2}>
                            {
                                loading ?
                                    <HStack my={4} space={2} justifyContent="center" alignItems="center">
                                        <Spinner color="violet.400" size="lg" accessibilityLabel="Loading user's posts..." />
                                        <Heading color="violet.400" fontSize="lg">Loading</Heading>
                                    </HStack>
                                    :
                                    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshPage}/>}>
                                        {
                                            profileDetails?.isPrivate && !currentUserProfile && !currentlyFollowing ?
                                            <Center>
                                                <Text color={useColorModeValue("light.100", "dark.100")} fontSize="lg">{profileDetails?.displayName}'s profile is private!</Text>
                                            </Center>
                                            :
                                            (
                                                profilePosts.length > 0 ?
                                                <Center>
                                                    <Text color={useColorModeValue("light.100", "dark.100")} fontSize="lg">{currentUserProfile ? `You have` : `${profileDetails?.displayName} has`} posts!</Text>
                                                </Center>
                                                :
                                                <Center>
                                                    <Text color={useColorModeValue("light.100", "dark.100")} fontSize="lg">{currentUserProfile ? `You have` : `${profileDetails?.displayName} has`} no posts!</Text>
                                                </Center>
                                            )
                                        }
                                    </ScrollView>
                            }
                        </Box>
                    </VStack>
                    <Center>
                        <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertBoxOpen} onClose={closeAlertBox}>
                            <AlertDialog.Content bgColor={ useColorModeValue("dark.50", "light.50") }>
                                <AlertDialog.CloseButton />
                                <AlertDialog.Header bgColor={ useColorModeValue("dark.50", "light.50") } borderBottomColor={ useColorModeValue("dark.200", "light.50") }><Text color={useColorModeValue("light.100", "dark.100")} fontSize="lg" fontWeight="bold">Unfollow {profileDetails?.displayName}?</Text></AlertDialog.Header>
                                <AlertDialog.Body bgColor={ useColorModeValue("dark.100", "light.50") }>
                                    <Text color={useColorModeValue("light.400", "dark.400")}>Are you sure you want to unfollow this user? {profileDetails?.isPrivate ? `Their account is private, you will no longer be able to view their posts.` : ''}</Text>
                                </AlertDialog.Body>
                                <AlertDialog.Footer bgColor={ useColorModeValue("dark.100", "light.50") } borderTopColor={ useColorModeValue("dark.200", "light.50") }>
                                    <Button.Group space={4}>
                                        <Button variant="unstyled" onPress={closeAlertBox} ref={cancelRef}><Text color={useColorModeValue("light.200", "dark.100")}>Cancel</Text></Button>
                                        <Button backgroundColor="red.500" onPress={unfollowUser}>Unfollow</Button>
                                    </Button.Group>
                                </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>
                    </Center>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}