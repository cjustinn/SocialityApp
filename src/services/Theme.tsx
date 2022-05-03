import { ColorMode, extendTheme, StorageManager } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const theme = extendTheme({
    
    config: {
        initialColorMode: 'dark'
    }

});

export const socialityColorModeManager: StorageManager = {
    get: async () => {
        try {
            let value = await AsyncStorage.getItem("@sociality-color-mode");
            return value === "dark" ? "dark" : "light";
        } catch {
            return "dark";
        }
    },
    set: async (value: ColorMode) => {
        try {

            await AsyncStorage.setItem("@sociality-color-mode", value);

        } catch(e) {
            console.log(`SOCIALITY_ERR: ${e}`);
        }
    }
}