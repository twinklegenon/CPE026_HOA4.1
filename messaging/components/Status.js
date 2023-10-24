import React from 'react';
import { Constants, Platform, StatusBar, StyleSheet, Text, View, } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as Animated from 'react-native-animatable';


export default class Status extends React.Component {
  state = {
    info: 'none',
  };

  componentDidMount() {
    NetInfo.fetch().then((status) => {
      this.updateStatus(status.isConnected);
    });
    this.subscription = NetInfo.addEventListener((status) => {
      this.updateStatus(status.isConnected);
    });
  }

  componentWillUnmount() {
    this.subscription && this.subscription();
  }

  updateStatus(isConnected) {
    this.setState({ info: isConnected ? 'connected' : 'none' });
  }

  render() {
    const { info } = this.state;
    const isConnected = info !== 'none';
    const backgroundColor = isConnected ? 'lightgreen' : 'pink';
  
    if (Platform.OS === 'ios') {
      return (
        <Animated.View animation={isConnected ? 'zoomOut' : 'zoomIn'} duration={9000} style={[styles.status, { backgroundColor }]}>
          <StatusBar
            backgroundColor={backgroundColor}
            barStyle={isConnected ? 'dark-content' : 'light-content'}
            animated={true}
          />
        </Animated.View>
      );
    } else {
      return (
        <Animated.View animation={isConnected ? 'zoomOut' : 'zoomIn'} duration={5000} style={styles.messageContainer} pointerEvents="none">
          <StatusBar
            backgroundColor={backgroundColor}
            barStyle={isConnected ? 'dark-content' : 'light-content'}
            animated={true}
          />
          {!isConnected && (
            <View style={styles.bubble}>
              <Text style={styles.text}>No network connection</Text>
            </View>
          )}
        </Animated.View>
      );
    }
  }
}

const statusHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : 0;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'pink',
  },
  text: {
    color: 'white',
  },
});