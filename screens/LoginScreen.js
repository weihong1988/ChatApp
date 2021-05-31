import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';

import firebase from "../database/firebaseDB"

export default function LoginScreen({ navigation, route }) {
  const [LoginEmail, setLoginEmail] = React.useState("");
  const [LoginPassword, setLoginPassword] = React.useState("");

  const [ErrorMessage, setErrorMessage] = React.useState("");

  function Login() {
    Keyboard.dismiss();

    firebase.auth().signInWithEmailAndPassword(LoginEmail, LoginPassword)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;

        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        setErrorMessage(errorMessage)
      });
  }

  function Register() {
    navigation.navigate("Register");
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.TitleText}>Chat With Friends!</Text>

        <Text style={styles.LabelText}>Email</Text>
        <TextInput style={styles.input} onChangeText={setLoginEmail} value={LoginEmail} placeholder="Enter Email" keyboardType="email-address" />

        <Text style={styles.LabelText}>Password</Text>
        <TextInput style={styles.input} onChangeText={setLoginPassword} value={LoginPassword} placeholder="Enter Password" secureTextEntry={true} />

        <TouchableOpacity style={styles.button} onPress={() => Login()}>
          <Text style={styles.buttonText}>Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.RegisterLink} onPress={() => Register()}>
          <Text style={styles.RegisterLinkText}>Register</Text>
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
    marginTop: 20,
    marginBottom: 20,
    marginLeft: '10%',
  },
  LabelText: {
    color: 'black',
    fontSize: 28,
    marginTop: 20,
    marginLeft: '10%',
  },
  input: {
    height: 40,
    width: '80%',
    marginTop: 10,
    marginBottom: 20,
    marginLeft: '10%',
    borderWidth: 1,
    padding: 10,
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
  RegisterLink: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: '10%',
  },
  RegisterLinkText: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 18,
  },
  ErrorMessage: {
    color: 'red',
    fontSize: 14,
    marginTop: 20,
    marginLeft: '10%',
    marginRight: '10%',
  },
});
