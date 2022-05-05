import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, RefreshControl, ScrollView } from 'react-native';
import { useContext, useEffect, useRef, useState } from "react";
import { useColorModeValue, Text, HStack, View, Icon, Button, VStack, Avatar, Center, Box, Spinner, Heading, IconButton, AlertDialog, Pressable, theme, useToast } from "native-base";
import { UserContext } from "../services/User";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from "../services/Styles";
import { API_URL } from '@env';
import { truncateNumber } from "../services/Utility";
import PostCardComponent from "../components/PostCardComponent";
import { useIsFocused } from "@react-navigation/native";

export default function ProfileScreen({ route, navigation }: any) {
    const { userId } = route.params;
    const { user } = useContext(UserContext);

    const [currentUserProfile, setCurrentUserProfile] = useState(user && userId === user?._id);
    const [currentlyFollowing, setCurrentlyFollowing] = useState(false);
    const [currentlyRequested, setCurrentlyRequested] = useState(false);
    const [profileDetails, setProfileDetails] = useState(undefined);
    const [profileCounts, setProfileCounts] = useState<{}>(undefined);
    const [profilePosts, setProfilePosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [ alertBoxTitle, setAlertBoxTitle ] = useState(undefined);
    const [ alertBoxText, setAlertBoxText ] = useState(undefined);

    const [alertBoxOpen, setAlertBoxOpen] = useState(false);
    const cancelRef = useRef(null);
    const profileIsFocused = useIsFocused();
    const toastController = useToast();

    const closeAlertBox = () => setAlertBoxOpen(false);

    const unfollowUser = () => {
        if (currentlyFollowing) {
            const UnfollowEndpoint = `${API_URL}api/follow?following=${userId}&follower=${user?._id}`;

            fetch(UnfollowEndpoint, {
                method: 'DELETE'
            }).then(() => {
                setCurrentlyFollowing(false);
                loadUserDetails();
            }).catch(err => {
                console.log(`Unfollow Error: ${err}`);
            });

            closeAlertBox();
        } else if (!currentlyFollowing && currentlyRequested) {
            const RemoveRequestEndpoint = `${API_URL}api/followrequests?requester=${user ? user?._id : 'invalid_user'}&target=${userId}`;

            fetch(RemoveRequestEndpoint, {
                method: 'DELETE'
            }).then(() => {
                setCurrentlyRequested(false);
                loadUserDetails();
            }).catch(err => console.log(`Remove Request Error: ${err}`));

            closeAlertBox();
        }
    }

    const refreshPage = () => {
        setRefreshing(true);

        loadUserDetails();

        setRefreshing(false);
    }

    const toggleFollowStatus = () => {
        if (!currentUserProfile) {
            if (currentlyFollowing || currentlyRequested) {
                
                if (currentlyFollowing) {
                    setAlertBoxTitle(`Unfollow ${profileDetails?.displayName}?`);
                    setAlertBoxText(`Are you sure you want to unfollow this user? ${profileDetails?.isPrivate ? `Their account is private, you will no longer be able to view their posts.` : ''}`);
                } else {
                    setAlertBoxTitle(`Cancel Follow Request?`);
                    setAlertBoxText(`Are you sure you want to cancel your follow request to ${profileDetails?.displayName}? You cannot see their posts until they accept your request.`);
                }
                
                setAlertBoxOpen(true);
            } else {

                if (profileDetails.isPrivate) {

                    const FollowRequestEndpoint = `${API_URL}api/followrequests`;
                    fetch(FollowRequestEndpoint, {
                        method: 'POST',
                        body: JSON.stringify({
                            requestData: {
                                requester: user ? user?._id : 'invalid_user',
                                target: profileDetails._id
                            }
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(() => {
                        setCurrentlyRequested(true);
                        refreshPage();
                    }).catch(err => {
                        toastController.show({
                            render: () => {
                                return (
                                    <Box backgroundColor="red.500" px={2} py={2}>
                                        <Text color="light.50">Could not submit the follow request, please try again.</Text>
                                    </Box>
                                )
                            }
                        })
                    });

                } else {

                    const FollowEndpoint = `${API_URL}api/follow`;

                    fetch(FollowEndpoint, {
                        method: 'POST',
                        body: JSON.stringify({
                            followData: {
                                follower: user?._id,
                                followed: userId
                            }
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => response.json()).then(() => {
                        setCurrentlyFollowing(true);
                        refreshPage();
                    }).catch(err => console.log(`Follow Error: ${err}`));

                }

            }
        }
    }

    const loadUserDetails = () => {
        const PostsEndpoint = `${API_URL}api/posts/user/${userId}`;
        const CountsEndpoint = `${API_URL}api/profile/counts/${userId}`;

        setCurrentUserProfile(user ? (user?._id === userId ? true : false) : false);

        if (!currentUserProfile) {
            const DetailsEndpoint = `${API_URL}api/profile/${userId}`;
            const FollowedEndpoint = `${API_URL}api/follow/status?target=${userId}&current=${user?._id}`;

            // If NOT the current user's profile, check if the user is followed already or not.
            fetch(FollowedEndpoint).then(r => r.json()).then(data => {
                setCurrentlyFollowing(data.data);

                if (!data.data) {
                    const FollowRequestedEndpoint = `${API_URL}api/followrequests/status?requester=${user ? user?._id : 'invalid_user'}&target=${userId}`;

                    fetch(FollowRequestedEndpoint).then(r => r.json()).then(status => {
                        setCurrentlyRequested(status.data);
                    }).catch(err => console.log(`Follow Request Status Error: ${err}`));
                }
            }).catch(err => console.log(`Currently Following Error: ${err}`));

            // If NOT the current user's profile, get profile details.
            fetch(DetailsEndpoint).then(r => r.json()).then(data => {
                setProfileDetails(data.data);

                if (!data.data.isPrivate || (data.data.isPrivate && currentlyFollowing)) {
                    fetch(PostsEndpoint).then(r => r.json()).then(data => {
                        setProfilePosts(data.data);
                    }).catch(err => console.log(`Posts Error: ${err}`));
                }
            }).catch(err => console.log(`Profile Details Error: ${err}`));
        } else {
            setProfileDetails(user);

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
        if (profileIsFocused) {
            loadUserDetails();
        }
    }, [profileIsFocused]);

    useEffect(() => {

        loadUserDetails();

    }, []);

    return (
        <SafeAreaView>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshPage} />}>
                <HStack bg={useColorModeValue("dark.100", "light.50")} px="1" py="3" justifyContent="space-between" alignItems="center" w="100%" maxW="100%" mb={4}>
                    <HStack alignItems="center" ml={2}>
                        {
                            profileDetails?.isPrivate ? <Icon as={<MaterialIcons name="lock-outline" />} size="md" color={useColorModeValue("light.50", "dark.50")} /> : null
                        }
                        <Text color={useColorModeValue("light.50", "dark.50")} fontSize="lg"> {currentUserProfile ? user?.displayName : profileDetails?.displayName}</Text>
                    </HStack>
                    <HStack alignItems="center" space={3} mr={2}>
                        {
                            !currentUserProfile ?
                                <Button backgroundColor={currentlyFollowing ? "red.500" : (currentlyRequested ? "muted.500" : "violet.400")} onPress={toggleFollowStatus}>{currentlyFollowing ? "Unfollow" : (currentlyRequested ? "Requested" : "Follow")}</Button>
                                :
                                <>
                                    <IconButton onPress={() => navigation.navigate('activitydetails')} icon={<Icon as={<MaterialIcons name="inventory" />} size="md" color={useColorModeValue("light.50", "dark.50")} />} borderRadius="full" />
                                    <IconButton onPress={() => navigation.navigate('editprofile')} icon={<Icon as={<MaterialIcons name="edit" />} size="md" color={useColorModeValue("light.50", "dark.50")} />} borderRadius="full" />
                                    <IconButton onPress={() => navigation.navigate('createPost')} icon={<Icon as={<MaterialIcons name="add-circle-outline" />} size="md" color={useColorModeValue("light.50", "dark.50")} />} borderRadius="full" />
                                </>
                        }
                    </HStack>
                </HStack>

                <VStack my={2} w="100%" maxW="100%" space={2}>
                    <HStack w="100%" px={4} space={4} alignItems="center">
                        <Avatar shadow={2} size="2xl" fontSize="2xl" bgColor={useColorModeValue("light.200", "dark.200")} source={{ uri: "https://previews.dropbox.com/p/thumb/ABgaFcMCwD2Ov0_B1z3vcQV6P5U9_BcgA2m5zF1_npQv5rAC95UdB8VUf7-CIhfN3Xdctk1y2tzaoL4-U4piggjysgsGXwivdK3B_VIgJ7eMp9Mr5w2A_QYOWmCJnLmPQt_uW5VTzJaDK07CH4xlMRChBr-PnKyrxBBL1xX4M3wON5kY0bh7l1GksLyMqqgXTrmMc_dmJpBVedNpzqeJL1BECIUK9xILcZmSMRAxv0XSTv4hgkF1HNNgl95sQwdkESxjvAlI-p2lwK2Z9oNGjcCDWJNfWDnR9RTfnLNMI7PepLogCDMMQIMTdMtmfndyoJa0gtI3wSRBmR3Ev2H6D1vhaYKOf-XfK4vtUOXG-9NcAE7XBgUvHXbrx7I6Qh3sdQY/p.png" }}>
                            {profileDetails?.displayName.substring(0, 1)}
                            {
                                profileDetails?.isVerified ?
                                    <Avatar.Badge bgColor="violet.400" flexDirection="row" alignItems="center" justifyContent="center" borderColor={useColorModeValue("dark.50", "light.100")}><Icon as={<MaterialIcons name="verified" />} size="md" color="violet.300" /></Avatar.Badge>
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
                                    <Text fontFamily="heading" flex={1} flexWrap="wrap" color={useColorModeValue("light.400", "dark.400")} fontWeight="thin" fontSize="md">{profileDetails?.profileBio}</Text>
                                </View>
                            </Center>
                            :
                            null
                    }
                    <Center my={4}>
                        <HStack alignItems="center" space={5} alignContent="center" textAlign="center" px={20}>
                            <VStack space={2} alignItems="center" w="33%">
                                <Text color={useColorModeValue("light.100", "dark.100")} fontSize="sm" fontWeight="bold">Posts</Text>
                                <Text color={useColorModeValue("light.400", "dark.400")} fontSize="sm" fontWeight="normal">{truncateNumber(profileCounts?.posts)}</Text>
                            </VStack>
                            <Pressable w="34%" onPress={profileDetails?.isPrivate && !currentUserProfile && !currentlyFollowing ? null : () => navigation.navigate('followerlist', {
                                userId: profileDetails?._id,
                                displayName: profileDetails?.displayName,
                                type: 'follower'
                            })}>
                                <VStack space={2} alignItems="center">
                                    <Text color={useColorModeValue("light.100", "dark.100")} fontSize="sm" fontWeight="bold">Followers</Text>
                                    <Text color={useColorModeValue("light.400", "dark.400")} fontSize="sm" fontWeight="normal">{truncateNumber(profileCounts?.followers)}</Text>
                                </VStack>
                            </Pressable>
                            <Pressable w="33%" onPress={profileDetails?.isPrivate && !currentUserProfile && !currentlyFollowing ? null : () => navigation.navigate('followinglist', {
                                userId: profileDetails?._id,
                                displayName: profileDetails?.displayName,
                                type: 'following'
                            })}>
                                <VStack alignItems="center" space={2}>
                                    <Text color={useColorModeValue("light.100", "dark.100")} fontSize="sm" fontWeight="bold">Following</Text>
                                    <Text color={useColorModeValue("light.400", "dark.400")} fontSize="sm" fontWeight="normal">{truncateNumber(profileCounts?.following)}</Text>
                                </VStack>
                            </Pressable>
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
                                <View style={{ flex: 1 }}>
                                    {
                                        profileDetails?.isPrivate && !currentUserProfile && !currentlyFollowing ?
                                            <Center>
                                                <Text color={useColorModeValue("light.100", "dark.100")} fontSize="lg">{profileDetails?.displayName}'s profile is private!</Text>
                                            </Center>
                                            :
                                            (
                                                profilePosts.length > 0 ?
                                                    <VStack space={4}>
                                                        {
                                                            profilePosts.map(post => {
                                                                return <PostCardComponent postData={post} />
                                                            })
                                                        }
                                                    </VStack>
                                                    :
                                                    <Center>
                                                        <Text color={useColorModeValue("light.100", "dark.100")} fontSize="lg">{currentUserProfile ? `You have` : `${profileDetails?.displayName} has`} no posts!</Text>
                                                    </Center>
                                            )
                                    }
                                </View>
                        }
                    </Box>
                </VStack>
                <Center>
                    <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertBoxOpen} onClose={closeAlertBox}>
                        <AlertDialog.Content bgColor={useColorModeValue("dark.50", "light.50")}>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header bgColor={useColorModeValue("dark.50", "light.50")} borderBottomColor={useColorModeValue("dark.200", "light.50")}><Text color={useColorModeValue("light.100", "dark.100")} fontSize="lg" fontWeight="bold">{ alertBoxTitle }</Text></AlertDialog.Header>
                            <AlertDialog.Body bgColor={useColorModeValue("dark.100", "light.50")}>
                                <Text color={useColorModeValue("light.400", "dark.400")}>{ alertBoxText }</Text>
                            </AlertDialog.Body>
                            <AlertDialog.Footer bgColor={useColorModeValue("dark.100", "light.50")} borderTopColor={useColorModeValue("dark.200", "light.50")}>
                                <Button.Group space={4}>
                                    <Button variant="unstyled" onPress={closeAlertBox} ref={cancelRef}><Text color={useColorModeValue("light.200", "dark.100")}>Cancel</Text></Button>
                                    <Button backgroundColor="red.500" onPress={unfollowUser}>Unfollow</Button>
                                </Button.Group>
                            </AlertDialog.Footer>
                        </AlertDialog.Content>
                    </AlertDialog>
                </Center>
            </ScrollView>
        </SafeAreaView>
    )
}