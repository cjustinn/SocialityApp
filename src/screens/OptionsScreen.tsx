import { signOut } from "firebase/auth";
import { Text, View, useColorModeValue, useColorMode, Switch, FormControl, HStack, Button, Icon } from "native-base";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { auth } from "../services/Firebase";
import { UserContext } from "../services/User";

export default function OptionsScreen({ navigation }: any) {

    const { colorMode, toggleColorMode } = useColorMode();
    const { user, setUser } = useContext(UserContext);

    return (
        <SafeAreaView>
            <View mx={3}>
                <Text color={useColorModeValue("light.400", "dark.400")} fontSize="2xl" fontWeight="bold">Appearance</Text>
                <HStack mb={2} alignItems="center" space={2}>
                    <Text color={useColorModeValue("light.50", "dark.50")}>Enable Dark Mode</Text>
                    <Switch defaultIsChecked={colorMode !== "dark"} onChange={() => { toggleColorMode(); }} offThumbColor="dark.600" onTrackColor="violet.300" onThumbColor="violet.400"/>
                </HStack>

                <Text color={useColorModeValue("light.400", "dark.400")} fontSize="2xl" fontWeight="bold">Account</Text>
                <Button my={2} onPress={() => {
                    signOut(auth);
                    setUser(undefined);
                }} backgroundColor="violet.400" leftIcon={<Icon as={<MaterialIcons name="logout"/>} size="md" color="light.50"/>}><Text color="light.50" fontSize="md">Logout</Text></Button>
            </View>
        </SafeAreaView>
    )
    
}