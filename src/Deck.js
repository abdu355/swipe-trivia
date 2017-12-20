import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.35 * SCREEN_WIDTH; //quarter of the width of the screen
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
  //these props are used for backup, incase the prop was not passed from other components
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
    renderNoMoreCards: () => {},
    data: []
  };
  constructor(props) {
    super(props);

    const position = new Animated.ValueXY(); // no initial position
    //panResponder will respond to our gestures on screen - self contained react native object
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true, // extecuted any time user presses down on screen -  if true, it will handle presses on the Deck componenet only

      //when user moves/drags the element on screen - event object has the element being pressed on and some info. gesture object has info about pixels and movement
      onPanResponderMove: (event, gesture) => {
        //update position object manually
        position.setValue({ x: gesture.dx, y: gesture.dy });

        //console.log(gesture);
        //gesture values are reset while the code runs, only accessible at the moment the gesture is generated
      },
      //when user removes their finger off the screen and the element
      onPanResponderRelease: (event, gesture) => {
        //check distance swiped to left or right and determine if user liked the card or not
        if (gesture.dx > SWIPE_THRESHOLD) {
          //liked - yes
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          //disliked - no
          this.forceSwipe('left');
        } else {
          //helper method to reset the card to original position when not fully swiped
          this.resetPosition();
        }
      }
    });
    this.state = {
      panResponder,
      position,
      index: 0 //card being shown
    }; //we need to use this to refer to panResponder and position, but will not use setState to update panResponder or position
  }
  componentWillReceiveProps(nextProps) {
    //once we get new props we need to reset the index to show the cards properly
    if (nextProps.data !== this.props.data) {
      //is this the same array of data ?
      this.setState({ index: 0 });
    }
  }
  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }
  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH * 2 : -SCREEN_WIDTH * 2;
    //linear feeling of swipe instead of bouncy spring
    Animated.timing(this.state.position, {
      //where is it now ?
      toValue: { x, y: 0 }, // where is it going to be ?
      duration: SWIPE_OUT_DURATION
    }).start(() => {
      //swipe callback to prepare next card
      this.onSwipeComplete(direction);
    });
  }
  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index]; //get the current data item

    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item); //do something when swipe is done ( the method will be implmeneted in the App componenet)
    this.state.position.setValue({ x: 0, y: 0 }); //reset next card position, so new card does not appear off screen
    this.setState({ index: this.state.index + 1 }); //get next card index
  }
  resetPosition() {
    Animated.spring(this.state.position, {
      //where is it now ?
      toValue: { x: 0, y: 0 } // where is it going to be ?
    }).start();
  }
  //helper for animation
  getCardStyle() {
    //use interpolation system in react native to tie position from getLayout to trasnform prop
    const { position } = this.state; //get animated position from state to ref it
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2], //multiply by 2 to rotate a bit less as user drags
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...this.state.position.getLayout(),
      transform: [{ rotate }]
    };
  }
  //call the prop method for every data item that is sent to Deck, use map to get each item and send it as a parameter to renderCard from App.js
  renderCards() {
    //dont render cards
    if (this.state.index >= this.props.data.length) {
      return (
        <Animated.View key={'key0'} style={styles.cardStyle}>
          {this.props.renderNoMoreCards()}
        </Animated.View>
      );
    }
    return this.props.data
      .map((item, i) => {
        //do not render cards off screen
        if (i < this.state.index) {
          return null;
        }
        //i is the element in the array that is being mapped
        if (i === this.state.index) {
          //animate that card
          return (
            <Animated.View
              key={item.question}
              style={[this.getCardStyle(), styles.cardStyle, { zIndex: 1 }]}
              {...this.state.panResponder.panHandlers}
            >
              {this.props.renderCard(item)}
            </Animated.View>
          );
        }
        return (
          <Animated.View
            key={item.question}
            style={[
              styles.cardStyle,
              { zIndex: 0, top: 10 * (i - this.state.index) }
            ]} //move other cards by 10 pixels from the top * the distance from the current card index
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      })
      .reverse();
  }
  //attach panResponder to View - we use ... to spread all the pandHandlers props and pass them to the component
  render() {
    return <View>{this.renderCards()}</View>;
  }
}

const styles = {
  cardStyle: {
    position: 'absolute', //makes the cards stack
    width: SCREEN_WIDTH
  }
};

export default Deck;
