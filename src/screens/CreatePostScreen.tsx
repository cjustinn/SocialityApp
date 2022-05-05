import { Text, View, useColorModeValue, FormControl, TextArea, Button, Icon, useToast, Box } from "native-base";
import { useContext, useState } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { API_URL } from '@env';
import { UserContext } from "../services/User";

export default function CreatePostScreen({ navigation }) {

    const [ errors, setErrors ] = useState({});
    const [ postData, setPostData ] = useState({});

    const { user } = useContext(UserContext);
    const alertHandler = useToast();

    const verifyInputs = () => {
        let passed = true;
        let errs = {};

        if (!postData.text) {
            errs = {...errs, text: `You must enter post text.` }
            passed = false;
        } else if (postData.text.length > 250) {
            errs = { ...errs, text: `Your post cannot exceed 250 characters.` }
            passed = false;
        } else if (postData.text.trim() === "") {
            errs = { ...errs, text: `You must enter post text.` }
            passed = false;
        }

        setErrors(errs);
        return passed;
    }

    const createPost = () => {
        if (verifyInputs()) {
            const PostEndpoint = `${API_URL}api/posts`;
            const newPost = {
                poster: user ? user?._id : null,
                text: postData.text
            }

            fetch(PostEndpoint, {
                method: 'POST',
                body: JSON.stringify({ postData: newPost }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                alertHandler.show({
                    render: () => {
                        return <Box bg="emerald.400" px="2" py="1" rounded="sm" mb={5}>
                            Your post has been created!
                        </Box>
                    }
                });

                navigation.goBack();
            }).catch(err => setErrors({ ...errors, text: `There was a problem creating your post. Please try again!` }));
        }
    }

    return (
        <SafeAreaView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View mx={4}>
                    <FormControl mb={2} isRequired isInvalid={'text' in errors}>
                        <FormControl.Label>Post Text</FormControl.Label>
                        <TextArea isInvalid={'text' in errors} placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat imperdiet metus, ac elementum leo luctus vitae non..." value={postData.text} selectionColor={useColorModeValue("light.50", "dark.50")} color={useColorModeValue("light.50", "dark.50")} onChangeText={(value) => {
                            if (value.length <= 250) {
                                setPostData({ ...postData, text: value })
                            }
                        }}/>
                        {
                            'text' in errors ?
                            <FormControl.ErrorMessage>{errors?.text}</FormControl.ErrorMessage>
                            :
                            <FormControl.HelperText flexDirection="row">{ postData.text ? postData?.text?.length : '0' } / 250</FormControl.HelperText>
                        }
                    </FormControl>

                    <Button onPress={createPost} my={4} leftIcon={<Icon as={<MaterialIcons name="add-box"/>} size="lg" color="light.50"/>} backgroundColor="violet.400"><Text color="light.50" fontSize="lg">Create Post</Text></Button>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )

}