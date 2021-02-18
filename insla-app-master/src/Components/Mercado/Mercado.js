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
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
export default class Mercado extends Component {
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
      //farm: this.props.navigation.state.params.farm,
      mercado: [],
      Loaded: false
    };
  }

  async componentDidMount() {
    const productos = await fs
      .collection("Mercado")
      .where("user", "==", firebase.auth().currentUser.uid)
      .get();
    productos.forEach(producto => {
      this.setState({
        mercado: [...this.state.mercado, producto]
      });
    });
    this.setState({
      Loaded: true
    });
  }

  save = id => {
    fs.collection("Mercado")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          mercado: [...this.state.mercado, doc]
        });
      });
  };

  deleteMercado = (producto, index) => {
    Alert.alert(
      "Borrar Producto",
      "¿Esta seguro que desea borrar este producto?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            if (producto.data().id.substr(0, 3) === "PRS") {
              fs.collection("Mercado")
                .doc(producto.id)
                .delete()
                .then(() => {
                  fs.collection("Cellar")
                    .where("idProduction", "==", producto.data().idProduction)
                    .get()
                    .then(productos => {
                      productos.forEach(doc => {
                        fs.collection("Cellar")
                          .doc(doc.id)
                          .update({
                            totalChickens:
                              doc.data().totalChickens +
                              producto.data().cantidadVender
                          });
                      });
                    })
                    .then(() => {
                      this.setState({
                        mercado: this.state.mercado.filter((e, i) => {
                          return i !== index;
                        })
                      });
                    });
                });
            } else if (producto.data().id.substr(0, 3) === "PRC") {
              fs.collection("Mercado")
                .doc(producto.id)
                .delete()
                .then(() => {
                  fs.collection("Cellar")
                    .where("idEstimation", "==", producto.data().idEstimation)
                    .get()
                    .then(productos => {
                      productos.forEach(doc => {
                        fs.collection("Cellar")
                          .doc(doc.id)
                          .update({
                            existencia:
                              doc.data().existencia +
                              producto.data().cantidadVender
                          });
                      });
                    })
                    .then(() => {
                      this.setState({
                        mercado: this.state.mercado.filter((e, i) => {
                          return i !== index;
                        })
                      });
                    });
                });
            } else {
              // codigo michelle
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  update = (id, index) => {
    this.setState({
      mercado: this.state.mercado.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("Mercado")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          mercado: [...this.state.mercado, doc]
        });
      });
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
      const TabMercado = this.state.mercado.map((doc, index) => {
        if (doc.data().id.substr(0, 3) === "PRS") {
          return (
            <ListItem avatar key={index}>
              <Left>
                <Thumbnail
                  source={require("../../../assets/productions.jpg")}
                />
              </Left>
              <Body>
                <Text>Carne de pollo</Text>
                <Text note>{"Peso estimado: " + doc.data().peso}</Text>
                <Text note>
                  {doc.data().cantidadVender + " pollos disponibles"}
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
                    this.props.navigation.navigate("updatemercado", {
                      item: doc,
                      index: index,
                      update: this.update
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
                  onPress={() => this.deleteMercado(doc, index)}
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
                <Text>{"Cultivo " + doc.data().cultivo}</Text>
                <Text note>
                  {"Lps." + doc.data().precioQuintal + " precio quintal"}
                </Text>
                <Text note>
                  {doc.data().cantidadVender + " quintales disponibles"}
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
                    this.props.navigation.navigate("updatemercado", {
                      item: doc,
                      index: index,
                      update: this.update
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
                  onPress={() => this.deleteMercado(doc, index)}
                />
              </Right>
            </ListItem>
          );
        } else {
        }
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
              <Title style={{ color: "#fff", fontSize: 20 }}>VENDER</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <ScrollView>{TabMercado}</ScrollView>
          </Container>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: "#077A65", padding: 0, margin: 0 }}
            position="bottomRight"
            onPress={() => {
              this.props.navigation.navigate("producto", {
                save: this.save
              });
            }}
          >
            <Icon type="FontAwesome5" name="plus" />
          </Fab>
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
  titleStyle: {
    color: "#fff"
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
