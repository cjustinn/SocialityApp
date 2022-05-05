import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, View } from 'react-native';
import { Box, Button, Text, HStack, useColorMode, useColorModeValue, IconButton, Icon, ScrollView } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserContext } from "../services/User";
import { useContext } from "react";
import { auth } from "../services/Firebase";
import { API_URL } from '@env';

export default function HomeScreen({ navigation }: any) {
    const { user, setUser } = useContext(UserContext);

    if (auth.currentUser) {
        if (!user || auth.currentUser.uid !== user.uuid) {
            const APIEndpoint = `${API_URL}api/users/${auth.currentUser.uid}`;
            fetch(APIEndpoint).then(d => d.json()).then(result => {
                setUser(result.data);
            }).catch(err => console.log(err));
        }
    }

    return (
        <SafeAreaView>
            <View>
                <HStack bg={useColorModeValue("dark.100", "light.50")} px="1" py="3" justifyContent="space-between" alignItems="center" w="100%" maxW="100%" mb={4}>
                    <HStack alignItems="center" ml={2}>
                        <Text color={useColorModeValue("light.50", "dark.50")}>Your Feed</Text>
                    </HStack>
                    <HStack alignItems="center">
                        <IconButton icon={<Icon as={<MaterialIcons name="settings" />} size="md" color="dark.400" />} onPress={() => navigation.navigate("options")} />
                    </HStack>
                </HStack>

                <Text mx={3} color={useColorModeValue("light.50", "dark.50")} fontSize="2xl" fontWeight="bold">Temporary Profile Access:</Text>
                <Button backgroundColor="violet.400" mx={12} my={2} leftIcon={<Icon as={<MaterialIcons name="account-circle" />} size="lg" />} onPress={() => {
                    navigation.navigate('profile', {
                        userId: "62702a82ab613afa261cffc2"
                    });
                }}> View Profile</Button>
            </View>
        </SafeAreaView>
    )
}