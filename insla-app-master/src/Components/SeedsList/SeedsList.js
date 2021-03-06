import React, { Component } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import {
  Header,
  Left,
  Text,
  Body,
  Icon,
  Fab,
  Spinner,
  Title,
  Right,
  List,
  Item,
  ListItem,
  Thumbnail,
  Content,
  Container
} from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { firebase, fs } from "../Firebase/config";

export default class ConcentrateList extends Component {
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
      id: 0,
      name: "",
      lastName: "",
      location: "",

      active: true,
      text: "",
      farm: this.props.navigation.state.params.farm,
      screen: this.props.navigation.state.params.screen,
      production: this.props.navigation.state.params.production,
      seed: [],
      Loaded: false
    };
  }
  componentDidMount() {
    const { farm } = this.state;

    fs.collection("seedsupplies")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            seed: [...this.state.seed, doc]
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
    const { Loaded } = this.state;
    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      const seed = this.state.seed.map((doc, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              this.props.navigation.navigate(
                this.props.navigation.state.params.screen,
                {
                  seed: doc,
                  production: this.state.production,
                  save: this.props.navigation.state.params.save
                }
              );
            }}
          >
            <ListItem avatar>
              <Left>
                <Thumbnail source={require("../../../assets/seed.png")} />
              </Left>
              <Body>
                <Text>{doc.data().name}</Text>
                <Text note>{doc.data().quantity + " libras"} </Text>
                <Text note>{doc.data().description}</Text>
              </Body>
            </ListItem>
          </TouchableOpacity>
        );
      });
      return (
        <View style={styles.container}>
          <Header
            style={{
              height: 80,
              borderBottomColor: "#fff",
              backgroundColor: "#077A65"
            }}
          >
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={styles.iconStyle}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 16 }}>SELECCIONAR</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <Content>
              <List>{seed}</List>
            </Content>
          </Container>
        </View>
      );
    }
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
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  }
});
