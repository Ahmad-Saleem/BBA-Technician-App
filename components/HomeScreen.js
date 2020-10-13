import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Icon } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import ProjectCard from "./ProjectCard";
import { connect } from "react-redux";
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
          this.props.navigation.navigate("ProjectScreen", {
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
          <View style={styles.pcontact}>
            <Text style={{ fontSize: 25 }}>Hello, John Doe</Text>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
              Check the projects here
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 20,
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "200" }}>Projects</Text>

            <View
              style={{
                borderWidth: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 6,
                borderRadius: 4,
              }}
            >
              <Icon
                type="FontAwesome"
                name="check"
                style={{ fontSize: 20, color: "gray", marginRight: 10 }}
              />
              <Text>1/9</Text>
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
    justifyContent: "center",
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    margin: 10,
  },
});

export default connect(mapStateToProps)(HomeScreen);
