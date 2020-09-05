import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import {Card, CardItem, Body} from "native-base";
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function ProjectCard(props) {
  return (
    
         <Card style={styles.cardstyle}>
    <CardItem header>
      <Text>{props.projname}</Text>
    </CardItem>
    <CardItem>
      <Body>
        <Text>
          {props.aline1}
        </Text>
        <Text>
          {props.aline2}
        </Text>
        <Text>
          {props.stdate}
        </Text>
        <Text>
          {props.pcontact}
        </Text>
        <Text>
          {props.noahu} AHU
        </Text>
      </Body>
    </CardItem>
    <CardItem footer>
      <Text>{props.projfoot}</Text>
    </CardItem>
    </Card>
    
   

  );
}

const styles = StyleSheet.create({
    cardstyle:{
        width:300,
        alignSelf:"center",
        borderRadius:10,
        alignItems:"center"
    },
});
