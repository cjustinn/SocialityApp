import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Center, Text, useColorModeValue, Box, FormControl, Input, Icon, Button, KeyboardAvoidingView, ScrollView, View } from "native-base";
import { styles } from "../services/Styles";
import { useState } from "react";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, parseFirebaseErrorCode } from "../services/Firebase";
import { API_URL } from '@env';

export default function RegisterAccountScreen({ navigation }: any) {
    const [errors, setErrors] = useState({});
    const [registrationData, setRegistrationData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateRegistration = async () => {
        let success = true;
        let _errs = {};

        const test: String = "test";

        // Email testing
        if (!('email' in registrationData) || registrationData.email.trim() === '') {
            _errs.email = "You must enter an email address.";
            success = false;
        } else if (!registrationData.email.trim().toLowerCase().match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            _errs.email = "The entered email address is invalid.";
            success = false;
        }

        // Account handle testing
        if (!('accountHandle' in registrationData) || registrationData.accountHandle.trim() === '') {
            _errs.accountHandle = "You must enter an account handle.";
            success = false;
        } else if (registrationData.accountHandle.trim().includes("@") || registrationData.accountHandle.trim().includes(" ")) {
            _errs.accountHandle = "The entered account handle includes banned characters.";
            success = false;
        } else if (registrationData.accountHandle.trim().length < 2 || registrationData.accountHandle.trim().length > 15) {
            _errs.accountHandle = "Your account hande must be between two and fifteen characters long.";
            success = false;
        } else {
            const AHEndpoint = `${API_URL}api/users/handle/${registrationData.accountHandle.trim()}`;
            let inUse = await fetch(AHEndpoint).then(d => d.json());
            if (inUse.data) {
                _errs.accountHandle = `The entered account handle is already in use!`;
                success = false;
            }
        }

        // Display name testing
        if (!('displayName' in registrationData) || registrationData.displayName.trim() === '') {
            _errs.displayName = "You must enter a display name.";
            success = false;
        } else if (registrationData.displayName.trim().length < 2 || registrationData.displayName.trim().length > 15) {
            _errs.displayName = "Your display name must be between 2 and 15 characters.";
            success = false;
        }

        // Password testing
        if (!('password' in registrationData) || registrationData.password.trim() === '') {
            _errs.password = "You must enter a password.";
            success = false;
        } else if (!registrationData.password.trim().match(/^(?=.{5,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/)) {
            _errs.password = "Your password must contain at least one uppercase letter, lowercase letter, and number, and be a minimum of five characters long.";
            success = false;
        }

        // Password comparison testing.
        if (!('passwordMatch' in registrationData) || registrationData.passwordMatch.trim() === '' || registrationData.password !== registrationData.passwordMatch) {
            _errs.passwordMatch = "Both entered passwords must match!";
            success = false;
        }

        setErrors(_errs);
        return success;
    }

    const handleSubmit = async () => {
        setLoading(true);

        if (await validateRegistration()) {
            createUserWithEmailAndPassword(auth, registrationData.email.trim(), registrationData.password.trim()).then(credentials => {
                let userData = {
                    userData: {
                        uuid: credentials.user.uid,
                        accountHandle: registrationData.accountHandle.trim().toLowerCase(),
                        displayName: registrationData.displayName.trim(),
                        email: registrationData.email.trim(),
                        creationTime: credentials.user.metadata.creationTime
                    }
                }

                fetch(`${API_URL}api/users`, {
                    method: 'POST',
                    body: JSON.stringify(userData),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(result => {
                    return result.json();
                }).then((data) => {

                    updateProfile(credentials.user, {
                        displayName: registrationData.accountHandle.trim().toLowerCase()
                    }).catch(err => setErrors({ passwordMatch: parseFirebaseErrorCode(err.code) }));

                    // Follow the official Sociality account by default.
                    const SocialityEndpoint = `${API_URL}api/follow`;
                    fetch(SocialityEndpoint, {
                        method: "POST",
                        body: JSON.stringify({
                            followData: {
                                follower: data.data._id,
                                followed: "62707d9d40fa62f46f6ca01f"
                            }
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })

                }).catch(err => console.log(`API CALL FAILED: ${err}`));

            }).catch((err) => {
                setErrors({ passwordMatch: parseFirebaseErrorCode(err.code) });
            });
        }

        setLoading(false);
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        <Center my={12}>
                            <Text fontSize="4xl" fontWeight="thin" color={useColorModeValue("light.50", "dark.50")}>Sociality</Text>
                        </Center>
                        <Box style={styles.container} backgroundColor={useColorModeValue("dark.100", "light.50")}>
                            <Center my={4}>
                                <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue("light.50", "dark.50")}>Create an Account</Text>
                            </Center>

                            <FormControl mb={2} isRequired isInvalid={'email' in errors}>
                                <FormControl.Label>Email Address</FormControl.Label>
                                <Input variant="outline" p={2} placeholder="example@domain.ca" value={registrationData.email} selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} onChangeText={value => setRegistrationData({ ...registrationData, email: value })} />
                                {'email' in errors ? <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage> : null}
                            </FormControl>

                            <FormControl mb={2} isRequired isInvalid={'accountHandle' in errors}>
                                <FormControl.Label>Account Handle</FormControl.Label>
                                <Input variant="outline" p={2} placeholder="john.doe" value={registrationData.accountHandle} selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} onChangeText={value => setRegistrationData({ ...registrationData, accountHandle: value })} />
                                {'accountHandle' in errors ? <FormControl.ErrorMessage>{errors.accountHandle}</FormControl.ErrorMessage> : <FormControl.HelperText>Your account handle is your profile's unique public identifier!</FormControl.HelperText>}
                            </FormControl>

                            <FormControl mb={2} isRequired isInvalid={'displayName' in errors}>
                                <FormControl.Label>Display Name</FormControl.Label>
                                <Input variant="outline" p={2} placeholder="John Doe" value={registrationData.displayName} selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} onChangeText={value => setRegistrationData({ ...registrationData, displayName: value })} />
                                {'displayName' in errors ? <FormControl.ErrorMessage>{errors.displayName}</FormControl.ErrorMessage> : <FormControl.HelperText>Your display name is your public, non-unique display name which will be used as a contact / poster name.</FormControl.HelperText>}
                            </FormControl>

                            <FormControl mb={2} isRequired isInvalid={'password' in errors || 'passwordMatch' in errors}>
                                <FormControl.Label>Password</FormControl.Label>
                                <Input variant="outline" type={showPassword ? "text" : "password"} p={2} placeholder="Password" value={registrationData.password} selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} onChangeText={value => setRegistrationData({ ...registrationData, password: value })} InputRightElement={<Icon onPress={() => setShowPassword(!showPassword)} as={showPassword ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />} size={5} mr={2} color="muted.400" />} />
                                {'password' in errors ? <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage> : null}
                                {'passwordMatch' in errors ? <FormControl.ErrorMessage>{errors.passwordMatch}</FormControl.ErrorMessage> : null}
                                {!('password' in errors) && !('passwordMatch' in errors) ? <FormControl.HelperText>Your password must be 5 characters long, and contain an uppercase letter, lowercase letter, and a number.</FormControl.HelperText> : null}
                            </FormControl>

                            <FormControl mb={2} isRequired isInvalid={'passwordMatch' in errors}>
                                <FormControl.Label>Confirm Password</FormControl.Label>
                                <Input variant="outline" type={showPassword ? "text" : "password"} p={2} placeholder="Confirm Password" value={registrationData.passwordMatch} selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} onChangeText={value => setRegistrationData({ ...registrationData, passwordMatch: value })} InputRightElement={<Icon onPress={() => setShowPassword(!showPassword)} as={showPassword ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />} size={5} mr={2} color="muted.400" />} />
                                {'passwordMatch' in errors ? <FormControl.ErrorMessage>{errors.passwordMatch}</FormControl.ErrorMessage> : null}
                            </FormControl>

                            <Button mt={6} onPress={handleSubmit} disabled={loading} isLoading={loading} backgroundColor="violet.400"><Text color="light.50" fontSize="lg">Complete Registration</Text></Button>

                            <Center my={4}>
                                <Text color={useColorModeValue("light.50", "dark.50")}>Already have an account? <Text color={useColorModeValue("info.400", "info.700")} onPress={() => navigation.goBack()}>Log-in now!</Text></Text>
                            </Center>
                        </Box>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );

}