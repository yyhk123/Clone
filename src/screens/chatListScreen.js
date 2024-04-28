import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import {rMS, rV, rS} from '../styles/responsive'
import app from '../../auth/db/firestore';

// chat 지우면 AsyncStorage.getItem('chatList'); 에서도 지우기
const ChatListScreen = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const savedUserEmail = AsyncStorage.getItem("email");
  const savedUserName = AsyncStorage.getItem("name");

  const navigation = useNavigation();
  const db = getFirestore(app);

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const savedUserId = await AsyncStorage.getItem("id");
      const userDocRef = doc(db, 'users', savedUserId);
      const userDocSnap = await getDoc(userDocRef);
      const userChats = userDocSnap.data().chatId || []; // Make sure to handle case where chatId is undefined or null
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
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();

  }, []); 
  
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="px-4">
        <View style={styles.titleContainer}>
          <Text  style={styles.title}>
            chat
          </Text>
        </View>
        {chats.length === 0 ? (
          <View style={styles.noChatContainer}>
            <Text>No Matches</Text>
          </View>
        ) : (
          <View>
            <FlatList
              data={chats}
              renderItem={({ item }) => (
                <TouchableOpacity
                className="w-9/10 py-3 items-center flex-row border-b  border-neutral-300"
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

                  <View style={styles.userListContainer}>
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
                </TouchableOpacity>
              )}
            />
          </View>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: '4%',
    marginBottom: '3%',
    marginLeft: '1%',
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
  userListContainer: {
    marginLeft: '0.5%'
  }
});

export default ChatListScreen;