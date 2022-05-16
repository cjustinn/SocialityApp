import { ScrollView, useColorModeValue, View, Text, VStack } from 'native-base';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCardComponent from '../components/UserCardComponent';

export default function SearchResultsScreen({ route, navigation }) {

    const { results } = route.params;

    return (
        <SafeAreaView>
            <ScrollView>
                <View px={4}>
                    <VStack space={4}>
                    <Text color={useColorModeValue("light.50", "dark.50")} fontSize="2xl" fontWeight="bold">Search Results</Text>
                        {
                            results.length > 0 ?
                            results.map(user => {
                                return <UserCardComponent target={user} navigation={navigation}/>
                            })
                            :
                            <Text color={useColorModeValue("light.50", "dark.50")} fontSize="md">We couldn't find any users matching your search query!</Text>
                        }
                    </VStack>
                </View>
            </ScrollView>
        </SafeAreaView>
    )

}