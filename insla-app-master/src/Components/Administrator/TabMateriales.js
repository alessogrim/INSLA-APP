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
export default class TabsMateriales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbmateriales: [],
      Loaded: false
    };
  }

  componentDidMount() {
    fs.collection("materiales")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            dbmateriales: [...this.state.dbmateriales, doc]
          });
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }
  deleteMateriales = obj => {
    Alert.alert(
      "Borrar material",
      "¿Esta seguro que desea borrar este material?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("materiales")
              .doc(obj.id)
              .delete()
              .then(() => {
                this.setState({
                  dbmateriales: []
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
    const TabMateriales = this.state.dbmateriales.map((doc, index) => {
      return (
            <ListItem avatar key={index} style={{ fontSize: 300 }}>
                    <Left>         
                      <SvgUri width="40" height="40" source={require("../../../assets/icons/machete.svg")}paddin/>
                    </Left>
                    <Body>
                      <Text >Material: {doc.data().nombre}</Text>
                      <Text >Código:  {doc.data().Codigo}</Text>
                      <Text note>{" "}Precio: {doc.data().precio}</Text>
                      <Text note>{" "}Existencia: {doc.data().existencia}</Text>
                    </Body>
                  <Right>
                    <Row>
                    <Icon
                      type="MaterialIcons"
                      name="edit"
                      style={{ color: "blue", marginRight: 15,fontSize: 25 }}
                      onPress={() =>
                        this.props.navigation.navigate("updateMateriales", doc)
                      }
                      />
                      <Icon
                        type="MaterialIcons"
                        name="delete"
                        style={{ color: "red" ,fontSize: 30 }}
                        onPress={() => this.deleteMateriales(doc)}
                      />
                      </Row>
                    </Right>
             </ListItem> 
      );
    });
    return (
      <Container>
        <ScrollView>{TabMateriales}</ScrollView>
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
