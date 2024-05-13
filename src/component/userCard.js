import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import app from '../../auth/db/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore,
  arrayUnion,
  collection,
  query,
  getDocs,
  where,
  doc,
  updateDoc,
  addDoc,
  getDoc,
  arrayRemove } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const UserCard = ({ user, onNextUser }) => {
    const [userList, setUserList] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const db = getFirestore(app);
    const navigation = useNavigation();

    console.log("user from userCard: ", user)

    const handleLiked = async () => {
      // 좋아요 누르면 상대방에 likes 에 있으면 매치, 상대방 likes 에서 지우기 return
      // 아니면 내 likes 에 추가, 상대방 likedby 에 추가
    try {
            const savedUserId = await AsyncStorage.getItem("id");
            const savedUserEmail = await AsyncStorage.getItem("email");
            const savedUserName = await AsyncStorage.getItem("name");
            const myDocRef = doc(db, 'users', savedUserId);
            const myLikedBySnapshot = await getDoc(myDocRef)
            const myLikedBy = myLikedBySnapshot.data().likedby || [];

            let userEmail;
            if (typeof(user) === 'string') {
              userEmail = user;
            }
            else {
              userEmail = user.email;
            }

            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', userEmail));
            const querySnapshot = await getDocs(q);
            const userDoc = querySnapshot.docs[0];
            const likedUserRef = doc(db, 'users', userDoc.id);

            const userDocSnap = await getDoc(likedUserRef);
            const userData = userDocSnap.data();
            const userName = userData.name;
            console.log("userDocName: ", userName)

            // 내가 좋아요 누른 사람의 이메일이 내 likedby 에 있으면 매치
            if (myLikedBy.includes(userEmail)) {
              console.log('its a match!')
              const chatsRef = collection(db, 'chats');
              const newChatRef = await addDoc(chatsRef, {
                participants: [savedUserEmail, userEmail],
                messages: [""],
                participantsName: [userName, savedUserName]
              });
              const chatId = newChatRef.id;
              await updateDoc(likedUserRef, {
                chatId: arrayUnion(chatId)
              });
              await updateDoc(myDocRef, {
                chatId: arrayUnion(chatId)
              });
              // 상대방의 likes 에 지우기.
              const userDocRef = doc(db, 'users', userDoc.id);
              await updateDoc(userDocRef, {
                  likes: arrayRemove(savedUserEmail)
              });
              // 내 likedby 에서 지우기
              await updateDoc(myDocRef, {
                likedby: arrayRemove(userEmail)
              });

              // 나와 상대방에 chatWith 에 이메일 넣어서 처음 사람 검색할때 채팅중인 사람은 안뜨게
              await updateDoc(userDocRef, {
                chatsWith: arrayUnion(savedUserEmail)
              });
              await updateDoc(myDocRef, {
                chatsWith: arrayUnion(userEmail)
              });
              onNextUser();

              return;
            }
            
            // 내 likes 에 상대방 이메일 추가
            if (typeof(user) === 'string') {
              const updateLikes = {
                  likes: arrayUnion(user),
              };
              await updateDoc(myDocRef, updateLikes);
            }
            else{
              const updateLikes = {
                likes: arrayUnion(user.email),
              };
              await updateDoc(myDocRef, updateLikes);
            }

            // 상대방의 liked by 에 내 이메일 추가하기
            const updateLikedBy = {
                likedby: arrayUnion(savedUserEmail),
            };
            await updateDoc(likedUserRef, updateLikedBy);     
        } catch (error) {
            console.log(error);
        }
        onNextUser();
    }

    const handleDislike = async () => {
      console.log("disLiked: ", user);
      
      const savedUserId = await AsyncStorage.getItem("id");

      try {
        const myDocRef = doc(db, 'users', savedUserId);

        let userEmail;
        if (typeof(user) === 'string') {
          userEmail = user;
        }
        else {
          userEmail = user.email;
        }

        await updateDoc(myDocRef, {
          likedby: arrayRemove(userEmail)
        });
      } catch (e) {
        console.log(e);
      }

      onNextUser();
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        if (typeof user === 'string') {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', user));
          const querySnapshot = await getDocs(q);
          const userDoc = querySnapshot.docs[0].data();
          setUserList(userDoc);
        } else {
          setUserList(user);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [user]);

  if (isLoading) {
    {console.log("isloading")}
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text>{userList.name}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.likeButton]} onPress={handleLiked}>
            <Text style={[styles.buttonText, styles.likeButtonText]}>O</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  likeButton: {
    backgroundColor: 'green',
  },
  likeButtonText: {
    color: '#ffffff',
  },
});

export default UserCard;