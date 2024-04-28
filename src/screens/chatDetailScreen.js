import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import {
    ChevronLeftIcon,
    FaceSmileIcon,
    PaperAirplaneIcon,
    PhotoIcon,
} from "react-native-heroicons/outline";
import { EllipsisHorizontalIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from 'react-native-safe-area-context';
import {rMS, rV, rS} from '../styles/responsive'
import { useNavigation } from '@react-navigation/native';

const ChatDetailScreen = ({ route }) => {
    const navigation = useNavigation();

    const { chatId, matchedName } = route.params;
  
    return (
        <SafeAreaView className=" justify-center items-center relative bg-white">
            <View style={styles.container}>
                {/* header: image (click for detail), name, setting(for report and unmatch) */}
                <View className="flex justify-between items-center flex-row w-full border-b border-neutral-300">
                    <View style={{ flexDirection: 'row'}}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => navigation.navigate("ChatListScreen")}
                    >
                        <ChevronLeftIcon size={35} color={"black"} strokeWidth={2} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ width: '70%', justifyContent: 'center', alignItems: 'center', marginTop: '1.5%', marginBottom: '1.5%'}}
                        >
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>
                            <View className='mr-3'>
                                <Image source={require('../face.jpg')} style={styles.image} />
                            </View>
                            <View className="justify-center items-start">
                                <Text style={styles.displayName}>{matchedName}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        activeOpacity={0.8}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}
                        >
                        <View className="bg-black/5 rounded-full p-1">
                            <EllipsisHorizontalIcon
                                size={rMS(30)}
                                color={"black"}
                                strokeWidth={2}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                </View>

                {/* chat detail */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Chat ID: {chatId}</Text>
                    <Text>Matched Name: {matchedName}</Text>
                </View>

                {/* text input */}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: rMS(4), 
    },
    image: {
        width: rMS(40),
        height: rMS(40),
        borderRadius: rMS(100) / 2,
    },
    displayName: {
        flexDirection: 'row', // Equivalent to flex
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: rMS(15),
    }
});

export default ChatDetailScreen;