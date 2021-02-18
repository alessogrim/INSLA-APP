import React, { Component } from "react";
import {
  Container,
  Text,
  Icon,
  Left,
  Body,
  Right,
  ListItem,
  Row
} from "native-base";
import { StyleSheet, View, Image, Alert, ScrollView } from "react-native";
import { NavigationActions } from "react-navigation";
import { fs, firebase } from "../Firebase/config";
import { TouchableOpacity } from "react-native-gesture-handler";
import CardSilder from "react-native-cards-slider";
import SvgUri from "react-native-svg-uri";
export default class TabConstCultivo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbconst: [],
      Loaded: false
    };
  }

  componentDidMount() {
    fs.collection("const")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            dbconst: [...this.state.dbconst, doc]
          });
        });
      });
    this.setState({
      Loaded: true
    });
  }

  deletecultivos = obj => {
    Alert.alert(
      "Borrar cultivos",
      "¿Esta seguro que desea borrar esta constante de cultivos?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("const")
              .doc(obj.id)
              .delete()
              .then(() => {
                this.setState({
                  dbconst: []
                });
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const TabCultivos = this.state.dbconst.map((doc, index) => {
      return (
        <ListItem avatar key={index} style={{ fontSize: 300 }}>
          <Left>
            <SvgUri
              width="40"
              height="40"
              source={require("../../../assets/icons/vegetal.svg")}
              paddin
            />
          </Left>
          <Body>
            <Text> Especie: {doc.data().Especie}</Text>
            <Text> Código: {doc.data().Codigo}</Text>
            <Text note> Variedad: {doc.data().Variedad}</Text>
            <Text note> Tipo: {doc.data().Tipo}</Text>
          </Body>
          <Right>
            <Row>
              <Icon
                type="MaterialIcons"
                name="edit"
                style={{ color: "blue", marginRight: 15, fontSize: 25 }}
                onPress={() => {
                  this.props.navigation.navigate("updateConstCultivos", doc);
                }}
              />
              <Icon
                type="MaterialIcons"
                name="delete"
                style={{ color: "red", fontSize: 30 }}
                onPress={() => this.deletecultivos(doc)}
              />
            </Row>
          </Right>
        </ListItem>
      );
    });
    return (
      <Container>
        <ScrollView>{TabCultivos}</ScrollView>
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
