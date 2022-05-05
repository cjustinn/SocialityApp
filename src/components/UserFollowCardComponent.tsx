import { Avatar, Box, HStack, Text, VStack, useColorModeValue, Pressable, Icon } from "native-base";
import { useEffect } from "react";
import { useState } from "react";
import { formatDate } from "../services/Utility";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function UserFollowCardComponent(props) {

    const { target, followDate, navigation } = props;
    const [followUser, setFollowUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (target) {

            setFollowUser(target);
            setLoading(false);

        } else {
            setLoading(false);
        }

    }, []);

    let card = null;

    if (!loading && followUser) {

        card = (
            <Pressable onPress={ () => navigation.navigate('profile', {
                userId: target?._id
            }) }>
                <Box backgroundColor={useColorModeValue("dark.100", "light.50")} px={4} py={4} rounded="lg">
                    <HStack space={2} justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
                        <HStack space={2}>
                            <Avatar shadow={2} size="md" fontSize="md" bgColor={useColorModeValue("light.200", "dark.200")} source={{ uri: "https://previews.dropbox.com/p/thumb/ABgaFcMCwD2Ov0_B1z3vcQV6P5U9_BcgA2m5zF1_npQv5rAC95UdB8VUf7-CIhfN3Xdctk1y2tzaoL4-U4piggjysgsGXwivdK3B_VIgJ7eMp9Mr5w2A_QYOWmCJnLmPQt_uW5VTzJaDK07CH4xlMRChBr-PnKyrxBBL1xX4M3wON5kY0bh7l1GksLyMqqgXTrmMc_dmJpBVedNpzqeJL1BECIUK9xILcZmSMRAxv0XSTv4hgkF1HNNgl95sQwdkESxjvAlI-p2lwK2Z9oNGjcCDWJNfWDnR9RTfnLNMI7PepLogCDMMQIMTdMtmfndyoJa0gtI3wSRBmR3Ev2H6D1vhaYKOf-XfK4vtUOXG-9NcAE7XBgUvHXbrx7I6Qh3sdQY/p.png" }}>
                                {followUser?.displayName?.substring(0, 1)}
                                {
                                    followUser?.isVerified ?
                                        <Avatar.Badge bgColor="violet.400" flexDirection="row" alignItems="center" justifyContent="center" borderColor={useColorModeValue("dark.50", "light.100")}><Icon as={<MaterialIcons name="verified" />} size="xs" color="violet.300" /></Avatar.Badge>
                                        :
                                        null
                                }
                            </Avatar>
                            <VStack space={0}>
                                <Text color={useColorModeValue("light.50", "dark.50")} fontWeight="bold" fontSize="lg">{followUser?.displayName}</Text>
                                <Text color={useColorModeValue("light.400", "dark.400")} fontSize="sm">@{followUser?.accountHandle}</Text>
                            </VStack>
                        </HStack>
                        <Text color={useColorModeValue("light.400", "dark.400")}>{formatDate(followDate, "MMM Do, YYYY")}</Text>
                    </HStack>
                </Box>
            </Pressable>
        )

    }

    return card;

}