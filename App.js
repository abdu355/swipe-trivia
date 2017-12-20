import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Animated,
  StatusBar,
  Dimensions,
  RefreshControl,
  LayoutAnimation,
  UIManager,
  Platform,
  Modal,
  AsyncStorage,
  NetInfo
} from 'react-native';
import { Card, Button, Icon, Divider } from 'react-native-elements';
import axios from 'axios';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as Animatable from 'react-native-animatable';
//import Ball from './src/Ball';
import Deck from './src/Deck';
import Menu from './src/Menu';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASPECT_RATIO = SCREEN_HEIGHT / SCREEN_WIDTH;

var unlockedItems = [0, 1, 2, 3, 4, 5, 6];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY(); // no initial position

    this.state = {
      data: [],
      showAns: false,
      fetching: true,
      score: 0,
      position,
      selected: false,
      difficulty: '',
      category: 15,
      optionsVisible: true,
      loadingTxt: 'Out Of Cards',
      loadingTxt2: 'No more content here',
      modalVisible: false,
      internetConnected: true
    };
  }
  changeStatus(status) {
    this.setState({ internetConnected: status });
  }
  handleFirstConnectivityChange(isConnected) {
    //this.changeStatus(isConnected ? true : false);
    //console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }
  async componentDidMount() {
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
    //check internet
    NetInfo.getConnectionInfo().then(isConnected => {
      this.setState({ internetConnected: isConnected ? true : false });
      //console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
    });

    //this.getMoreCards();
    try {
      var value = JSON.parse(await AsyncStorage.getItem('playerItems2'));
      if (value != null) {
        unlockedItems = value;
      }
      var score = JSON.parse(await AsyncStorage.getItem('playerPoints2'));
      if (score != null) {
        this.setState({ score });
      } else {
        this.setState({ score: 0 });
      }
    } catch (error) {
      // Error fetching data
      alert('Could Not Load Score');
    }
  }
  componentWillUnmount() {
    //remove network listener
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  async saveScore() {
    try {
      await AsyncStorage.setItem(
        'playerPoints2',
        JSON.stringify(this.state.score)
      );
      await AsyncStorage.setItem('playerItems2', JSON.stringify(unlockedItems));
    } catch (error) {
      //error saving data
      alert('Could Not Save Score');
    }
  }
  checkIndex(snappedItemIndex) {
    let success = unlockedItems.includes(snappedItemIndex);
    //console.log('Sucess:', success + ' ' + snappedItemIndex);
    this.setState({ optionsVisible: success });
  }
  //user chose category and difficulty
  userSelected(diff, cat, text) {
    //console.log('Vars:', diff + ' ' + cat);
    this.setState({
      selected: true,
      difficulty: diff,
      category: cat,
      loadingTxt: text,
      loadingTxt2: text
    });

    this.getMoreCards(diff, cat);
  }
  getMoreCards(diff, cat) {
    this.setState({ fetching: true });
    // console.log(
    //   'URL:',
    //   `https://opentdb.com/api.php?amount=5&category=${cat}&difficulty=${
    //     diff
    //   }&type=boolean`
    // );
    axios
      .get(
        `https://opentdb.com/api.php?amount=5&category=${cat}&difficulty=${
          diff
        }&type=boolean`
      )
      .then(response => {
        //console.log(response);
        this.setState({
          data: response.data.results,
          fetching: false,
          loadingTxt: 'Out Of Cards',
          loadingTxt2: 'No more content here'
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  getQuestions(item) {
    return item.question
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&lsquo;/g, '‘')
      .replace(/&rsquo;/g, '’')
      .replace(/&minus;/g, '-')
      .replace(/&ldquo;/g, '“')
      .replace(/&rdquo;/g, '”')
      .replace(/&epsilon;/g, 'Ε')
      .replace(/&Phi;/g, 'Φ')
      .replace(/&eacute;/g, 'é');
  }
  getCardStyle() {
    if (ASPECT_RATIO > 1.6) {
      // Code for Iphone
      if (Platform.Version <= 23 && Platform.OS != 'ios') {
        const style_phone = {
          borderRadius: 10,
          height: 260
        };
        return style_phone;
      }
      const style_phone = {
        borderRadius: 10,
        height: 400
      };
      return style_phone;
    } else {
      // Code for Ipad
      const style_tablet = {
        borderRadius: 10,
        height: 600
      };
      return style_tablet;
    }
  }
  getImageStyle() {
    if (ASPECT_RATIO > 1.6) {
      // Code for Iphone
      const img_style_phone = {
        height: 170
      };
      return img_style_phone;
    } else {
      // Code for Ipad
      const img_style_tablet = {
        height: 350
      };
      return img_style_tablet;
    }
  }
  getCardImage() {
    if (Platform.Version <= 23 && Platform.OS != 'ios') {
      return;
    }
    return {
      uri: 'https://i.imgur.com/BkdZTlPl.jpg'
    };
  }
  //will be called when Deck component is rendered, for each data item
  renderCard(item) {
    return (
      <Card
        imageProps={{ resizeMode: 'contain' }}
        imageStyle={this.getImageStyle()}
        containerStyle={this.getCardStyle()}
        key={item.question}
        title={item.category}
        image={this.getCardImage()}
      >
        <Text
          style={{
            height: 70,
            fontWeight: 'bold',
            marginBottom: 10
          }}
        >
          {this.getQuestions(item)}
        </Text>

        <Row style={{ height: 45 }}>
          <Col>
            <Button
              borderRadius={20}
              disabledStyle={{ backgroundColor: '#373d4d' }}
              disabled
              backgroundColor="#373d4d"
              title="<<<  False"
            />
          </Col>
          <Col>
            <Button
              borderRadius={20}
              disabledStyle={{ backgroundColor: '#373d4d' }}
              disabled
              backgroundColor="#373d4d"
              title="True  >>>"
            />
          </Col>
        </Row>
      </Card>
    );
  }
  _onRefresh() {
    this.getMoreCards(this.state.difficulty, this.state.category);
  }
  renderNoMoreCards() {
    return (
      <ScrollView
        style={{ height: SCREEN_HEIGHT / 2 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.fetching}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      >
        {this.fetchingText()}
        <Card
          containerStyle={{ borderRadius: 10 }}
          title={this.state.loadingTxt}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                marginBottom: 10
              }}
            >
              {this.state.loadingTxt2}
            </Text>
          </View>
          <Button
            borderRadius={20}
            disabledStyle={{ backgroundColor: '#373d4d' }}
            disabled
            onPress={() => {
              this.getMoreCards();
            }} //requires binding renderNoMoreCards to this component when sending it as a prop
            backgroundColor="#373d4d"
            title="Pull for more"
          />
        </Card>
        <ActivityIndicator
          color="orange"
          size="large"
          style={{ marginTop: 20 }}
          animating={false}
        />
      </ScrollView>
    );
  }
  fetchingText() {
    if (this.state.fetching) {
      return (
        <View
          style={{
            paddingBottom: 50,
            width: SCREEN_WIDTH,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{ marginTop: 5, color: 'white' }}>
            Loading Content ...
          </Text>
        </View>
      );
    }
    return <View />;
  }
  onSwipeRight(item) {
    //user answered true - compare to item.correct_answer
    if (item.correct_answer === 'True') {
      this.setState({ score: this.state.score + 1 });
      this.animateScore();
    }
  }
  onSwipeLeft(item) {
    //user answered false - compare to item.correct_answer
    if (item.correct_answer === 'False') {
      this.setState({ score: this.state.score + 1 });
      this.animateScore();
    }
  }
  alertUnlock() {
    switch (this.state.score) {
      case 25:
        unlockedItems.push(7);
        alert(`You have unlocked Books !`);
        return;
      case 35:
        unlockedItems.push(8);
        alert(`You have unlocked Film !`);
        return;
    }
  }
  animateScore() {
    this.refs.view.bounce(800).then(
      endState => {
        //check score
        this.alertUnlock();
      }
      //console.log(endState.finished ? 'bounce finished' : 'bounce cancelled')
    );
  }
  //get menu or deck component
  renderItems() {
    if (this.state.selected) {
      return (
        <Grid>
          <Row size={3}>
            <Deck
              data={this.state.data}
              renderCard={this.renderCard.bind(this)}
              renderNoMoreCards={this.renderNoMoreCards.bind(this)} //bind to use methods in onPress for ex.
              onSwipeRight={this.onSwipeRight.bind(this)}
              onSwipeLeft={this.onSwipeLeft.bind(this)}
            />
          </Row>
          <Row
            size={1}
            style={{
              marginTop: SCREEN_HEIGHT / 2,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button
              borderRadius={40}
              raised
              buttonStyle={{
                height: this.getBtnHeight(),
                width: SCREEN_WIDTH / 2
              }}
              onPress={() => {
                this.saveScore();
                this.setState({ selected: false, data: [], noAnim: false });
              }} //requires binding renderNoMoreCards to this component when sending it as a prop
              backgroundColor="#637b97"
              title="Back"
            />
          </Row>
          <Row
            size={1}
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                marginTop: 5,
                textAlign: 'center',
                color: 'white',
                width: this.getWidth()
              }}
            >
              Swipe left or right to answer
            </Text>
          </Row>
          <Row
            size={1}
            style={{
              width: SCREEN_WIDTH,
              justifyContent: 'center'
            }}
          >
            <Animatable.View ref="view">
              <Text
                style={{
                  textAlign: 'center',
                  width: this.getWidth(),
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: 'white'
                }}
              >
                Points: {this.state.score}
              </Text>
            </Animatable.View>
          </Row>
        </Grid>
      );
    }
    return (
      <Menu
        optionsVisible={this.state.optionsVisible}
        checkIndex={this.checkIndex.bind(this)}
        userSelected={this.userSelected.bind(this)}
      />
    );
  }
  viewNetworkStatus() {
    const status = this.state.internetConnected ? 'Connected' : 'Offline';
    if (!this.state.internetConnected) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 70,
            backgroundColor: 'black'
          }}
        >
          <Text
            style={{
              fontSize: 18,
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'white'
            }}
          >
            You are {status}
          </Text>
          <Icon name="network-check" color="white" />
        </View>
      );
    }
    return;
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor="white"
          barStyle="dark-content"
        />
        {this.renderItems()}
        {this.viewNetworkStatus()}
      </View>
    );
  }
  getWidth() {
    if (ASPECT_RATIO > 1.6) {
      // Code for Iphone
      return SCREEN_WIDTH / 2;
    } else {
      // Code for Ipad
      return SCREEN_WIDTH / 4.5;
    }
  }
  getBtnHeight() {
    if (ASPECT_RATIO > 1.6) {
      // Code for Iphone
      return SCREEN_HEIGHT / 10;
    } else {
      // Code for Ipad
      return SCREEN_HEIGHT / 10;
    }
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#373d4d'
  }
});
