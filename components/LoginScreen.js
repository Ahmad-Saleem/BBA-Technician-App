import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView,Image,TouchableOpacity, ScrollView, CheckBox} from 'react-native';
import {Form, Item, Input, Label, Button, ListItem, Body} from "native-base";


export default class LoginScreen extends React.Component {
    render(){
  return (
    <ScrollView style={{backgroundColor:"#fff"}}>
    <KeyboardAvoidingView
        style={styles.container}
        behavior="position"
        enabled
      >
        <View style={styles.logoContainer}>
          
          <Text style={styles.logotext}>BBA Technician App</Text>
        </View>
        <Form style={styles.form}>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={email => this.setState({ email })}
            />
          </Item>
          <Item floatingLabel>
            <Label>password</Label>
            <Input
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={password => this.setState({ password })}
            />
          </Item>
          <View style={styles.check}>
                <CheckBox checked={false} />
                <Text style={{alignSelf:"center"}}>Remember me</Text>
          </View>
            
          
          <Button
            style={styles.button} 
            onPress={() => this.props.navigation.navigate('HomeScreen')}
          >
            <Text style={styles.buttonText}>LogIn</Text>
          </Button>
        </Form>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.help}>
            <Text>Forgot Password?</Text>
            
          </TouchableOpacity>
          <TouchableOpacity style={styles.help}>
            
            <Text>Need Help</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </ScrollView>
  );
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff"
    },
    logoContainer: {
      alignItems: "center",
      marginTop: 100,
      marginBottom: 100
    },
    logotext: {
        fontSize: 20,
        fontWeight: "bold",

    },
    form: {
      padding: 20,
      width: "100%",
      marginBottom: 30,
    },
    check:{
        marginTop:10,
        flexDirection:"row",
        marginLeft:5
    },
    button: {
      marginTop: 20,
      width:200,
      borderRadius:10,
      backgroundColor:"purple",
      justifyContent:"center",
      alignSelf:"center"
    },
    buttonText: {
      color: "#fff"
    },
    footer: {
      alignItems: "center"
    },
    help:{
        alignItems:"center"
    }
  });