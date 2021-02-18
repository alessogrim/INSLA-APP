import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Spinner,
  Left,
  Right,
  Icon,
  Title,
  Item,
  Label,
  Input,
  Button
} from "native-base";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class BuyDetails extends Component {
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
      producto: this.props.navigation.state.params,
      Loaded: true,
      compra: 0,
      preloader: false,

      //errors
      eCompra: false,
      //success
      sCompra: false,

      //icons
      iCompra: "",
      save: false
    };
  }

  compraDetails = () => {
    const { producto, compra } = this.state;
    if (producto.data().id.substr(0, 3) === "PRS") {
      return (
        <CardItem bordered>
          <Body>
            <Text style={{ fontWeight: "500", color: "#077A65", fontSize: 14 }}>
              Detalle de compra
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Cantidad a comprar:
              <Text style={{ color: "red" }}>{compra + " pollos"}</Text>
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Total a pagar::{" "}
              <Text style={{ color: "red" }}>
                {producto.data().precioLibra *
                  producto.data().peso *
                  parseFloat(compra).toFixed(2) +
                  " Lempiras"}
              </Text>{" "}
            </Text>
          </Body>
        </CardItem>
      );
    } else if (producto.data().id.substr(0, 3) === "PRC") {
      return (
        <CardItem bordered>
          <Body>
            <Text style={{ fontWeight: "500", color: "#077A65", fontSize: 14 }}>
              Detalle de compra
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Cantidad a comprar:
              <Text style={{ color: "red" }}>{compra + " Quintales"}</Text>
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Total a pagar::{" "}
              <Text style={{ color: "red" }}>
                {producto.data().precioQuintal * parseFloat(compra) +
                  " Lempiras"}
              </Text>{" "}
            </Text>
          </Body>
        </CardItem>
      );
    } else {
    }
  };

  renderDetails = () => {
    const { producto } = this.state;
    if (producto.data().id.substr(0, 3) === "PRS") {
      return (
        <CardItem bordered>
          <Body>
            <Text style={{ fontWeight: "500", color: "#077A65", fontSize: 18 }}>
              Producción de carne pollo
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Cantidad a la venta:{" "}
              <Text style={{ color: "red" }}>
                {producto.data().cantidadVender + " pollos"}
              </Text>{" "}
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Peso individual:{" "}
              <Text style={{ color: "red" }}>
                {producto.data().peso + " libras"}
              </Text>{" "}
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Precio libra:{" "}
              <Text style={{ color: "red" }}>
                {producto.data().precioLibra + " Lempiras"}
              </Text>{" "}
            </Text>
          </Body>
        </CardItem>
      );
    } else if (producto.data().id.substr(0, 3) === "PRC") {
      return (
        <CardItem bordered>
          <Body>
            <Text style={{ fontWeight: "500", color: "#077A65", fontSize: 18 }}>
              {"Cultivo de " + producto.data().cultivo}
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Cantidad a la venta:{" "}
              <Text style={{ color: "red" }}>
                {producto.data().cantidadVender + " Quintales"}
              </Text>{" "}
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Precio quintal:{" "}
              <Text style={{ color: "red" }}>
                {producto.data().precioQuintal + " Lempiras"}
              </Text>{" "}
            </Text>
          </Body>
        </CardItem>
      );
    } else {
      return (
        <CardItem bordered>
          <Body>
            <Text style={{ fontWeight: "500", color: "#077A65", fontSize: 18 }}>
              Producción de carne pollo
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Area: <Text style={{ color: "red" }}>{" metros cuadrados"}</Text>{" "}
            </Text>
          </Body>
        </CardItem>
      );
    }
  };

  save = () => {
    const { producto, compra, sCompra } = this.state;
    if (sCompra) {
      Alert.alert(
        "Comprar",
        "¿Esta seguro que desea comprar este producto?",
        [
          {
            text: "Cancelar",

            style: "Cancelar"
          },
          {
            text: "Aceptar",
            onPress: () => {
              this.setState({
                preloader: true,
                save: true
              });
              fs.collection("Mercado")
                .doc(producto.id)
                .update({
                  cantidadVender:
                    producto.data().cantidadVender - parseInt(compra)
                })
                .then(() => {
                  this.props.navigation.navigate("menuMercado");
                });
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("", "Rellene todos los campos", [], {
        cancelable: true
      });
    }
  };

  validate = (data, type) => {
    const { producto } = this.state;
    if (type === "compra") {
      if (data <= producto.data().cantidadVender && data != "") {
        this.setState({
          iCompra: "checkmark-circle",
          compra: data,
          eCompra: false,
          sCompra: true
        });
      } else {
        this.setState({
          iCompra: "close-circle",
          compra: data,
          eCompra: true,
          sCompra: false
        });
      }
    }
  };
  render() {
    const { Loaded, producto } = this.state;
    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      return (
        <Container>
          <Header
            style={{
              height: 80,
              borderBottomColor: "#fff",
              backgroundColor: "#077A65",
              textAlign: "center"
            }}
          >
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={{
                  fontSize: 38,
                  marginLeft: 10,
                  color: "#fff"
                }}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 18 }}>DETALLES</Title>
            </Body>
            <Right />
          </Header>
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardOpeningTime={250}
            ScroolEnable={false}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  padding: 30,
                  backgroundColor: "#C5E4C5",
                  borderRadius: "100%",
                  marginTop: 20
                }}
              >
                <SvgUri
                  width="70"
                  height="70"
                  source={require("../../../assets/icons/farm.svg")}
                  paddin
                />
              </View>
            </View>
            <Text
              style={{
                marginTop: 3,
                fontSize: 20,
                fontWeight: "600",
                textAlign: "center"
              }}
            >
              {"FINCA " + producto.data().farmName.toUpperCase()}
            </Text>
            <View>{this.renderDetails()}</View>
            <ScrollView scrollEnabled={false}>
              <View>
                {this.state.compra &&
                this.state.compra <=
                  this.state.producto.data().cantidadVender !=
                  0
                  ? this.compraDetails()
                  : null}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  marginTop: 20
                }}
              >
                <Item
                  floatingLabel
                  style={{ width: "90%", height: 50 }}
                  error={this.state.eCompra}
                  success={this.state.sCompra}
                >
                  <Icon type="MaterialIcons" name="control-point" />
                  <Label>¿Que cantidad desea comprar?</Label>
                  <Input
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                    keyboardType="numeric"
                    onChangeText={compra => this.validate(compra, "compra")}
                  />
                  <Icon name={this.state.iCompra} />
                </Item>
              </View>

              <View
                style={{
                  marginTop: 30,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row"
                }}
              >
                <Button
                  style={style.addButton}
                  full
                  rounded
                  success
                  disabled={this.state.save}
                  onPress={this.save}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    COMPRAR
                  </Text>
                </Button>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
          {this.state.preloader && (
            <Spinner
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                right: "50%"
              }}
            />
          )}
        </Container>
      );
    }
  }
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
  },
  addButton: {
    backgroundColor: "#077A65",
    width: 200
  }
});
