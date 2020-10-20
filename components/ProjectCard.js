import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "native-base";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";

const mapStateToProps = (state) => {
  return {
    equipments: state.equipments,
    projects: state.projects.projects,
    completed: state.completed,
    timestamps: state.timestamps,
  };
};

class ProjectCard extends React.Component {
  render() {
    const project = this.props.projects.find(
      (item) => item.id === this.props.projId
    );
    const equipments = this.props.equipments.equipments.filter(
      (item) => item.projId === project.id
    );
    const completed = equipments.map((obj) =>
      this.props.completed.includes(obj.id) && obj.id
    );
    const totalDuration = this.props.timestamps
      .map((obj) => (completed.includes(obj.id) ? obj.duration : 0))
      .reduce((a, b) => a + b, 0);

    return (
      <View style={styles.cardstyle}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "400" }}>
            {project.name}
          </Text>
          {completed.length == equipments.length && !completed.includes(false) && (
            <View style={[styles.mediaButton, { marginRight: 8, width: 100, alignItems:"center" }]}>
              <Icon
                type="FontAwesome"
                name="clock-o"
                style={{ fontSize: 17, color: "#0074B1" }}
              />

              <Text style={{ color: "#0074B1", marginLeft: 5,  fontSize:17 }}>
                {("0" + Math.floor(totalDuration / (1000 * 60 * 60))).slice(
                  -2
                ) +
                  ":" +
                  ("0" + Math.floor(totalDuration / (1000 * 60))).slice(-2) +
                  ":" +
                  ("0" + Math.floor(totalDuration / 1000)).slice(-2)}
              </Text>
            </View>
          ) }
          {/* : (
            <View style={[styles.mediaButton, { marginRight: 8, width: 100 }]}>
              <Icon
                type="FontAwesome"
                name="clock-o"
                style={{ fontSize: 20, color: "#0074B1" }}
              />

              <Text style={{ color: "#0074B1", marginLeft: 5 }}>Start</Text>
            </View>
          )} */}
        </View>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <Text style={{ paddingRight: 3, fontWeight: "bold" }}>
            {project.pcontact}
          </Text>
          <Text
            style={{
              borderLeftColor: "lightgray",
              borderRightColor: "lightgray",
              borderLeftWidth: 1,
              borderRightWidth: 1,
              paddingLeft: 3,
              paddingRight: 3,
            }}
          >
            AHU
          </Text>
          <Text style={{ paddingLeft: 3, borderLeftColor: "lightgray" }}>
            {project.stdate}
          </Text>
        </View>
        <Text style={{ color: "gray", marginBottom: 10 }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga non
          impedit debitis ipsa repellendus vero obcaecati consequuntur porro
          nihil at.
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Icon
              type="FontAwesome"
              name="calendar"
              style={{ fontSize: 20, color: "black", marginRight: 10 }}
            />

            <Text style={{ color: "black" }}>{project.stdate}</Text>
          </View>
          {completed.length == equipments.length && !completed.includes(false) ? (
            <View
              style={[
                styles.mediaButton,
                { marginRight: 8, backgroundColor: "#0074B1", width: 150 },
              ]}
            >
              <Icon
                type="FontAwesome"
                name="check"
                style={{ fontSize: 20, color: "white", marginRight: 10 }}
              />

              <Text style={{ color: "white" }}>Done</Text>
            </View>
          ) : (
            <View
              style={[
                styles.mediaButton,
                { marginRight: 8, backgroundColor: "black", width: 150 },
              ]}
            >
              <Icon
                type="FontAwesome"
                name="check"
                style={{ fontSize: 20, color: "white", marginRight: 10 }}
              />

              <Text style={{ color: "white" }}>Complete</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  cardstyle: {
    width: 323,
    height: 220,
    alignSelf: "center",
    borderRadius: 3,
    borderWidth: 1,
    borderTopColor: "lightgray",
    borderBottomColor: "lightgray",
    borderRightColor: "lightgray",
    borderLeftWidth: 7,
    borderLeftColor: "black",
    padding: 10,
    marginBottom: 10,
  },
  mediaButton: {
    padding: 10,
    flexDirection: "row",
    backgroundColor:"#F4F4F4",
    borderRadius: 5,
    justifyContent: "center",
  },
});

export default connect(mapStateToProps)(ProjectCard);
