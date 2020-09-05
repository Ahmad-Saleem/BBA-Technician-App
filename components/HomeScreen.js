import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Card, CardItem, Body} from "native-base";
import { ScrollView } from 'react-native-gesture-handler';
import ProjectCard from './ProjectCard';
import { PROJECTS } from '../shared/projects';





export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      projects: PROJECTS
    }
   
  }

 
    render()
    {
      let projectlist=[];
      projectlist = this.state.projects.map(projectinfo => (
        <TouchableOpacity key={projectinfo.id} onPress={() => this.props.navigation.navigate('ProjectScreen',{title:projectinfo.name, aline1:projectinfo.aline1, aline2:projectinfo.aline2, pcontact: projectinfo.pcontact, pdesig: projectinfo.pdesig})}>
        <ProjectCard projname={projectinfo.name} aline1={projectinfo.aline1} aline2={projectinfo.aline2} pcontact={projectinfo.pcontact} stdate={projectinfo.stdate} noahu={projectinfo.noahu}/>
        </TouchableOpacity>
      )
      )

        return (
        <ScrollView>
            <Card style={[styles.cardstyle,{position:"absolute",marginTop:10,zIndex:1}]}>
            <CardItem header>
              <Text>Hello, John Doe</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  User Description
                </Text>
              </Body>
            </CardItem>
            <CardItem footer>
              <Text>Check the projects here</Text>
            </CardItem>
            </Card>
            <View style={styles.maincont}>
            <Text style={styles.proj}>Projects</Text>
            {projectlist}                   

            </View>
            
        </ScrollView>
            
            );
    }
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardstyle:{
    width:300,
    alignSelf:"center",
    borderRadius:10,
    alignItems:"center"
},
  proj:{
      alignSelf:"center",
      fontWeight:"bold",
      fontSize:18,
      marginTop:100
  },
  maincont:{
      marginTop:70,
      backgroundColor:"#B19CD9"
  }
});