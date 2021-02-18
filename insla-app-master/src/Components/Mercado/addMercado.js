import React, { Component } from "react";
import {
  Container,
  Form,
  Body,
  Header,
  Icon,
  Text,
  Button,
  Left,
  Title,
  Input,
  Item,
  Label,
  Right,
  Spinner,
  Row
} from "native-base";

import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class addMercado extends Component {
  //navigation option
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

  // constructor
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.navigation.state.params.producto.data().id,
      producto: this.props.navigation.state.params.producto,
      precio: 0,
      //errors
      eexistencia: false,
      ePrecio: false,
      existencia: 0,
      //icons

      iexistencia: "",
      iPrecio: "",
      //success
      sexistencia: false,
      sPrecio: false,
      Loaded: true,
      preloader: false,
      save: false
    };
  }

  validate = (data, type, cantidad) => {
    const regexprecio = /^[0-9]+([.])?([0-9]+)?$/;
    if (type === "existencia") {
      if (data <= cantidad && data != "") {
        this.setState({
          existencia: data,
          sexistencia: true,
          eexistencia: false,
          iexistencia: "checkmark-circle"
        });
      } else {
        this.setState({
          existencia: data,
          sexistencia: false,
          eexistencia: true,
          iexistencia: "close-circle"
        });
      }
    } else if (type === "precio") {
      if (regexprecio.test(data)) {
        this.setState({
          sPrecio: true,
          ePrecio: false,
          precio: data,
          iPrecio: "checkmark-circle"
        });
      } else {
        this.setState({
          sPrecio: false,
          ePrecio: true,
          precio: data,
          iPrecio: "close-circle"
        });
      }
    }
  };

  pushDocument = () => {
    const { producto } = this.state;
    if (producto.data().id.substr(0, 3) === "PRS") {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            width: "100%",
            justifyContent: "center"
          }}
        >
          <Item floatingLabel style={{ width: "90%", height: 50 }}>
            <Icon type="MaterialIcons" name="shopping-basket" />
            <Label>Nombre producto</Label>
            <Input
              disabled={true}
              style={{ fontSize: 18, alignSelf: "flex-start" }}
              value={producto.data().name}
            />
          </Item>
          <Item floatingLabel style={{ width: "90%", height: 50 }}>
            <Icon type="MaterialIcons" name="shopping-basket" />
            <Label>Pollos en bodega</Label>
            <Input
              disabled={true}
              style={{ fontSize: 18, alignSelf: "flex-start" }}
              value={producto.data().totalChickens.toString()}
            />
          </Item>
          <Item floatingLabel style={{ width: "90%", height: 50 }}>
            <Icon type="MaterialIcons" name="get-app" />
            <Label>Peso promedio (libras)</Label>
            <Input
              disabled={true}
              style={{ fontSize: 18, alignSelf: "flex-start" }}
              value={producto.data().averageWeight.toString()}
            />
          </Item>
          <Item
            floatingLabel
            style={{ width: "90%", height: 50 }}
            error={this.state.eexistencia}
            success={this.state.sexistencia}
          >
            <Icon type="MaterialIcons" name="line-style" />
            <Label>Cantidad pollos a vender</Label>
            <Input
              style={{ fontSize: 18, alignSelf: "flex-start" }}
              keyboardType="numeric"
              onChangeText={existencia =>
                this.validate(
                  existencia,
                  "existencia",
                  producto.data().totalChickens
                )
              }
            />
            <Icon name={this.state.iexistencia} />
          </Item>
          <Item
            floatingLabel
            style={{ width: "90%", height: 50 }}
            error={this.state.ePrecio}
            success={this.state.sPrecio}
          >
            <Icon type="MaterialIcons" name="attach-money" />
            <Label>Precio de venta (libra)</Label>
            <Input
              style={{ fontSize: 18, alignSelf: "flex-start" }}
              keyboardType="numeric"
              onChangeText={precio => this.validate(precio, "precio")}
            />
            <Icon name={this.state.iPrecio} />
          </Item>
        </View>
      );
    } else if (producto.data().id.substr(0, 3) === "PRC") {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            width: "100%",
            justifyContent: "center"
          }}
        >
          <Item floatingLabel style={{ width: "90%", height: 50 }}>
            <Icon type="MaterialIcons" name="shopping-basket" />
            <Label>Nombre producto</Label>
            <Input
              disabled={true}
              style={{ fontSize: 18, alignSelf: "flex-start" }}
              value={producto.data().nombre}
            />
          </Item>
          <Item floatingLabel style={{ width: "90%", height: 50 }}>
            <Icon type="MaterialIcons" name="shopping-basket" />
            <Label>Especie</Label>
            <Input
              disabled={true}
              style={{ fontSize: 18, alignSelf: "flex-start" }}
              value={producto.data().especie}
            />
          </Item>
          <Item floatingLabel style={{ width: "90%", height: 50 }}>
            <Icon type="MaterialIcons" name="shopping-basket" />
            <Label>Cantidad quintales en bodega</Label>
            <Input
              disabled={true}
              style={{ fontSize: 18, alignSelf: "flex-start" }}
              value={producto.data().existencia.toString()}
            />
          </Item>
          <Item
            floatingLabel
            style={{ width: "90%", height: 55 }}
            error={this.state.eexistencia}
            success={this.state.sexistencia}
          >
            <Icon type="MaterialIcons" name="line-style" />
            <Label>¿Cuantos quintales quiere vender?</Label>
            <Input
              style={{ fontSize: 18, alignSelf: "flex-start" }}
              keyboardType="numeric"
              onChangeText={existencia =>
                this.validate(
                  existencia,
                  "existencia",
                  producto.data().existencia
                )
              }
            />
            <Icon name={this.state.iexistencia} />
          </Item>
          <Item
            floatingLabel
            style={{ width: "90%", height: 55 }}
            error={this.state.ePrecio}
            success={this.state.sPrecio}
          >
            <Icon type="MaterialIcons" name="attach-money" />
            <Label>Precio de venta (cada quintal)</Label>
            <Input
              style={{ fontSize: 18, alignSelf: "flex-start" }}
              keyboardType="numeric"
              onChangeText={precio => this.validate(precio, "precio")}
            />
            <Icon name={this.state.iPrecio} />
          </Item>
        </View>
      );
    } else {
    }
  };

  save = () => {
    const {
      id,
      precio,
      existencia,
      sexistencia,
      producto,
      sPrecio
    } = this.state;

    if (sexistencia && sPrecio) {
      this.setState({
        preloader: true,
        save: true
      });

      if (producto.data().id.substr(0, 3) === "PRS") {
        fs.collection("Mercado")
          .add({
            precioLibra: parseFloat(precio),
            id,
            idProduction: producto.data().idProduction,
            farmName: producto.data().farmName,
            idFarm: producto.data().idFarm,
            cantidadVender: parseInt(existencia),
            peso: producto.data().averageWeight,
            user: firebase.auth().currentUser.uid
          })
          .then(market => {
            fs.collection("Cellar")
              .doc(producto.id)
              .update({
                totalChickens:
                  producto.data().totalChickens - parseInt(existencia)
              });
            this.props.navigation.state.params.save(market.id);
            this.props.navigation.navigate("mercado");
          });
      } else if (producto.data().id.substr(0, 3) === "PRC") {
        fs.collection("Mercado")
          .add({
            precioQuintal: parseFloat(precio),
            id,
            idEstimation: producto.data().idEstimation,
            farmName: producto.data().farmName,
            idFarm: producto.data().idFarm,
            cantidadVender: parseInt(existencia),
            cultivo: producto.data().nombre,
            user: firebase.auth().currentUser.uid
          })
          .then(market => {
            fs.collection("Cellar")
              .doc(producto.id)
              .update({
                existencia: producto.data().existencia - parseInt(existencia)
              });
            this.props.navigation.state.params.save(market.id);
            this.props.navigation.navigate("mercado");
          });
      }
    }
  };
  render() {
    return (
      <Container>
        <Header
          style={{
            height: 70,
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
                fontSize: 40,
                color: "#fff",
                padding: 5
              }}
              onPress={() => this.props.navigation.navigate("mercado")}
            />
          </Left>
          <Body>
            <Title style={{ color: "#fff", fontSize: 19 }}>AGREGAR</Title>
          </Body>
          <Right />
        </Header>

        <ScrollView
          style={{
            flex: 1
          }}
        >
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardOpeningTime={250}
            ScroolEnable={false}
          >
            <Form style={style.container}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <Item floatingLabel style={{ width: "90%", height: 60 }}>
                  <Icon type="MaterialIcons" name="priority-high" />
                  <Label>ID</Label>
                  <Input
                    value={this.state.id}
                    disabled={true}
                    keyboardType="number-pad"
                    style={{
                      fontSize: 18,
                      alignSelf: "flex-start"
                    }}
                  />
                  <Icon name={this.state.iconInputId} />
                </Item>
              </View>
              {this.pushDocument()}
              <View
                style={{
                  marginTop: "10%",
                  marginBottom: "10%",
                  width: "60%"
                }}
              >
                <Button
                  style={style.addButton}
                  full
                  rounded
                  success
                  onPress={this.save}
                  disabled={this.state.save}
                >
                  <Text style={{ color: "white" }}>GUARDAR</Text>
                </Button>
              </View>
            </Form>
          </KeyboardAwareScrollView>
        </ScrollView>
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

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
  },
  addButton: {
    backgroundColor: "#077A65"
  },
  fields: {
    margin: "5%",
    width: "50%",
    flex: 50
  },
  errorValitation: {
    borderColor: "red"
  }
});
