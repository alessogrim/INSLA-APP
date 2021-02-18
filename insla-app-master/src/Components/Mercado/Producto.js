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
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";
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
      producto: [],
      save: this.props.navigation.state.params.save,
      Loaded: false
    };
  }
  async componentDidMount() {
    const farms = await fs
      .collection("farms")
      .where("user", "==", firebase.auth().currentUser.uid)
      .get();
    farms.forEach(async farm => {
      const productos = await fs
        .collection("Cellar")
        .where("idFarm", "==", farm.id)
        .get();

      productos.forEach(producto => {
        this.setState({
          producto: [...this.state.producto, producto]
        });
      });
    });
    this.setState({
      Loaded: true
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
      const TabProductos = this.state.producto.map((doc, index) => {
        if (doc.data().id.substr(0, 3) === "PRS") {
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                this.props.navigation.navigate("addmercado", {
                  producto: doc,
                  save: this.state.save
                })
              }
            >
              <ListItem avatar>
                <Left>
                  <Thumbnail
                    source={require("../../../assets/productions.jpg")}
                  />
                </Left>
                <Body>
                  <Text>{"Produccion de carne de pollo "}</Text>
                  <Text note>
                    {"Peso estimado: " +
                      doc.data().averageWeight +
                      " Libras c/u"}
                  </Text>
                  <Text note>
                    {doc.data().totalChickens + " pollos disponibles"}
                  </Text>
                </Body>
              </ListItem>
            </TouchableOpacity>
          );
        } else if (doc.data().id.substr(0, 3) === "PRC") {
          return (
            <TouchableOpacity
              avatar
              key={index}
              onPress={() =>
                this.props.navigation.navigate("addmercado", {
                  producto: doc,
                  save: this.state.save
                })
              }
            >
              <ListItem avatar key={index}>
                <Left>
                  <Thumbnail
                    source={require("../../../assets/vegetables.png")}
                  />
                </Left>
                <Body>
                  <Text>{"Cultivo: " + doc.data().nombre}</Text>
                  <Text note>Especie: {doc.data().especie}</Text>
                  <Text note>
                    Disponible en Bodega: {doc.data().existencia + " quintales"}
                  </Text>
                </Body>
              </ListItem>
            </TouchableOpacity>
          );
        } else {
          //sino es ninguno de los anteriores obviamenteson huevos
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
              <Title style={styles.titleStyle}> MI BODEGA</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <ScrollView>{TabProductos}</ScrollView>
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
