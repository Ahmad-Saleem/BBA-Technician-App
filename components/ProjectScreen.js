import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList} from 'react-native';
import { BaseRouter } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';



export default class ProjectScreen extends React.Component {
    constructor(props){
        super(props);
    }

    _renderItem = (item) => (
      <TouchableOpacity style={{borderWidth:3,margin:1}} onPress={() => this.props.navigation.navigate('Requirements')}>
        <Text style={{ paddingBottom:20, fontSize:17, fontWeight:"200"}}>OMH-001</Text>
        <View style={{flexDirection:"row", alignItems:"baseline"}}>
        <Text style={{width:100}}>CFM:16000</Text>
         <Text>Building: 12A</Text>
        </View>
        

      </TouchableOpacity>
      
    );
    render(){
  return (
  <ScrollView>
    <View style={styles.headcontainer}>
      <Text style={{marginLeft:20}}>Location</Text>
    <View style={styles.address}>
    <Text style={{fontSize:25,fontWeight:"bold"}}>{this.props.route.params.title}</Text>
  <Text>{this.props.route.params.aline1}</Text>
  <Text>{this.props.route.params.aline2}</Text>
    </View>
  </View>
  <View style={styles.pcontact}>
     <Text style={{fontSize:7}}>PRIMARY CONTACT</Text>
  <Text style={{fontSize:25, color:"#ff1"}}>{this.props.route.params.pcontact}</Text>
  <Text style={{fontSize:10, color:"#fff"}}>{this.props.route.params.pdesig}</Text>
  </View>
  <View style={{height:200, padding:20}}>
    <Text>Notes from BBA</Text>
  </View>
  <View style={{backgroundColor:"lightgray", height:100}}>
     <Text style={{padding:20}}>Equipment Tasks</Text>
 
  </View>
  <View style={{height:500}}>
  <FlatList
  data={[{key: 'a'}, {key: 'b'},{key: 'C'}]}
        renderItem={this._renderItem}
   />
  </View>
  

  </ScrollView>
  

  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headcontainer:{
      backgroundColor:"#fff",
      height:200,
      justifyContent:"center",
      fontFamily:"sans-serif"
  },
  address:{
      marginLeft:20,
    
  },
  pcontact:{
    height:100,
    justifyContent:"center",
    paddingLeft:20,
    backgroundColor:"purple"
  }
});
