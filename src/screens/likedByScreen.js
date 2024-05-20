import React, { useState, useEffect } from 'react'
import { View, Text, Button, StyleSheet, ActivityIndicator, BackHandler  } from 'react-native';
import { useNavigation, useNavigationState, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import app from '../../auth/db/firestore';
import { getFirestore, doc, onSnapshot  } from '@firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCard from '../component/userCard';

function useRouteName() {
  const navigationState = useNavigationState(state => state);
  return navigationState?.routes[navigationState?.index]?.name;
}

const LikedByScreen = () => {
  const [likedByLists, setLikedByLists] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the index of the current user to display
  const [showUserCard, setShowUserCard] = useState(true);
  const currentRouteName = useRouteName();
  const navigation = useNavigation();
  const db = getFirestore(app);

  useFocusEffect(
    React.useCallback(() => {
        const onBackPress = () => {
            if (currentRouteName === 'LikedByScreen') {
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
    const getLikedLists = async () => {
      try {
        const savedUserId = await AsyncStorage.getItem("id");
        if (!savedUserId) {
          throw new Error("No user ID found in AsyncStorage");
        }

        const docRef = doc(db, 'users', savedUserId);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const likedBy = docSnap.data().likedby || [];
            setLikedByLists(likedBy);
            setIsLoading(false);
            setCurrentIndex(0); // Reset index when data updates
          } else {
            console.log("No such document!");
            setLikedByLists([]);
            setIsLoading(false);
          }
        });

        // Cleanup function to unsubscribe from the snapshot listener when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching likedBy list:', error);
        setIsLoading(false);
      }
    };

    getLikedLists();
  }, [db]);

  const onNextUser = () => {
    setCurrentIndex(0);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {isLoading ? (
              <View>
                  <ActivityIndicator size="large" color={'#000000'} />
                  <Text>Loading...</Text>
              </View>
          ) : (
              <View>
              {showUserCard && currentIndex < likedByLists.length && <UserCard user={likedByLists[currentIndex]} onNextUser={onNextUser} />}
              {currentIndex === likedByLists.length && (
                  <Text>No more lists</Text>
              )}
          </View>
          )}
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LikedByScreen;