import { FormControl, HStack, Input, ScrollView, Switch, TextArea, useColorModeValue, VStack, Text, Button } from "native-base";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../services/User";

export default function EditProfileScreen() {

    const { user } = useContext(UserContext);
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});

    let submitEdits = async () => {
        if (await validateEdits()) {

        }
    }

    let validateEdits = async () => {
        let success = true;
        return success;
    }

    useEffect(() => {
        setValues({
            accountHandle: user?.accountHandle,
            displayName: user?.displayName,
            profileBio: user?.profileBio,
            isPrivate: user?.isPrivate
        });
    }, []);

    let page = (
        <SafeAreaView>
            <ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <VStack space={3} mx={4}>
                    <FormControl isInvalid={`accountHandle` in errors} isRequired>
                            <FormControl.Label>Account Handle</FormControl.Label>
                            <Input type="text" placeholder="john.doe" variant="outline" value={values.accountHandle} onChangeText={(v) => setValues({ ...values, accountHandle: v })} selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} />
                            {
                                'accountHandle' in errors ?
                                    <FormControl.ErrorMessage>{errors.accountHandle}</FormControl.ErrorMessage>
                                    :
                                    null
                            }
                        </FormControl>
                        <FormControl isInvalid={`displayName` in errors} isRequired>
                            <FormControl.Label>Display Name</FormControl.Label>
                            <Input type="text" placeholder="John Doe" variant="outline" value={values.displayName} onChangeText={(v) => setValues({ ...values, displayName: v })} selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} />
                            {
                                'displayName' in errors ?
                                    <FormControl.ErrorMessage>{errors.displayName}</FormControl.ErrorMessage>
                                    :
                                    null
                            }
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Profile Bio</FormControl.Label>
                            <TextArea value={values.profileBio} onChangeText={v => setValues({ ...values, profileBio: v })} isInvalid={`profileBio` in errors} placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent neque justo, lobortis non diam sit amet, dapibus vulputate erat. Aenean non nisl at."/>
                            {
                                'profileBio' in errors ?
                                    <FormControl.ErrorMessage>{errors.profileBio}</FormControl.ErrorMessage>
                                    :
                                    <FormControl.HelperText flexDirection="row">{values.profileBio ? values.profileBio?.length : '0'} / 150</FormControl.HelperText>
                            }
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Private Account</FormControl.Label>
                            <HStack alignItems="center" space={2}>
                                <Text color={useColorModeValue("light.50", "dark.50")}>Enable Account Privacy</Text>
                                <Switch defaultIsChecked={ user?.isPrivate } onChange={ () => setValues({ ...values, isPrivate: !(values.isPrivate) }) } offThumbColor="dark.600" onTrackColor="violet.300" onThumbColor="violet.400"/>
                            </HStack>
                        </FormControl>

                        <Button onPress={() => console.log("submitted changes")} backgroundColor="violet.400">Update Profile</Button>
                    </VStack>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );

    return page;
}