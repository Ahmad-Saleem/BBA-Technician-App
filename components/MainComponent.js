import { StatusBar } from "expo-status-bar";
import React from "react";
import { Auth } from "aws-amplify";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import HomeScreen from "./HomeScreen";
import ProjectScreen from "./ProjectScreen";
import Requirements from "./Requirements";
import { connect } from "react-redux";
import { fetchProjects, fetchEquipments, fetchNotes } from "../redux/ActionCreators";

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
    componentDidMount(){
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
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="ProjectScreen" component={ProjectScreen} />
          <Stack.Screen name="Requirements" component={Requirements} />
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
