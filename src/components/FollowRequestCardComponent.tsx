import { Avatar, Box, Button, HStack, VStack, Text, useColorModeValue, Pressable, useToast } from "native-base";
import { API_URL } from '@env';
import { useState } from "react";

export default function FollowRequestCardComponent(props) {

    const { request, navigation } = props;
    
    const [ handled, setHandled ] = useState(false);

    const ToastController = useToast();

    const approveRequest = () => {
        const ApprovalEndpoint = `${API_URL}api/followrequests/approve/${request._id}`;
        fetch(ApprovalEndpoint).then(() => {
            ToastController.show({
                render: () => {
                    return (
                        <Box backgroundColor="emerald.500" px={2} py={2}>
                            <Text color="light.50">{request.requester.displayName}'s follow request was accepted.</Text>
                        </Box>
                    );
                }
            });

            setHandled(true);
        }).catch(err => {
            ToastController.show({
                render: () => {
                    return (
                        <Box backgroundColor="red.500" px={2} py={2}>
                            <Text color="light.50">There was an error approving the request.</Text>
                        </Box>
                    );
                }
            })
        });
    }

    const denyRequest = () => {
        const DenyEndpoint = `${API_URL}api/followrequests?requester=${request.requester._id}&target=${request.target}`;
        fetch(DenyEndpoint, {
            method: 'DELETE'
        }).then(() => {
            ToastController.show({
                render: () => {
                    return (
                        <Box backgroundColor="emerald.500" px={2} py={2}>
                            <Text color="light.50">{request.requester.displayName}'s follow request was denied.</Text>
                        </Box>
                    );
                }
            });

            setHandled(true);
        }).catch(err => {
            ToastController.show({
                render: () => {
                    return (
                        <Box backgroundColor="red.500" px={2} py={2}>
                            <Text color="light.50">There was an error denying the request.</Text>
                        </Box>
                    );
                }
            })
        })
    }

    let card = null;

    if (request) {
        card = (
            <Pressable onPress={() => navigation.navigate('profile', {
                userId: request?.requester?._id
            })}>
                <Box backgroundColor={useColorModeValue("dark.100", "light.100")} px={4} py={4} rounded="lg">
                    <HStack space={2} justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
                        <HStack space={2}>
                            <Avatar shadow={2} size="md" fontSize="md" bgColor={useColorModeValue("light.200", "dark.200")} source={{ uri: "https://previews.dropbox.com/p/thumb/ABgaFcMCwD2Ov0_B1z3vcQV6P5U9_BcgA2m5zF1_npQv5rAC95UdB8VUf7-CIhfN3Xdctk1y2tzaoL4-U4piggjysgsGXwivdK3B_VIgJ7eMp9Mr5w2A_QYOWmCJnLmPQt_uW5VTzJaDK07CH4xlMRChBr-PnKyrxBBL1xX4M3wON5kY0bh7l1GksLyMqqgXTrmMc_dmJpBVedNpzqeJL1BECIUK9xILcZmSMRAxv0XSTv4hgkF1HNNgl95sQwdkESxjvAlI-p2lwK2Z9oNGjcCDWJNfWDnR9RTfnLNMI7PepLogCDMMQIMTdMtmfndyoJa0gtI3wSRBmR3Ev2H6D1vhaYKOf-XfK4vtUOXG-9NcAE7XBgUvHXbrx7I6Qh3sdQY/p.png" }}>
                                {request?.requester?.displayName.substring(0, 1)}
                                {
                                    request?.requester?.isVerified ?
                                        <Avatar.Badge bgColor="violet.400" flexDirection="row" alignItems="center" justifyContent="center" borderColor={useColorModeValue("dark.50", "light.100")}><Icon as={<MaterialIcons name="verified" />} size="xs" color="violet.300" /></Avatar.Badge>
                                        :
                                        null
                                }
                            </Avatar>
                            <VStack space={0}>
                                <Text color={useColorModeValue("light.50", "dark.50")} fontWeight="bold" fontSize="lg">{request?.requester?.displayName}</Text>
                                <Text color={useColorModeValue("light.400", "dark.400")} fontSize="sm">@{request?.requester?.accountHandle}</Text>
                            </VStack>
                        </HStack>
                        <HStack space={2}>
                            <Button disabled={handled} variant="solid" onPress={denyRequest} backgroundColor={ handled ? "muted.600" : "red.500" }><Text color="light.50">Deny</Text></Button>
                            <Button disabled={handled} variant="solid" onPress={approveRequest} backgroundColor={ handled ? "muted.600" : "emerald.500" }><Text color="light.50">Approve</Text></Button>
                        </HStack>
                    </HStack>
                </Box>
            </Pressable>
        )
    }

    return card;

}