import React, { Component } from 'react';
import { View, Animated } from 'react-native';

class Ball extends Component {
  componentWillMount() {
    this.position = new Animated.ValueXY(0, 0); //current position we want to set our animated view to
    //spring animation type
    Animated.spring(this.position, {
      //where is it now ?
      toValue: { x: 200, y: 500 } // where is it going to be ?
    }).start(); //initate the animation
  }
  //getLayout tells Animated View how to animate the elements inside ( reads ValueXY and monitors its changes)
  //animation system runs outside react state system
  render() {
    return (
      <Animated.View style={this.position.getLayout()}>
        <View style={styles.ball} />
      </Animated.View>
    );
  }
}

const styles = {
  ball: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'blue'
  }
};

export default Ball;
