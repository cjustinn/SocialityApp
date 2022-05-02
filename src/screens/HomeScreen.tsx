import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, View, Text } from 'react-native';

export default function HomeScreen({ navigation }: any) {
    return (
        <SafeAreaView>
            <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
                <View>
                    <Text>This is the home page.</Text>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}