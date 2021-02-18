import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Spinner,
  Tabs,
  Tab,
  ListItem,
  Row,
  Right
} from "native-base";
import { StyleSheet, View, Image, Alert, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";
import CardSilder from "react-native-cards-slider";
import SvgUri from "react-native-svg-uri";
export default class TabsInsumos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbinsumos: [],
      Loaded: false
    };
  }

  componentDidMount() {
    fs.collection("insumos")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            dbinsumos: [...this.state.dbinsumos, doc]
          });
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  deleteInsumos = obj => {
    Alert.alert(
      "Borrar insumo",
      "¿Esta seguro que desea borrar esta constante de insumos?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("insumos")
              .doc(obj.id)
              .delete()
              .then(() => {
                this.setState({
                  dbinsumos: []
                });
                this.componentDidMount();
                Alert.alert("", "Borrado", [], {
                  cancelable: true
                });
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const TabInsumos = this.state.dbinsumos.map((doc, index) => {
      return (
        <ListItem avatar key={index} style={{ fontSize: 300 }}>
          <Left>
            <SvgUri
              width="40"
              height="40"
              source={require("../../../assets/icons/fertilizante.svg")}
              paddin
            />
          </Left>
          <Body>
            <Text> Nombre insumo: {doc.data().Nombre}</Text>
            <Text> Código: {doc.data().Codigo}</Text>
            <Text note> Presentacion: {doc.data().Presentacion}</Text>
            <Text note> Precio: {doc.data().Precio}</Text>
          </Body>
          <Right>
            <Row>
              <Icon
                type="MaterialIcons"
                name="edit"
                style={{ color: "blue", marginRight: 15, fontSize: 25 }}
                onPress={() => {
                  this.props.navigation.navigate("updateInsumos", doc);
                }}
              />
              <Icon
                type="MaterialIcons"
                name="delete"
                style={{ color: "red", fontSize: 30 }}
                onPress={() => this.deleteInsumos(doc)}
              />
            </Row>
          </Right>
        </ListItem>
      );
    });
    return (
      <Container>
        <ScrollView>{TabInsumos}</ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  iconStyle: {
    fontSize: 25,
    marginLeft: 30
    //color: "#fff"
  },
  colores: {
    color: "#077A65"
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  },
  container: {
    marginLeft: "2%",
    marginRight: "2%",
    marginTop: "10%",
    flex: 1
  },
  cardStyle: {},
  especie: {
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
    color: "#077A65",
    width: "100%"
  },
  data: {
    fontWeight: "500",
    fontSize: 18,
    color: "#11B000",
    width: "100%"
  },
  labels: {
    fontWeight: "600",
    fontSize: 12,
    color: "#077A65",
    width: "100%"
  },
  area: {
    fontWeight: "600",
    fontSize: 25,
    color: "#000",
    width: "100%"
  },
  dataArea: {
    fontWeight: "600",
    fontSize: 25,
    color: "red",
    width: "100%"
  }
});
