import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, View, Text } from 'react-native';

export default function ProfileScreen({ navigation }: any) {
    return (
        <SafeAreaView>
            <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
                <View>
                    <Text>This is a profile page.</Text>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}