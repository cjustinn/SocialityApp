import { Icon, Box, Text, Avatar, HStack, useColorModeValue, VStack, Divider } from 'native-base';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { formatDate } from '../services/Utility';

export default function UserCardComponent(props) {
    const { target, navigation } = props;

    const [loading, setLoading] = useState(false);
    let card = null;

    if (!loading) {

        card = (
            <Pressable onPress={() => navigation.navigate('profile', {
                userId: target?._id
            })}>
                <Box rounded="lg" px={4} py={4} backgroundColor={useColorModeValue("dark.100", "light.50")}>
                    <VStack space={2}>
                        <HStack space={2} justifyContent="space-between" alignItems="center">
                            <HStack space={2}>
                                <Avatar shadow={2} size="md" fontSize="md" bgColor={useColorModeValue("light.200", "dark.200")} source={{ uri: "https://previews.dropbox.com/p/thumb/ABgaFcMCwD2Ov0_B1z3vcQV6P5U9_BcgA2m5zF1_npQv5rAC95UdB8VUf7-CIhfN3Xdctk1y2tzaoL4-U4piggjysgsGXwivdK3B_VIgJ7eMp9Mr5w2A_QYOWmCJnLmPQt_uW5VTzJaDK07CH4xlMRChBr-PnKyrxBBL1xX4M3wON5kY0bh7l1GksLyMqqgXTrmMc_dmJpBVedNpzqeJL1BECIUK9xILcZmSMRAxv0XSTv4hgkF1HNNgl95sQwdkESxjvAlI-p2lwK2Z9oNGjcCDWJNfWDnR9RTfnLNMI7PepLogCDMMQIMTdMtmfndyoJa0gtI3wSRBmR3Ev2H6D1vhaYKOf-XfK4vtUOXG-9NcAE7XBgUvHXbrx7I6Qh3sdQY/p.png" }}>
                                    {target?.displayName?.substring(0, 1)}
                                    {
                                        target?.isVerified ?
                                            <Avatar.Badge bgColor="violet.400" flexDirection="row" alignItems="center" justifyContent="center" borderColor={useColorModeValue("dark.50", "light.100")}><Icon as={<MaterialIcons name="verified" />} size="xs" color="violet.300" /></Avatar.Badge>
                                            :
                                            null
                                    }
                                </Avatar>
                                <VStack space={0}>
                                    <Text color={useColorModeValue("light.50", "dark.50")} fontWeight="bold" fontSize="lg">{target?.displayName}</Text>
                                    <Text color={useColorModeValue("light.400", "dark.400")} fontSize="sm">@{target?.accountHandle}</Text>
                                </VStack>
                            </HStack>

                            <Text color={useColorModeValue("light.400", "dark.400")} fontSize="sm">Joined on {formatDate(new Date(target?.creationTime), "MMM Do, YYYY")}</Text>
                        </HStack>
                    </VStack>
                </Box>
            </Pressable>
        )

    }

    return card;
}