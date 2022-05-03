import { Text, View, useColorModeValue } from "native-base";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen({ navigation }: any) {

    return (
        <SafeAreaView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <Text fontSize="3xl" color={useColorModeValue("light.50", "dark.50")}>This is the search page.</Text>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )

}