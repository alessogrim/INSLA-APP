import React, { Component } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import {
  Header,
  Left,
  Text,
  Body,
  Icon,
  Spinner,
  Title,
  Right,
  List,
  ListItem,
  Thumbnail,
  Container
} from "native-base";
import SvgUri from "react-native-svg-uri";
import { firebase, fs } from "../Firebase/config";
import { SearchBar } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class CorralesList extends Component {
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
      area: 0,
      capacity: 0,
      taken: false,
      active: true,
      text: "",
      corrales: [],
      Loaded: false,
      farm: this.props.navigation.state.params.farm
    };
  }
  componentDidMount() {
    const { farm } = this.state;
    console.log(farm.id);
    fs.collection("corrales")
      .where("idFarm", "==", farm.id)
      .where("taken", "==", false)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            corrales: [...this.state.corrales, doc]
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
      const corrales = this.state.corrales.map((doc, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              this.props.navigation.navigate("AddEggs", {
                farm: this.state.farm,
                corral: doc,
                save: this.props.navigation.state.params.save
              });
            }}
          >
            <ListItem avatar>
              <Left>
                <SvgUri
                  width="60"
                  height="60"
                  source={require("../../../assets/icons/fence.svg")}
                  paddin
                />
              </Left>
              <Body>
                <Text>{doc.data().name}</Text>
                <Text note>{doc.data().id}</Text>
                <Text note>{doc.data().area}</Text>
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
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 18 }}>CORRALES</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <List>{corrales}</List>
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
