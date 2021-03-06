import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "native-base";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    // equipments: state.equipments,
    projects: state.user.user.assigned_projects_as_technician,
    completed: state.completed,
    timestamps: state.timestamps,
  };
};

class ProjectCard extends React.Component {

  render() {
    const project = this.props.projects?.find(
      (item) => item.id === this.props.projId
    );
    const equipments = project?.equipments
    const completed = equipments?.map(
      (obj) => this.props.completed?.includes(obj.id) && obj.id
    );
    const totalDuration = this.props.timestamps
      .map((obj) => (completed?.includes(obj.id) ? obj.duration : 0))
      .reduce((a, b) => a + b, 0);

    var month = new Array();
    month[0] = "";
    month[1] = "Jan";
    month[2] = "Feb";
    month[3] = "Mar";
    month[4] = "Apr";
    month[5] = "May";
    month[6] = "Jun";
    month[7] = "Jul";
    month[8] = "Aug";
    month[9] = "Sep";
    month[10] = "Oct";
    month[11] = "Nov";
    month[12] = "Dec";
    var s=new Date(project?.start_date)
    var c=new Date(project?.close_date)
    var e=("0"+s.getMonth()).slice(-2)+"/"+("0"+s.getDate()).slice(-2)+"/"+s.getFullYear()
    var d = month[s.getMonth()] +" "+ s.getDate() + " - " + month[c.getMonth()] + " " + c.getDate()+"/"+c.getFullYear();
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
            {project?.project_name}
          </Text>
          {completed?.length == equipments?.length && !completed?.includes(false) && (
            <View
              style={[
                styles.mediaButton,
                { marginRight: 8, width: 100, alignItems: "center" },
              ]}
            >
              <Icon
                type="FontAwesome"
                name="clock-o"
                style={{ fontSize: 17, color: "#0074B1" }}
              />

              <Text style={{ color: "#0074B1", marginLeft: 5, fontSize: 17 }}>
                {("0" + Math.floor(totalDuration / (1000 * 60 * 60))).slice(
                  -2
                ) +
                  ":" +
                  ("0" + Math.floor(totalDuration / (1000 * 60))).slice(-2) +
                  ":" +
                  ("0" + Math.floor(totalDuration / 1000)).slice(-2)}
              </Text>
            </View>
          )}
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
            Jim Brewin
          </Text>
          <Text
            style={{
              borderLeftColor: "lightgray",
              borderRightColor: "lightgray",
              borderLeftWidth: 1,
              borderRightWidth: 1,
              paddingLeft: 6,
              paddingRight: 6,
            }}
          >
            AHU
          </Text>
          <Text style={{ paddingLeft: 3, borderLeftColor: "lightgray" }}>
            {e}
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
          <View style={{ flexDirection: "row", width: 163 }}>
            <Icon
              type="FontAwesome"
              name="calendar"
              style={{ fontSize: 20, color: "black", marginRight: 10 }}
            />

            <Text style={{ color: "black" }}>{d}</Text>
          </View>
          {completed?.length == equipments?.length &&
          !completed?.includes(false) ? (
            <View
              style={[
                styles.mediaButton,
                { marginRight: 8, backgroundColor: "#0074B1", width: 120 },
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
                { marginRight: 8, backgroundColor: "black", width: 120 },
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
    width: 343,
    // height: 220,
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
    backgroundColor: "#F4F4F4",
    borderRadius: 5,
    justifyContent: "center",
  },
});

export default connect(mapStateToProps)(ProjectCard);
