import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useNavigationState, useFocusEffect } from '@react-navigation/native';
import { getFirestore, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import {rMS, rV, rS} from '../styles/responsive';
import app from '../../auth/db/firestore';

function useRouteName() {
  const navigationState = useNavigationState(state => state);
  return navigationState?.routes[navigationState?.index]?.name;
}

const ChatListScreen = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentRouteName = useRouteName();
  const savedUserName = AsyncStorage.getItem("name");

  const navigation = useNavigation();
  const db = getFirestore(app);

  useFocusEffect(
    React.useCallback(() => {
        const onBackPress = () => {
            if (currentRouteName === 'ChatListScreen') {
                BackHandler.exitApp();
                return true;
            } else {
                return false;
            }
        };

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [currentRouteName])
  );

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        const savedUserId = await AsyncStorage.getItem("id");
        const userDocRef = doc(db, 'users', savedUserId);
        
        // Set up snapshot listener
        const unsubscribe = onSnapshot(userDocRef, async (userDocSnap) => {
          if (userDocSnap.exists()) {
            const userChats = userDocSnap.data().chatId || []; // Handle case where chatId is undefined or null
            const chatsData = [];
            for (const chatId of userChats) {
              const chatDocRef = doc(db, 'chats', chatId);
              const chatDocSnap = await getDoc(chatDocRef);
              if (chatDocSnap.exists()) {
                const chatData = chatDocSnap.data();
                if (chatData) {
                  const lastMessage = chatData.messages.length > 0 ? chatData.messages[chatData.messages.length - 1] : null;
                  chatsData.push({
                    id: chatId,
                    participants: chatData.participants,
                    lastMessage: lastMessage,
                    participantsName: chatData.participantsName,
                  });
                }
              } else {
                console.log('Chat document does not exist for chatId:', chatId);
              }
            }
            setChats(chatsData);
          }
          setIsLoading(false);
        });

        return unsubscribe; // Cleanup subscription on unmount
      } catch (error) {
        console.error('Error fetching chats:', error);
        setIsLoading(false);
      }
    };

    const unsubscribe = fetchChats();

    return () => unsubscribe && unsubscribe(); // Cleanup the listener on unmount
  }, [db]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <SafeAreaView className=" justify-center items-center relative bg-white"
        style={{marginTop: rMS(4),}}
    >
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              chat
            </Text>
          </View>
        </View>
        {chats.length === 0 ? (
          <View style={styles.noChatContainer}>
            <Text>No Matches</Text>
          </View>
        ) : (
          <View className="w-full h-full">
            <FlatList
              data={chats}
              renderItem={({ item }) => (
                <View style={{
                    paddingTop: rMS(5),
                    paddingBottom: rMS(5),
                    borderBottomWidth: 1,
                    borderBottomColor: '#CBD5E0',
                    marginHorizontal: rMS(15)
                  }}>
                  <TouchableOpacity
                    style={styles.userContainer}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('ChatDetailScreen', {
                      chatId: item.id,
                      matchedName: item.participantsName.find(name => name !== savedUserName)
                    })}
                    >

                    <View style={styles.imageViewContainer}> 
                      <Image
                        source={require('../face.jpg')}
                        style={styles.image}
                      />
                    </View>

                    <View style={styles.userInfoContainer}>
                        <Text style={styles.participants}>
                          {item.participantsName.find(name => name !== savedUserName) || ''}
                        </Text>
                        <Text style={styles.lastMessage}>
                          {item.lastMessage
                            ? item.lastMessage.length > 45
                                ? item.lastMessage.slice(0, 45) + "..."
                                : item.lastMessage
                            : 'Start Chat!'}
                        </Text>
                    </View>
                    <View style={{borderBottomWidth: 1, borderBottomColor: '#CBD5E0',}}></View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: rMS(4),
    marginBottom: rMS(4),
  },
  titleContainer: {
    paddingLeft: rMS(20),
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 1,
    fontSize: rMS(30),
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noChatContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participants: {
    fontSize: rMS(16),
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: rMS(14),
    color: '#666',
  },
  imageViewContainer: {
    marginRight: '3%',
    justifyContent: 'center',
  },
  image: {
    width: rMS(70),
    height: rMS(70),
    borderRadius: rMS(100) / 2,
  },
  userInfoContainer: {
    marginLeft: '0.5%'
  },
  userContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  }
});

export default ChatListScreen;
