import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import firebase from "../database/firebaseDB"

export default function ChatScreen({ navigation, route }) {
  const [messages, setMessages] = useState([]);

  const UserID = route.params.ChatObject.userid;
  const ProfileName = route.params.ChatObject.username;
  const imageData = route.params.ChatObject.userimage;
  
  const MsgDB = firebase.firestore().collection("chat" + route.params.ChatObject.chatid);

  // Draw the custom headers on the top header bar
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => Logout()}>
          <MaterialCommunityIcons name="logout" size={32} color="black" style={{marginRight: 10,}} />
        </TouchableOpacity>
      ),
    });
    navigation.setOptions({
      title: "Room: " + route.params.ChatObject.chattitle,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = MsgDB.orderBy("createdAt", "desc").onSnapshot((collection) => {
      const updatedMessage = collection.docs.map((doc) => {
        
        // create our own object that pulls the ID into a property
        let MessageObject = {
          ...doc.data(),
          FirebaseID: doc.id,
        };

        MessageObject.createdAt = new Date(MessageObject.createdAt.seconds * 1000);

        return MessageObject;
      });

      setMessages(updatedMessage);
    });

    return () => {
      unsubscribe();
    }
  }, []);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ])
  // }, [])

  function SendMessage(newMessages) {
    newMessages.forEach(function(message) {
      MsgDB.add(message);
    });    
  }

  function Logout() {
    firebase.auth().signOut()
  }

  const renderBubble = (props) => (
    <Bubble
      {...props}
      textStyle={{
        left: { color: 'black' },
        right: { color: 'black' },
      }}
      wrapperStyle={{
        left: { backgroundColor: 'lightgrey' },
        right: { backgroundColor: 'lightgreen' },
      }}
    />
  );

  return (
    <GiftedChat messages={messages} 
      onSend={messages => SendMessage(messages)} 
      user={{ _id: UserID, name: ProfileName, avatar: 'data:image/jpeg;base64,' + imageData }} 
      renderUsernameOnMessage={true}
      showUserAvatar={true}
      showAvatarForEveryMessage={true}
      renderBubble={renderBubble}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});