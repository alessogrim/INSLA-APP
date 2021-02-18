import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  Header,
  Left,
  Body,
  Title,
  Right,
  Icon,
  Item,
  Label,
  Button,
  Spinner,
  Input,
  Form,
  Container,
  Content,
  List,
  ListItem,
  Thumbnail
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
export default class Bodega extends Component {
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
      Loaded: false,
      preloader: false,
      text: "",
      farm: this.props.navigation.state.params,
      cellar: []
    };
  }
  componentDidMount() {
    fs.collection("Cellar")
      .where("idFarm", "==", this.state.farm.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            cellar: [...this.state.cellar, doc]
          });
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }
  updatep = (id, index) => {
    this.setState({
      cellar: this.state.cellar.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("Cellar")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          cellar: [...this.state.cellar, doc]
        });
      });
  };
  updateh = (id, index) => {
    this.setState({
      cellar: this.state.cellar.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("Cellar")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          cellar: [...this.state.cellar, doc]
        });
      });
  };
  deletep = (doc, index) => {
    Alert.alert(
      "Borra",
      "¿Esta seguro que desea borrar este producto?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("Cellar")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  cellar: this.state.cellar.filter((e, i) => {
                    return i !== index;
                  })
                });
              });
          }
        }
      ],
      { cancelable: false }
    );
  };
  deleteh = (doc, index) => {
    Alert.alert(
      "Borra",
      "¿Esta seguro que desea borrar este cultivo?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("Cellar")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  cellar: this.state.cellar.filter((e, i) => {
                    return i !== index;
                  })
                });
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

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
      const productions = this.state.cellar.map((doc, index) => {
        if (doc.data().id.substr(0, 3) === "PRS") {
          return (
            <ListItem avatar key={index}>
              <Left>
                <Thumbnail
                  source={require("../../../assets/productions.jpg")}
                />
              </Left>
              <Body>
                <Text>{"Carne de pollo"}</Text>
                <Text>{"ID: " + doc.data().id}</Text>
                <Text note>
                  {"Peso promedio " + doc.data().averageWeight + " libras "}
                </Text>
              </Body>
              <Right
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Icon
                  type="MaterialIcons"
                  name="edit"
                  style={{ color: "black", fontSize: 30 }}
                  onPress={() => {
                    this.props.navigation.navigate("UpdateBProduction", {
                      item: doc,
                      index: index,
                      farm: this.state.farm,
                      update: this.updatep
                    });
                  }}
                />
              </Right>
              <Right
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Icon
                  type="MaterialIcons"
                  name="delete"
                  style={{ color: "red", fontSize: 30 }}
                  onPress={() => {
                    this.deletep(doc, index);
                  }}
                />
              </Right>
            </ListItem>
          );
        } else if (doc.data().id.substr(0, 3) === "PRC") {
          return (
            <ListItem avatar key={index}>
              <Left>
                <Thumbnail source={require("../../../assets/vegetables.png")} />
              </Left>
              <Body>
                <Text>{"Cultivo de " + doc.data().nombre}</Text>
                <Text>{"ID: " + doc.data().id}</Text>
                <Text note>
                  {doc.data().existencia + " quintales disponibles"}
                </Text>
              </Body>
              <Right
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Icon
                  type="MaterialIcons"
                  name="edit"
                  style={{ color: "black", fontSize: 30 }}
                  onPress={() => {
                    this.props.navigation.navigate("UpdateBHarvest", {
                      item: doc,
                      index: index,
                      farm: this.state.farm,
                      update: this.updateh
                    });
                  }}
                />
              </Right>
              <Right
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Icon
                  type="MaterialIcons"
                  name="delete"
                  style={{ color: "red", fontSize: 30 }}
                  onPress={() => {
                    this.deleteh(doc, index);
                  }}
                />
              </Right>
            </ListItem>
          );
        }
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
              <Title style={{ color: "#fff", fontSize: 18 }}>COMPRAR</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <Content>
              <List>{productions}</List>
            </Content>
          </Container>
        </View>

        /*
         */
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
