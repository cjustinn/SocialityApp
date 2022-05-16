import React from 'react';
import { FormControl, HStack, Input, ScrollView, Switch, TextArea, useColorModeValue, VStack, Text, Button, useToast, Box } from "native-base";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../services/User";

import { API_URL } from '@env';

export default function EditProfileScreen() {

    const { user, setUser } = useContext(UserContext);
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});

    const [ updating, setUpdating ] = useState(false);

    const ToastController = useToast();

    let submitEdits = async () => {
        setUpdating(true);

        if (await validateEdits()) {
            const UpdateEndpoint = `${API_URL}api/users/${user ? user._id : "invalid_user"}`;
            fetch(UpdateEndpoint, {
                method: "PUT",
                body: JSON.stringify({
                    userData: values
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((updatedUser) => {
                setUser(updatedUser);
                ToastController.show({
                    render: () => {
                        return (
                            <Box rounded="lg" backgroundColor="emerald.400" px={2} py={2}>
                                <Text color="light.50">Successfully updated your profile.</Text>
                            </Box>
                        )
                    }
                });

                setUpdating(false);
            }).catch(err => {
                ToastController.show({
                    render: () => {
                        return (
                            <Box rounded="lg" backgroundColor="red.400" px={2} py={2}>
                                <Text color="light.50">Could not update your profile. Please try again.</Text>
                            </Box>
                        )
                    }
                });

                setUpdating(false);
            });
        } else {
            setUpdating(false);
        }
    }

    let validateEdits = async () => {
        let success = true;
        let errs = {};

        
        if (!('accountHandle' in values) || values?.accountHandle.trim() === '') {
            errs = { ...errs, accountHandle: `You must enter an account handle.` };
            success = false;
        } else if (values.accountHandle.trim().includes("@") || values.accountHandle.trim().includes(" ")) {
            errs = { ...errs, accountHandle: `The entered account handle contains banned characters.` };
            success = false;
        } else if (values.accountHandle.trim().length < 2 || values.accountHandle.trim().length > 15) {
            errs = { ...errs, accountHandle: `Your account handle must be between two and fifteen characters.` };
            success = false;
        } else {
            const AHEndpoint = `${API_URL}api/users/handle/${values.accountHandle.trim()}`;
            let inUse = await fetch(AHEndpoint).then(r => r.json());
            if (inUse.data && user?.accountHandle != values.accountHandle) {
                errs = { ...errs, accountHandle: `The account handle you have entered is already in use.` };
                success = false;
            }
        }
        
        if (!('displayName' in values) || values?.displayName.trim() === '') {
            errs = { ...errs, displayName: "You must enter a display name." };
            success = false;
        } else if (values?.displayName.trim().length < 2 || values?.displayName.trim().length > 15) {
            errs = { ...errs, displayName: "Your display name must be between two and fifteen characters." };
            success = false;
        }

        setErrors(errs);

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
                                    <FormControl.HelperText flexDirection="row">{values.accountHandle ? values.accountHandle?.length : '0'} / 15</FormControl.HelperText>
                            }
                        </FormControl>
                        <FormControl isInvalid={`displayName` in errors} isRequired>
                            <FormControl.Label>Display Name</FormControl.Label>
                            <Input type="text" placeholder="John Doe" variant="outline" value={values.displayName} onChangeText={(v) => {
                                if (v.length <= 15) {
                                    setValues({ ...values, displayName: v })
                                } else {
                                    v = values.displayName;
                                }
                            }} selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} />
                            {
                                'displayName' in errors ?
                                    <FormControl.ErrorMessage>{errors.displayName}</FormControl.ErrorMessage>
                                    :
                                    <FormControl.HelperText flexDirection="row">{values.displayName ? values.displayName?.length : '0'} / 15</FormControl.HelperText>
                            }
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Profile Bio</FormControl.Label>
                            <TextArea color={useColorModeValue("light.50", "dark.50")} value={values.profileBio} onChangeText={v => setValues({ ...values, profileBio: v })} isInvalid={`profileBio` in errors} placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent neque justo, lobortis non diam sit amet, dapibus vulputate erat. Aenean non nisl at."/>
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

                        <Button isLoading={updating} disabled={updating} onPress={submitEdits} backgroundColor="violet.400">Update Profile</Button>
                    </VStack>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );

    return page;
}