import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { ChevronLeftIcon, PaperAirplaneIcon } from "react-native-heroicons/outline";
import { EllipsisHorizontalIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import app from '../../auth/db/firestore';
import { rMS } from '../styles/responsive';
import MessageList from '../component/messageList';

const ChatDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { chatId, matchedName } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const db = getFirestore(app);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const savedUserEmail = await AsyncStorage.getItem("email");
      setUserEmail(savedUserEmail);
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    const chatDocRef = doc(db, 'chats', chatId);
    const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setMessages(docSnap.data().messages || []);
        setIsLoading(false);
        scrollToBottom();
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const message = {
      text: newMessage,
      createdAt: new Date().toISOString(),
      sender: userEmail,
    };

    const chatDocRef = doc(db, 'chats', chatId);
    await updateDoc(chatDocRef, {
      messages: arrayUnion(message),
      updatedAt: new Date().toISOString(),
    });

    setNewMessage('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }, 50);
  };

  const scrollToBottomAnimated = () => {
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }, 50);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollToBottomAnimated(); // Scroll to bottom when keyboard shows
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, paddingBottom: rMS(3)}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.headerContainer}>
          {/* Back button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backNavigator}
            onPress={() => navigation.navigate("ChatListScreen")}
          >
            <ChevronLeftIcon size={35} color={"black"} strokeWidth={2} />
          </TouchableOpacity>

          {/* User detail */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.imageContainer}
            onPress={() => navigation.navigate("ChatListScreen")}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../face.jpg')} style={styles.image} />
              <Text style={styles.displayName}>{matchedName}</Text>
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          {/* Options button */}
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

        {/* Messages */}
        <MessageList scrollViewRef={scrollViewRef}  messages={messages} currentUser={userEmail}/>

        {/* Message input */}
        <View style={styles.inputContainer}>
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
        </View>
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
    paddingHorizontal: rMS(10),
    paddingVertical: rMS(5),
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
    marginRight: rMS(10),
  },
  displayName: {
    fontSize: rMS(15),
    fontWeight: 'bold',
  },
  optionContainer: {
    marginLeft: rMS(10),
  },
  messagesContainer: {
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
    marginLeft: rMS(3),
    
  },
  sendButton: {
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
