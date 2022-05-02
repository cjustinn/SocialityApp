import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, View, StyleSheet } from 'react-native';
import { Box, Button, Center, FormControl, Icon, Input, Text, useColorMode, useColorModeValue } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, parseFirebaseErrorCode } from "../services/Firebase";
import { styles } from "../services/Styles";

export default function LoginScreen({ navigation }: any) {
    const [ errors, setErrors ] = useState({});
    const [ loginData, setLoginData ] = useState({});
    const [ showPassword, setShowPassword ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const { colorMode, toggleColorMode } = useColorMode();

    const validateLogin = () => {
        let success = true;
        let _errs = {};

        const email = loginData.email;
        const password = loginData.password;
        
        // Check email & password
        if (!('password' in loginData) || password.trim() === '') {
            _errs.password = "You must enter a password.";
            success = false;
        }

        if (!('email' in loginData) || email.trim() === '') {
            _errs.email = "You must enter an email address.";
            success = false;
        }

        setErrors(_errs);
        return success;
    }

    const handleSubmit = () => {

        setLoading(true);

        if (validateLogin()) {
            const email = loginData.email.trim();
            const password = loginData.password.trim();

            signInWithEmailAndPassword(auth, email, password).then(credentials => {

                setLoading(false);

            }).catch(e => {
                const message = parseFirebaseErrorCode(e.code);
                let _err = {};

                if (e.code === "auth/invalid-email") {
                    _err.email = message;
                } else if (e.code === "auth/invalid-password") {
                    _err.password = message;
                }

                setErrors(_err);
                setLoading(false);
            });
        }

        setLoading(false);
    }

    return (
        <SafeAreaView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <Center my={12}>
                        <Text fontSize="4xl" fontWeight="thin" color={useColorModeValue("light.50", "dark.50")}>Sociality</Text>
                    </Center>
                    <Box style={styles.container} backgroundColor={useColorModeValue("dark.100", "light.50")}>
                        <Center my={4}>
                            <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue("light.50", "dark.50")}>Login</Text>
                        </Center>

                        <FormControl mb={2} isRequired isInvalid={'email' in errors}>
                            <FormControl.Label>Email Address</FormControl.Label>
                            <Input variant="outline" p={2} placeholder="example@domain.com" value={ loginData.email } selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} onChangeText={ value => setLoginData({ ...loginData, email: value })}/>
                            { 'email' in errors ? <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage> : null}
                        </FormControl>
                        <FormControl mb={2} isRequired isInvalid={'password' in errors}>
                            <FormControl.Label>Password</FormControl.Label>
                            <Input type={showPassword ? "text" : "password"} variant="outline" p={2} placeholder="Password" value={ loginData.password } selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} onChangeText={ value => setLoginData({ ...loginData, password: value })} InputRightElement={<Icon onPress={() => setShowPassword(!showPassword)} as={ showPassword ? <MaterialIcons name="visibility"/> : <MaterialIcons name="visibility-off"/>} size={5} mr={2} color="muted.400"/>}/>
                            { 'password' in errors ? <FormControl.ErrorMessage>{ errors.password }</FormControl.ErrorMessage> : null}
                        </FormControl>
                        
                        <Button mt={6} onPress={handleSubmit} isLoading={loading} backgroundColor="violet.400"><Text color="light.50" fontSize="lg">Login</Text></Button>
                        <Center mt={4}>
                            <Text><Text color={useColorModeValue("light.50", "dark.50")}>Forgot your password?</Text> <Text color={useColorModeValue("info.400", "info.700")} onPress={() => console.log("Password reset hit.")}>Reset your password!</Text></Text>
                        </Center>
                        <Center mt={2}>
                            <Text><Text color={useColorModeValue("light.50", "dark.50")}>New to Sociality?</Text> <Text color={useColorModeValue("info.400", "info.700")} onPress={() => navigation.navigate('register')}>Register now!</Text></Text>
                        </Center>
                    </Box>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}