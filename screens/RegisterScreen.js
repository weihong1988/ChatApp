import React, { useState, useEffect } from 'react';
import { Alert, Image, Platform , StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import firebase from "../database/firebaseDB"

const UsersDB = firebase.firestore().collection("users");

export default function RegisterScreen({ navigation, route }) {
  const [ProfileName, setProfileName] = React.useState("");
  const [ProfileNameError, setProfileNameError] = React.useState(false);

  const [imageData, setImageData] = useState(null);
  const [ProfilePicError, setProfilePicError] = React.useState(false);

  const [RegisterEmail, setRegisterEmail] = React.useState("");
  const [EmailError, setEmailError] = React.useState(false);

  const [RegisterPassword, setRegisterPassword] = React.useState("");
  const [PasswordError, setPasswordError] = React.useState(false);

  const [ErrorMessage, setErrorMessage] = React.useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, camera permissions are needed.');
        }
      }
    })();
  }, []);

  const LaunchCamera = async () => {
    var cameraResponse = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (cameraResponse.cancelled) {
      return;
    }

    const FormattedImage = await ImageManipulator.manipulateAsync(
      cameraResponse.localUri || cameraResponse.uri,
      [{resize: { width: 200, height: 200, }}],
      {compress: 0.7, base64: true}
    );

    setImageData(FormattedImage.base64);
  };

  function Register() {
    var ErrorFound = false;

    if (ProfileName == "") {
      setProfileNameError(true);
      setErrorMessage("Profile Name cannot be blank");
      ErrorFound = true;
    }
    else {
      setProfileNameError(false);
    }

    if (imageData == null) {
      setProfilePicError(true);
      setErrorMessage("Profile Picture cannot be blank");
      ErrorFound = true;
    }
    else {
      setProfilePicError(false);
    }

    if (RegisterEmail == "") {
      setEmailError(true);
      setErrorMessage("Email cannot be blank");
      ErrorFound = true;
    }
    else {
      setEmailError(false);
    }

    if (RegisterPassword == "") {
      setPasswordError(true);
      setErrorMessage("Password cannot be blank");
      ErrorFound = true;
    }
    else {
      setPasswordError(false);
    }

      if (!ErrorFound) {
        firebase.auth().createUserWithEmailAndPassword(RegisterEmail, RegisterPassword)
          .then((userCredential) => {
            UsersDB.doc(RegisterEmail.toLowerCase()).set({
              ProfileName: ProfileName,
              Pic: imageData
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
              setErrorMessage(error);
            });
          
            // Signed in 
            var user = userCredential.user;

            Alert.alert("Registration Successful");
          })
          .catch((error) => {
            var errorMessage = error.message;
            
            setErrorMessage(errorMessage);
          });
      }
  }



  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.TitleText}>Register New Account</Text>

        <Text style={styles.LabelText}>Profile Name</Text>
        <TextInput style={styles.input} onChangeText={setProfileName} value={ProfileName} placeholder="Your Nickname" underlineColorAndroid={ProfileNameError ? "red" : "transparent"} />

        <Text style={styles.LabelText}>Profile Pic</Text>
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity style={styles.CameraButton} onPress={LaunchCamera}>
            <MaterialCommunityIcons name="camera-plus" size={72} color="black" />
          </TouchableOpacity>
          <View style={{width: 130, height: 130, borderWidth: 3, borderColor: ProfilePicError ? "red" : "black", alignItems: 'center', justifyContent: 'center',}} >
            {imageData == null ?
              <MaterialCommunityIcons name="face" size={72} color="black" /> :
              <Image source={{ uri: 'data:image/jpeg;base64,' + imageData }} style={{ width: 120, height: 120 }} borderRadius={60} />}
            
          </View>
        </View>
        <Text style={styles.LabelText}>Email</Text>
        <TextInput style={styles.input} onChangeText={setRegisterEmail} value={RegisterEmail} placeholder="Email Address" keyboardType="email-address" underlineColorAndroid={EmailError ? "red" : "transparent"} />

        <Text style={styles.LabelText}>Password</Text>
        <TextInput style={styles.input} onChangeText={setRegisterPassword} value={RegisterPassword} placeholder="Password" secureTextEntry={true} underlineColorAndroid={PasswordError ? "red" : "transparent"} />

        <TouchableOpacity style={styles.button} onPress={() => Register()}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.ErrorMessage}>{ ErrorMessage }</Text>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  TitleText: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 0,
    marginBottom: 10,
    marginLeft: '10%',
  },
  LabelText: {
    color: 'black',
    fontSize: 28,
    marginTop: 15,
    marginLeft: '10%',
  },
  input: {
    height: 40,
    width: '80%',
    marginTop: 10,
    marginBottom: 15,
    marginLeft: '10%',
    borderWidth: 1,
    padding: 10,
  },
  CameraButton: {
    marginLeft: '10%',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    marginRight: 30,
  },
  button: {
    backgroundColor: 'green',
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginLeft: '10%',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  ErrorMessage: {
    color: 'red',
    fontSize: 18,
    marginTop: 0,
    marginLeft: '10%',
    marginRight: '10%',
  },
});