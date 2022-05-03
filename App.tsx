import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { auth } from './src/services/Firebase';

import AuthNavigation from './src/navigation/AuthNavigation';
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import { NativeBaseProvider, useColorModeValue } from 'native-base';
import { socialityColorModeManager, theme } from './src/services/Theme';
import { Center } from 'native-base';
import { UserContext } from './src/services/User';

const BgWrapper = ({ children }) => {
  const bgColor = useColorModeValue("light.50", "dark.50");
  return <Center flex={1} bg={bgColor}>
    {children}
  </Center>;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);
  const [ mongoUser, setMongoUser ] = useState(undefined);

  useEffect(() => {
    const unsubscribeToAuth = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUser(usr);
      } else {
        setUser(undefined);
      }

      setLoading(false);
    });

    return unsubscribeToAuth;
  }, []);

  return <NativeBaseProvider theme={theme} colorModeManager={socialityColorModeManager}>
      {
        loading ? (
          <View style={styles.container}>
            <ActivityIndicator size="large" />
          </View>
        )
        :
        (
          <NavigationContainer>
            <StatusBar animated={true} translucent={true} backgroundColor="black" style="light" networkActivityIndicatorVisible={true} />
            <UserContext.Provider value={{ user: mongoUser, setUser: setMongoUser }}>
              {user ? <BottomTabNavigation /> : <AuthNavigation />}
            </UserContext.Provider>
          </NavigationContainer>
        )
      }
  </NativeBaseProvider>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
