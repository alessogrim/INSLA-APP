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
  Spinner
} from "native-base";

import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Cellar from "./Cellar";

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
      farm: this.props.navigation.state.params.farm,

      existencia: 0,

      //errors

      eexistencia: false,

      //icons

      iexistencia: "",

      //success
      snombre: false,
      sprecio: false,
      sexistencia: false
    };
  }

  validate = (data, type) => {
    const regexexistencia = /\d{1,4}/;
    if (type === "existencia") {
      if (regexexistencia.test(data)) {
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
    }
  };

  async save() {
    const { id, nombre, precio, existencia, farm, sexistencia } = this.state;

    if (snombre && sprecio && sexistencia) {
      fs.collection("Cellar")
        .add({
          idFarm: farm.id,
          id,
          nombre: nombre,
          precio: parseFloat(precio),
          existencia: parseInt(existencia)
        })
        .then(market => {
          this.props.navigation.state.params.save(market.id);
          this.props.navigation.navigate("cellar");
        });
    }
  }
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
              onPress={() => this.props.navigation.navigate("cellar")}
            />
          </Left>
          <Body>
            <Title style={{ color: "#fff", fontSize: 25 }}>NUEVO</Title>
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
                    value={this.state.id.toString()}
                    disabled={true}
                    maxLength={4}
                    keyboardType="number-pad"
                    style={{
                      fontSize: 18,
                      alignSelf: "flex-start"
                    }}
                  />
                  <Icon name={this.state.iconInputId} />
                </Item>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <Item
                  floatingLabel
                  style={{ width: "90%", height: 60 }}
                  error={this.state.snombre}
                  success={this.state.snombre}
                >
                  <Icon type="MaterialIcons" name="shopping-basket" />
                  <Label>Nombre producto</Label>
                  <Input
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                    onChangeText={nombre => this.validate(nombre, "nombre")}
                  />
                  <Icon name={this.state.inombre} />
                </Item>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <Item
                  floatingLabel
                  style={{ width: "90%", height: 60 }}
                  error={this.state.sprecio}
                  success={this.state.sprecio}
                >
                  <Icon type="MaterialIcons" name="attach-money" />

                  <Label>Precio</Label>
                  <Input
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                    keyboardType="numeric"
                    onChangeText={precio => this.validate(precio, "precio")}
                  />
                  <Icon name={this.state.iprecio} />
                </Item>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <Item
                  floatingLabel
                  style={{ width: "90%", height: 60 }}
                  error={this.state.sexistencia}
                  success={this.state.sexistencia}
                >
                  <Icon type="MaterialIcons" name="line-style" />
                  <Label>Cantidad</Label>
                  <Input
                    style={{ fontSize: 18, alignSelf: "flex-start" }}
                    keyboardType="numeric"
                    onChangeText={existencia =>
                      this.validate(existencia, "existencia")
                    }
                  />
                  <Icon name={this.state.iexistencia} />
                </Item>
              </View>
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
                  onPress={this.save.bind(this)}
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
