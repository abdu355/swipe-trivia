import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Text,
  StatusBar,
  ScrollView
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Card, Button, Icon, Divider } from 'react-native-elements';

import { sliderWidth, itemWidth } from './static/SliderEntry.style';
import styles, { colors } from './static/index.style';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from './SliderEntry';

import { CAT_ENTRIES, DIFF_ENTRIES } from './static/entries';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASPECT_RATIO = SCREEN_HEIGHT / SCREEN_WIDTH;
//constant for slider components
const horizontalMargin = 20;
const slideWidth = 280;
const itemHeight = 200;

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
      unlockPoints: 0
    };
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }
  _renderItem({ item, index }) {
    return (
      <SliderEntry
        locked={this.props.optionsVisible}
        data={item}
        even={(index + 1) % 2 === 0}
      />
    );
  }

  changeIndex = currentIndex => {
    //console.log('Index:', currentIndex);
    this.setState({
      currentIndex,
      unlockPoints: CAT_ENTRIES[currentIndex].unlockPoints
    });
    this.props.checkIndex(currentIndex);
  };
  selectItems(diff) {
    const difficulty = DIFF_ENTRIES[diff].value;
    const cat = CAT_ENTRIES[this.state.currentIndex].value;

    //console.log('before send:', difficulty + ' ' + cat);
    this.props.userSelected(difficulty, cat, 'Loading New Cards');
  }
  generateCategoryPicker() {
    return (
      <View style={styles.exampleContainer}>
        <Text style={[styles.title, { width: SCREEN_WIDTH }]}>
          Select Category
        </Text>
        <Carousel
          onSnapToItem={this.changeIndex}
          data={CAT_ENTRIES}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          enableMomentum={true}
          activeSlideAlignment={'center'}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          removeClippedSubviews={false}
        />
      </View>
    );
  }
  generateDifficultyPicker() {
    if (this.props.optionsVisible) {
      //console.log('visible?', this.props.optionsVisible);
      return (
        <View style={styles.btnContainer}>
          <Text
            style={[
              styles.title,
              { marginTop: 5, marginBottom: 10, width: SCREEN_WIDTH }
            ]}
          >
            Select Difficulty
          </Text>
          <Grid>
            <Row
              size={1}
              style={{
                marginTop: 5,
                marginBottom: 5,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Button
                borderRadius={20}
                raised
                onPress={() => {
                  this.selectItems(0);
                }}
                buttonStyle={{
                  height: this.getBtnHeight(),
                  width: SCREEN_WIDTH / 1.5
                }}
                backgroundColor={colors.background1}
                title="Any"
              />
            </Row>
            <Row
              size={1}
              style={{
                marginTop: 5,
                marginBottom: 5,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Button
                borderRadius={20}
                raised
                onPress={() => {
                  this.selectItems(1);
                }}
                buttonStyle={{
                  height: this.getBtnHeight(),
                  width: SCREEN_WIDTH / 1.5
                }}
                backgroundColor={colors.background1}
                title="Easy"
              />
            </Row>
            <Row
              size={1}
              style={{
                marginTop: 5,
                marginBottom: 5,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Button
                borderRadius={20}
                raised
                onPress={() => {
                  this.selectItems(2);
                }}
                buttonStyle={{
                  height: this.getBtnHeight(),
                  width: SCREEN_WIDTH / 1.5
                }}
                backgroundColor={colors.background1}
                title="Medium"
              />
            </Row>
            <Row
              size={1}
              style={{
                marginTop: 5,
                marginBottom: 5,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Button
                borderRadius={20}
                raised
                onPress={() => {
                  this.selectItems(3);
                }}
                buttonStyle={{
                  height: this.getBtnHeight(),
                  width: SCREEN_WIDTH / 1.5
                }}
                backgroundColor={colors.background1}
                title="Hard"
              />
            </Row>
          </Grid>
        </View>
      );
    }
    return (
      <View style={styles.btnContainer}>
        <Text
          style={[
            styles.title,
            { marginTop: 5, marginBottom: 10, width: SCREEN_WIDTH }
          ]}
        >
          Locked
        </Text>
        <Text
          style={[
            styles.title,
            { marginTop: 5, marginBottom: 10, width: SCREEN_WIDTH }
          ]}
        >
          Unlocks at {this.state.unlockPoints} points
        </Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollview}
          contentContainerStyle={styles.scrollviewContentContainer}
          indicatorStyle={'white'}
          scrollEventThrottle={200}
          directionalLockEnabled={true}
        >
          {this.generateCategoryPicker()}
          {this.generateDifficultyPicker()}
        </ScrollView>
      </View>
    );
  }
  getBtnHeight() {
    if (ASPECT_RATIO > 1.6) {
      // Code for Iphone
      return SCREEN_HEIGHT / 12;
    } else {
      // Code for Ipad
      return SCREEN_HEIGHT / 12;
    }
  }
}

const myStyles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff'
  },
  slide: {
    width: itemWidth,
    height: itemHeight,
    paddingHorizontal: horizontalMargin
    // other styles for the item container
  },
  slideInnerContainer: {
    width: slideWidth,
    flex: 1
    // other styles for the inner container
  }
});
export default Menu;
