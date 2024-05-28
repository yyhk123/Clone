import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import { ChevronLeftIcon, PaperAirplaneIcon } from "react-native-heroicons/outline";
import { EllipsisHorizontalIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, getDoc, doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import app from '../../auth/db/firestore';
import { rMS } from '../styles/responsive';

const ChatDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { chatId, matchedName } = route.params;
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  
  const db = getFirestore(app);
  const savedUserName = AsyncStorage.getItem("name");

  const flatListRef = useRef(null);

  useEffect(() => {
    const chatDocRef = doc(db, 'chats', chatId);
    const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setMessages(docSnap.data().messages || []);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const savedUserEmail = await AsyncStorage.getItem("email");
    const message = {
      text: newMessage,
      createdAt: new Date().toISOString(),
      sender: savedUserEmail,
    };

    const chatDocRef = doc(db, 'chats', chatId);
    await updateDoc(chatDocRef, {
      messages: arrayUnion(message),
    });

    setNewMessage('');

    flatListRef.current.scrollToEnd();
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
            <View style={{ marginRight: rMS(10) }}>
              <Image source={require('../face.jpg')} style={styles.image} />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={styles.displayName}>{matchedName}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.optionContainer}
          onPress={() => navigation.navigate("ChatListScreen")}
        >
          <EllipsisHorizontalIcon
            size={rMS(30)}
            color={"black"}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {/* Chat messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageSender}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
      />

      {/* Message input */}
      <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline={true}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <PaperAirplaneIcon size={20} color={"white"} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: rMS(10),
    paddingRight: rMS(10),
    paddingTop: rMS(5),
    paddingBottom: rMS(5),
  },
  backNavigator: {
    marginRight: rMS(10),
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: rMS(40),
    height: rMS(40),
    borderRadius: rMS(20),
  },
  displayName: {
    fontSize: rMS(15),
    fontWeight: 'bold',
  },
  optionContainer: {
    marginLeft: rMS(10),
  },
  messagesList: {
    padding: rMS(10),
  },
  messageContainer: {
    marginBottom: rMS(10),
    padding: rMS(10),
    backgroundColor: '#f0f0f0',
    borderRadius: rMS(10),
  },
  messageSender: {
    fontWeight: 'bold',
  },
  messageText: {
    marginTop: rMS(5),
  },
  messageTime: {
    marginTop: rMS(5),
    fontSize: rMS(12),
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: rMS(9),
    marginRight: rMS(9),
    marginTop: rMS(6),
    marginBottom: rMS(5),
    backgroundColor: '#f0f0f0',
    borderRadius: rMS(20),
  },
  input: {
    flex: 1,
    padding: rMS(10),
    borderRadius: rMS(20),
    marginLeft: rMS(3)
  },
  sendButton: {
    marginLeft: rMS(3),
    marginRight: rMS(3),
    backgroundColor: '#007bff',
    borderRadius: rMS(20),
    padding: rMS(10),
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatDetailScreen;