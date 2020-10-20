import { StatusBar } from "expo-status-bar";

import React from "react";
import { Auth } from "aws-amplify";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import HomeScreen from "./HomeScreen";
import ProjectScreen from "./ProjectScreen";
import SelectImages from "./SelectImages";
import Requirements from "./Requirements";
import AddCaptions from "./AddCaptions";
import { connect } from "react-redux";
import { Icon } from "native-base";
import {
  fetchProjects,
  fetchEquipments,
  fetchNotes,
} from "../redux/ActionCreators";


const mapStateToProps = (state) => {
  return {
    projects: state.projects,
    equipments: state.equipments,
    notes: state.notes,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchProjects: () => dispatch(fetchProjects()),
  fetchEquipments: () => dispatch(fetchEquipments()),
  fetchNotes: () => dispatch(fetchNotes()),
});

const Stack = createStackNavigator();

class Main extends React.Component {
  componentDidMount() {
    this.props.fetchEquipments();
    this.props.fetchProjects();
    this.props.fetchNotes();
  }

  async signOut() {
    try {
      await Auth.signOut();
      this.props.updateAuthState("loggedOut");
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  }
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "#000",
            headerTitleStyle: { color: "#fff" },
          }}
        />
        <Stack.Screen
          name="Project"
          component={ProjectScreen}
          options={{
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "#fff",
            headerTitleStyle: { color: "#fff" },
            
          }}
        />
        <Stack.Screen
          name="Requirements"
          component={Requirements}
          options={{
            headerStyle: { backgroundColor: "#000" },
            headerTitleContainerStyle: { marginLeft:-25 },
            headerTintColor: "#fff",
            headerTitleStyle: { color: "#fff" },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => alert("This is a button!")}
                style={{
                  width: 140,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  borderColor: "#fff",
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 5,
                  marginRight: 20,
                }}
              >
                <Icon
                  type="FontAwesome"
                  name="check"
                  style={{ fontSize: 15, color: "white", marginRight: 7 }}
                />
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 15, paddingTop:3,paddingBottom:3 }}
                >
                  Update
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Images"
          component={SelectImages}
          options={{
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "#fff",
            headerTitleStyle: { color: "#fff" },
            
          }}
        />
        <Stack.Screen
          name="AddCaptions"
          component={AddCaptions}
          options={{
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "#fff",
            headerTitleStyle: { color: "#fff" },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => alert("This is a button!")}
                style={{
                  width: 140,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  borderColor: "#fff",
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 5,
                  marginRight: 20,
                }}
              >
                <Icon
                  type="FontAwesome"
                  name="check"
                  style={{ fontSize: 20, color: "white", marginRight: 10 }}
                />
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 15, paddingTop:3,paddingBottom:3 }}
                >
                  Update
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
      </Stack.Navigator>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
