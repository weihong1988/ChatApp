import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import firebase from "../database/firebaseDB"

const UsersDB = firebase.firestore().collection("users");
const ChatroomDB = firebase.firestore().collection("chatrooms");

export default function ChatRoomScreen({ navigation, route }) {
  const [NewChatroomName, setNewChatroomName] = React.useState("");
  const [Chatrooms, setChatrooms] = useState([]);

  const [UserID, setUserID] = useState("Anonymous");
  const [imageData, setImageData] = useState(null);
  const [ProfileName, setProfileName] = React.useState("");

  // Draw the custom headers on the top header bar
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => Logout()}>
          <MaterialCommunityIcons name="logout" size={32} color="black" style={{marginRight: 10,}} />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setUserID(firebase.auth().currentUser.uid);

        UsersDB.doc(user.email).get().then((doc) => {
          if (doc.exists) {
            setImageData(doc.data().Pic);
            setProfileName(doc.data().ProfileName);
          }
        }).catch((error) => {
          console.log("Error getting document:", error);
        });
        navigation.navigate("Chat Rooms");
      } 
      else {
        navigation.navigate("Login")
      }
    });
  }, [])

  useEffect(() => {
    const unsubscribe = ChatroomDB.orderBy("createdAt", "desc").onSnapshot((collection) => {
      const availableRooms = collection.docs.map((doc) => {      
        // create our own object that pulls the ID into a property
        let RoomObject = {
          ...doc.data(),
          FirebaseID: doc.id,
        };

        return RoomObject;
      });

      setChatrooms(availableRooms);
    });

    return () => {
      unsubscribe();
    }
  }, []);

  function NewChat() {
    if (NewChatroomName != "") {
      const newChatroomObject = {
        title: NewChatroomName,
        createdAt: Date.parse(new Date()),
        owner: ProfileName,
        picture: imageData,
      }

      ChatroomDB.add(newChatroomObject);

      setNewChatroomName("");
    }
  }

  function GoToChatRoom(item) {
    let ChatObject = {
      userid: UserID,
      username: ProfileName,
      userimage: imageData,
      chatid: item.FirebaseID,
      chattitle: item.title,
    };

    navigation.navigate("Chat", {ChatObject});
  }

  function Logout() {
    firebase.auth().signOut()
  }

  // Renderer for FlatList
  function renderItem({ item }) {

    return (
      <TouchableOpacity onPress={() => GoToChatRoom(item)}>
        <View style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: 'center',
        padding: 10,
        width: '100%',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: "lightyellow",
        }}>
          <Image source={{ uri: 'data:image/jpeg;base64,' + item.picture }} style={{ width: 60, height: 60 }} borderRadius={30} />
          <View>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.authorText}>{item.owner}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection:"row", alignItems: 'center', justifyContent: 'space-between', marginTop: 10,}}>
        <TextInput style={styles.input} onChangeText={setNewChatroomName} value={NewChatroomName} placeholder="New Chatroom" />
        <TouchableOpacity onPress={() => NewChat()}>
          <MaterialCommunityIcons name="account-multiple-plus" size={48} color="black" style={{marginRight: '10%'}} />
        </TouchableOpacity>
      </View>
      <FlatList style={styles.list} data={Chatrooms} renderItem={renderItem} keyExtractor={(item, index) => item.FirebaseID} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    marginTop: 25,
    width: "100%",
    paddingHorizontal: 10,
  }, 
  input: {
    height: 40,
    width: '60%',
    marginTop: 10,
    marginBottom: 15,
    marginLeft: '10%',
    marginRight: '5%',
    borderWidth: 1,
    padding: 10,
  },
  titleText: {
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: 28,
    width: "100%",
  },
  authorText: {
    marginLeft: 20,
    fontSize: 12,
    fontStyle: 'italic',
    width: "100%",
  },
});