import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import {
    ChevronLeftIcon,
    FaceSmileIcon,
    PaperAirplaneIcon,
    PhotoIcon,
    useState, 
    useEffect
} from "react-native-heroicons/outline";
import { EllipsisHorizontalIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from 'react-native-safe-area-context';
import {rMS, rV, rS} from '../styles/responsive'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import app from '../../auth/db/firestore';

const ChatDetailScreen = ({route}) => {
    const navigation = useNavigation();

    const { chatId, matchedName } = route.params;
    console.log("chatID: ", chatId);
    console.log("name: ", matchedName);
  
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View style={styles.headerContainer}>
                    <View style={{ flexDirection: 'row'}}>
                        <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.backNavigator}
                                onPress={() => navigation.navigate("ChatListScreen")}
                            >
                            <ChevronLeftIcon size={35} color={"black"} strokeWidth={2} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.imageContainer}
                            onPress={() => navigation.navigate("ChatListScreen")}
                            >
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>
                                <View style={{marginRight: rMS(10)}}>
                                    <Image source={require('../face.jpg')} style={styles.image} />
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                                    <Text style={styles.displayName}>{matchedName}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        
                        <View style={{flex: 1}}/>

                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={styles.optionContainer}
                            onPress={() => navigation.navigate("ChatListScreen")}
                            >
                            <View style={{borderRadius: '9999px'}}>
                                <EllipsisHorizontalIcon
                                    size={rMS(30)}
                                    color={"black"}
                                    strokeWidth={2}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                {/* Chat detail */}
                <View style={styles.chatContainer}>
                    <Text>Chat ID: {chatId}</Text>
                    <Text>Matched Name: {matchedName}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#CBD5E0',
    },
    backNavigator: {
        flex: 0.5, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: rMS(10), 
        marginBottom: rMS(10)
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
    },
    optionContainer: {
        flex: 0.5, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    chatContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default ChatDetailScreen;