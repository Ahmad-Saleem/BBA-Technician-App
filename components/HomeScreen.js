import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Icon } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import ProjectCard from "./ProjectCard";
import { connect } from "react-redux";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { baseUrl } from "../shared/baseUrl";
import { Loading } from "./LoadingComponent";


const mapStateToProps = (state) => {
  return {
    projects: state.projects,
  };
};

class HomeScreen extends React.Component {
  render() {
    let projects = this.props.projects.projects;
    let projectlist = [];
    projectlist = projects.map((project) => (
      <TouchableOpacity
        key={project.id}
        onPress={() =>
          this.props.navigation.navigate("Project", {
            id: project.id,
          })
        }
      >
        <ProjectCard
          projId={project.id}
        />
      </TouchableOpacity>
    ));
    if (this.props.projects.isLoading) {
      return <Loading />;
    } else if (this.props.projects.errMess) {
      return (
        <View>
          <Text>{this.props.projects.errMess}</Text>
        </View>
      );
    } else {
      return (
        <ScrollView style={{backgroundColor:"#fff"}}>
          <StatusBar style="light" />
          <View style={styles.pcontact}>
            <View>
            <Text style={{ fontSize: 25 }}>Hello, John Doe</Text>
            <Text style={{ fontSize: 18, color:"#616161" }}>
              Check the projects here
            </Text>
            </View>
            <MaterialCommunityIcons name="tooltip-text-outline" size={24} color="#0074B1" />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 20,
            }}
          >
            <Text style={{ fontSize: 23, fontWeight: "500" }}>Projects</Text>

            <View
              style={{
                backgroundColor:"#F4F4F4",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 6,
                borderRadius: 4,
              }}
            >
              <MaterialCommunityIcons name="check-all" size={20} color="#0074B1" style={{ marginRight: 10 }} />
              {/* <Icon
                type="FontAwesome"
                name="check"
                style={{ fontSize: 20, color: "#0074B1", marginRight: 10 }}
              /> */}
              <Text>1/{this.props.projects.projects.length}</Text>
            </View>
          </View>

          
          {projectlist}
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cardstyle: {
    width: 300,
    alignSelf: "center",
    borderRadius: 10,
    alignItems: "center",
  },
  pcontact: {
    height: 100,
    justifyContent: "space-between",
    alignItems:"center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    flexDirection:"row",
    paddingLeft:20,
    paddingRight:20,
  },
});

export default connect(mapStateToProps)(HomeScreen);
