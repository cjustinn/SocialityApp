import { Avatar, Box, Button, Divider, HStack, Icon, IconButton, Spinner, Text, useColorModeValue, useToast, VStack } from "native-base";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../services/User";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_URL } from '@env';
import { formatDate, formatTime, todayIsDayAfter, truncateNumber } from "../services/Utility";

export default function PostCardComponent(props) {

    const [loading, setLoading] = useState(true);
    const [postIsLiked, setPostIsLiked] = useState(false);
    const [post, setPost] = useState(undefined);
    const [isRegisteringLike, setIsRegisteringLike] = useState(false);

    const { user } = useContext(UserContext);

    const toastHandler = useToast();

    let card = null;

    const handleDelete = () => {
        const DeletePostEndpoint = `${API_URL}api/posts/${post?._id}`;
        fetch(DeletePostEndpoint, {
            method: 'DELETE'
        }).then(() => {
            toastHandler.show({
                render: () => {
                    return (
                        <Box backgroundColor="emerald.500" px={2} py={4}>
                            <Text color="light.50">Your post was successfully deleted!</Text>
                        </Box>
                    )
                }
            });
        }).catch(err => {
            toastHandler.show({
                render: () => {
                    return (
                        <Box backgroundColor="red.500" px={2} py={4}>
                            <Text color="light.50">There was a problem deleting your post!</Text>
                        </Box>
                    )
                }
            });
        })
    }

    const handleLike = () => {
        setIsRegisteringLike(true);

        if (postIsLiked) {

            const UnlikeEndpoint = `${API_URL}api/likes?userId=${user ? user._id : 'invalid_user_id'}&postId=${post._id}`;

            fetch(UnlikeEndpoint, {
                method: 'DELETE'
            }).then(() => {

                const PostLikesEndpoint = `${API_URL}api/likes/count/${post._id}`;
                fetch(PostLikesEndpoint).then(response => response.json()).then(data => {
                    setPost({ ...post, likes: data.data });
                }).catch(err => toastHandler.show({
                    render: () => {
                        return (
                            <Box backgroundColor="red.500" px={2} py={4}>
                                <Text color="light.50">There was a problem updating the post's like counter!</Text>
                            </Box>
                        );
                    }
                }));

                setPostIsLiked(false);
            }).catch(err => {
                toastHandler.show({
                    render: () => {
                        return (
                            <Box backgroundColor="red.500" px={2} py={4}>
                                <Text color="light.50">There was a problem unliking the post!</Text>
                            </Box>
                        );
                    }
                });
            });

        } else {

            const LikeEndpoint = `${API_URL}api/likes`;

            fetch(LikeEndpoint, {
                method: 'POST',
                body: JSON.stringify({
                    likeData: {
                        likedBy: user ? user._id : "invalid_user",
                        post: post ? post._id : "invalid_post"
                    }
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => {
                setPost({ ...post, likes: (post.likes + 1) });
                setPostIsLiked(true);
            }).catch(err => {
                toastHandler.show({
                    render: () => {
                        return (
                            <Box backgroundColor="red.500" px={2} py={4}>
                                <Text color="light.50">There was a problem liking the post!</Text>
                            </Box>
                        );
                    }
                });
            });

        }

        setIsRegisteringLike(false);
    }

    useEffect(() => {

        if (props.postData) {
            const StatusEndpoint = `${API_URL}api/likes/status?user=${user ? user._id : 'invalid_user'}&post=${props.postData._id}`;

            fetch(StatusEndpoint).then(data => data.json()).then(status => {
                setPostIsLiked(status.data);
                setPost(props.postData);

                setLoading(false);
            }).catch(err => {
                setLoading(false);
            });

        } else {
            setLoading(false);
        }

    }, []);

    if (loading) {
        card = (
            <HStack space={2}>
                <Spinner color={useColorModeValue("light.50", "dark.50")} size="lg" />
                <Text color={useColorModeValue("light.50", "dark.50")} fontWeight="bold" fontSize="xl">Loading...</Text>
            </HStack>
        );
    } else {

        if (post) {

            card = (
                <Box backgroundColor={useColorModeValue("dark.50", "light.100")} px={4} py={4} rounded="lg">
                    <VStack space={3}>
                        <HStack space={2}>
                            <Avatar shadow={2} size="md" fontSize="md" bgColor={useColorModeValue("light.200", "dark.200")} source={{ uri: "https://previews.dropbox.com/p/thumb/ABgaFcMCwD2Ov0_B1z3vcQV6P5U9_BcgA2m5zF1_npQv5rAC95UdB8VUf7-CIhfN3Xdctk1y2tzaoL4-U4piggjysgsGXwivdK3B_VIgJ7eMp9Mr5w2A_QYOWmCJnLmPQt_uW5VTzJaDK07CH4xlMRChBr-PnKyrxBBL1xX4M3wON5kY0bh7l1GksLyMqqgXTrmMc_dmJpBVedNpzqeJL1BECIUK9xILcZmSMRAxv0XSTv4hgkF1HNNgl95sQwdkESxjvAlI-p2lwK2Z9oNGjcCDWJNfWDnR9RTfnLNMI7PepLogCDMMQIMTdMtmfndyoJa0gtI3wSRBmR3Ev2H6D1vhaYKOf-XfK4vtUOXG-9NcAE7XBgUvHXbrx7I6Qh3sdQY/p.png" }}>
                                {post?.poster?.displayName.substring(0, 1)}
                                {
                                    post?.poster?.isVerified ?
                                        <Avatar.Badge bgColor="violet.400" flexDirection="row" alignItems="center" justifyContent="center" borderColor={useColorModeValue("dark.50", "light.100")}><Icon as={<MaterialIcons name="verified" />} size="xs" color="violet.300" /></Avatar.Badge>
                                        :
                                        null
                                }
                            </Avatar>
                            <VStack space={0}>
                                <Text color={useColorModeValue("light.50", "dark.50")} fontWeight="bold" fontSize="lg">{post?.poster?.displayName}</Text>
                                <Text color={useColorModeValue("light.400", "dark.400")} fontSize="sm">@{post?.poster?.accountHandle}</Text>
                            </VStack>
                        </HStack>

                        <Divider backgroundColor={useColorModeValue("light.700", "dark.600")} my={1} />

                        <Box backgroundColor="transparent" px={3} flexDirection="row">
                            <Text color={useColorModeValue("light.50", "dark.50")} fontSize="md">{post?.text}</Text>
                        </Box>

                        <Divider backgroundColor={useColorModeValue("light.700", "dark.600")} mt={1} />

                        <HStack space={3} justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
                            <HStack alignItems="center" space={2}>
                                {
                                    user?._id == post?.poster?._id ?
                                        <IconButton onPress={handleDelete} icon={<Icon color={useColorModeValue("light.400", "dark.400")} size="sm" as={<MaterialIcons name="delete" />} />} borderRadius="full" />
                                        : null
                                }
                                <Text color={useColorModeValue("light.400", "dark.400")}>{
                                    todayIsDayAfter(post?.postDate) ?
                                        formatDate(post?.postDate, 'MMM Do, YYYY')
                                        :
                                        `Today at ${formatTime(post?.postDate, 'h:mm A')}`
                                }</Text>
                            </HStack>
                            <HStack>
                                <Button disabled={isRegisteringLike || user?._id == post?.poster?._id} variant="unstyled" onPress={handleLike} rightIcon={<Icon as={<MaterialIcons name={postIsLiked ? "favorite" : "favorite-outline"} />} size="sm" color={postIsLiked ? "red.500" : useColorModeValue("light.400", "dark.400")} />}><Text color={useColorModeValue("light.400", "dark.400")} fontSize="md">{truncateNumber(post?.likes)}</Text></Button>
                            </HStack>
                        </HStack>
                    </VStack>
                </Box>
            );

        } else {
            card = (
                <Text color={useColorModeValue("light.50", "dark.50")} fontWeight="bold" fontSize="xl">Sorry, we couldn't load this post!</Text>
            );
        }

    }

    return card;
}