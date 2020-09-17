import React from 'react'
import {Text, View, StyleSheet, Modal, ScrollView,Image, Platform} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {Button} from "native-base";
import { Video } from 'expo-av';


export default class Requirements extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            preread: 1,
            postread: 1,
            showModal: false,
            image: null,
            video:null
        }
    }

    componentDidMount() {
        this.getPermissionAsync();
      }

      getPermissionAsync = async () => {
        if (Platform.OS !== 'web') {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      };
    
      _pickImage = async () => {
        try {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
          });
          if (!result.cancelled) {
            this.setState({ image: result.uri });
          }
    
          console.log(result);
        } catch (E) {
          console.log(E);
        }
      };

      _pickVideo = async () => {
        try {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
          });
          if (!result.cancelled) {
            this.setState({ video: result.uri });
          }
    
          console.log(result);
        } catch (E) {
          console.log(E);
        }
      };
    

    static navigationOptions = {
        title: 'Requirements',
    };

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            preread: 1,
            postread: 1,
            showModal: false,
            image: null,
            video:null
        });
    }


    render(){
        let { image } = this.state;
        let { video } = this.state;
    return (
        <ScrollView>
        <View style={styles.formRow}>
        <Text style={styles.formLabel}>Pre-read</Text>
        <TextInput selectedValue={this.state.preread} placeholder="1.0" defaultValue="1.0" onChangeText={(itemValue) => this.setState({preread: itemValue})}/>
        </View>
        <View style={styles.formRow}>
        <Text style={styles.formLabel}>Pre-read</Text>
        <TextInput selectedValue={this.state.preread} placeholder="1.0" defaultValue="1.0" onChangeText={(itemValue) => this.setState({postread: itemValue})}/>
        </View>
        <View style={[styles.formRow,{alignSelf:"flex-start"}]}>
        <Button onPress={this._pickImage} style={{padding:10, backgroundColor:null, marginRight:"auto"}}><Text>Choose image</Text></Button>
        {image && <Image source={{ uri: image }} style={{ width: 50, height: 50}}/>}
        

        </View>
        <View style={[styles.formRow,{alignSelf:"flex-start"}]}>
        <Button onPress={this._pickVideo} style={{padding:10, backgroundColor:null, marginRight:"auto"}}><Text>Choose video</Text></Button>
        {video && <Video
                    source={{ uri: video }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={{ width: 50, height: 50 }}
                    />}
        

        </View>
        <View style={styles.formRow}>
         <Button
            style={styles.button} 
            onPress={() => this.handleReservation()}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Button>
        </View>
        <Modal animationType = {"slide"} transparent = {false}
            visible = {this.state.showModal}
            onDismiss = {() => this.toggleModal() }
            onRequestClose = {() => this.toggleModal() }>
            <View style = {styles.modal}>
                <Text style = {styles.modalTitle}>Your Requirements</Text>
                <Text style = {styles.modalText}>Pre-read: {this.state.preread}</Text>
                <Text style = {styles.modalText}>Post-read: {this.state.postread}</Text>
                <Text style = {styles.modalText}>Image: {image && <Image source={{ uri: image }} style={{ width: 50, height: 50,alignSelf:"flex-end" }}/>}</Text>
                <Text style = {styles.modalText}>Video: {video && <Video
                                                                    source={{ uri: video }}
                                                                    rate={1.0}
                                                                    volume={1.0}
                                                                    isMuted={false}
                                                                    resizeMode="cover"
                                                                    shouldPlay
                                                                    isLooping
                                                                    style={{ width: 50, height: 50 }}
                                                                    />}
                </Text>
                
                <Button 
                    onPress = {() =>{this.toggleModal(); this.resetForm();}}
                    style={{backgroundColor:"purple",padding:5,borderRadius:5,width:100,justifyContent:"center"}}
                ><Text style={{color:"#fff"}}>Close</Text></Button>
            </View>
        </Modal>
    </ScrollView>
    )
}
}

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         textAlign: 'center',
         color: 'purple',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     },
     button: {
        marginTop: 20,
        width:200,
        borderRadius:10,
        backgroundColor:"purple",
        justifyContent:"center",
        alignSelf:"center"
      },
      buttonText: {
        color: "#fff"
      }
});

