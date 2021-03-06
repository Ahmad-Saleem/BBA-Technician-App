import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ProjectCard from "./ProjectCard";
import { connect } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Loading } from "./LoadingComponent";

const mapStateToProps = (state) => {
  return {
    user: state.user,
    completed: state.completed,
  };
};

let width = Dimensions.get("window").width;

class HomeScreen extends React.Component {
  render() {
    const projects = this.props.user?.user.assigned_projects_as_technician;
    let projectsCompleted = 0;
    for (let index = 0; index < projects?.length; index++) {
      let equips = projects[index].equipments;
      let complete = equips?.map(
        (obj) => this.props.completed?.includes(obj.id) && obj.id
      );
      if (equips.length === complete.length && !complete?.includes(false)) {
        projectsCompleted++;
      }
    }
    let projectlist = [];

    projectlist = projects?.map((project) => (
      <TouchableOpacity
        key={project.id}
        onPress={() =>
          this.props.navigation.navigate("Project", {
            id: project.id,
          })
        }
      >
        <ProjectCard projId={project.id} />
      </TouchableOpacity>
    ));

    if (this.props.user.isLoading) {
      return <Loading />;
    } else if (this.props.user.errMess) {
      return (
        <View>
          <Text>{this.props.user.errMess}</Text>
        </View>
      );
    } else {
      return (
        <ScrollView style={{ backgroundColor: "#fff" }}>
          <StatusBar style="light" />
          <View style={styles.pcontact}>
            <View>
              <Text style={{ fontSize: width / 15 }}>
                Hello,{" "}
                {this.props.user.user.first_name +
                  " " +
                  this.props.user.user.last_name}
              </Text>
              <Text style={{ fontSize: width / 20, color: "#616161" }}>
                Check the projects here
              </Text>
            </View>
            {/* <TouchableOpacity onPress={() => Linking.openURL(`sms:8094050767`)}>
              <MaterialCommunityIcons
                name="tooltip-text-outline"
                size={width/12}
                color="#0074B1"
              />
            </TouchableOpacity> */}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: width / 15, fontWeight: "500" }}>
              Projects
            </Text>

            <View
              style={{
                backgroundColor: "#F4F4F4",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 6,
                paddingBottom: 6,
                borderRadius: 5,
                width: 96,
              }}
            >
              <MaterialCommunityIcons
                name="check-all"
                size={width / 18}
                color="#0074B1"
                style={{ marginRight: 10 }}
              />
              {/* <Icon
                type="FontAwesome"
                name="check"
                style={{ fontSize: 20, color: "#0074B1", marginRight: 10 }}
              /> */}
              <Text>
                {projectsCompleted}/{projects.length}
              </Text>
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
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default connect(mapStateToProps)(HomeScreen);
