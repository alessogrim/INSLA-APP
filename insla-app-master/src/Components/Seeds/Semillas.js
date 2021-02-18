import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import {
  Header,
  Left,
  Text,
  Body,
  Icon,
  Fab,
  Title,
  Right,
  Container,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Spinner,
  Tabs,
  Tab,
  ListItem,
  Row
} from "native-base";
import { NavigationActions } from "react-navigation";
import { firebase, fs } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Semillas extends Component {
  static navigationOptions = () => {
    let headerLeft = null;
    let gesturesEnabled = false;
    let header = null;
    return {
      headerLeft,
      header,
      gesturesEnabled
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      farm: this.props.navigation.state.params.farm,
      save: this.props.navigation.state.params.save,
      dbseeds: [],
      text: ""
    };
  }

  componentDidMount() {
    fs.collection("admin_semillas")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            dbseeds: [...this.state.dbseeds, doc]
          });
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  render() {
    const { farm, save } = this.state;
    const TabSeeds = this.state.dbseeds.map((doc, index) => {
      return (
        <TouchableOpacity
          avatar
          key={index}
          onPress={() =>
            this.props.navigation.navigate("addSeeds", {
              farm: farm,
              seed: doc,
              save: save
            })
          }
        >
          <ListItem avatar key={index}>
            <Left>
              <Thumbnail source={require("../../../assets/straw.png")} />
            </Left>
            <Body>
              <Text>{doc.data().type}</Text>
              <Text note>{doc.data().id}</Text>
              <Text note>{doc.data().quantity + " por empaque"}</Text>
            </Body>
            <Right
              style={{
                display: "flex",
                justifyContent: "center"
              }}
            ></Right>
            <Right
              style={{
                display: "flex",
                justifyContent: "center"
              }}
            ></Right>
          </ListItem>
        </TouchableOpacity>
      );
    });
    return (
      <View style={styles.container}>
        <Header style={styles.headerStyle}>
          <Left>
            <Icon
              type="MaterialIcons"
              name="arrow-back"
              style={styles.iconStyle}
              onPress={() => this.props.navigation.goBack()}
            />
          </Left>
          <Body>
            <Title style={{ fontSize: 16, color: "#fff" }}>SELECCIONAR</Title>
          </Body>
          <Right />
        </Header>
        <Container>
          <ScrollView>{TabSeeds}</ScrollView>
        </Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    marginTop: 20,

    fontSize: 25,
    textAlign: "center"
  },
  container: {
    flex: 1
  },
  fab: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "red"
  },
  container: {
    flexDirection: "column",
    height: "100%"
  },
  headerStyle: {
    borderBottomColor: "#fff",
    backgroundColor: "#077A65",
    height: 80
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  },
  titleStyle: {
    color: "#fff",
    fontSize: 13
  },
  buttonStyle: {
    backgroundColor: "#077A65",
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    width: "70%"
  },
  labelStyle: {
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10
  },
  itemStyle: {
    height: 50,
    //marginLeft: 10,
    //marginRight: 10,
    top: -10,
    borderWidth: 1,
    borderColor: "#077A65",
    //backgroundColor: "#7fff00",
    width: "25%"
  }
});
