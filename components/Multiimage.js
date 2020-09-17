import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import {ImageBrowser} from 'expo-image-picker-multiple'

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
  };

  imagesCallback = (callback) => {
    callback.then((photos) => {
      console.log(photos);
    }).catch((e) => console.log(e))
  };

  updateHandler = (count, onSubmit) => {
    // this.props.navigation.setParams({
    //   headerTitle: "{{count}} selected",
    //   headerRight: onSubmit,
    // });
  };

  renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  render() {
    const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
    const noCameraPermissionComponent = <Text style={styles.emptyStay}>No access to camera</Text>;
    
    return (
      <View style={[styles.flex, styles.container]}>
        <ImageBrowser
          max={4}
          onChange={this.updateHandler}
          callback={this.imagesCallback}
          renderSelectedComponent={this.renderSelectedComponent}
          emptyStayComponent={emptyStayComponent}
          noCameraPermissionComponent={noCameraPermissionComponent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    paddingTop: 25,
    position: 'relative'
  },
  emptyStay:{
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#0580FF'
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#ffffff'
  }
});