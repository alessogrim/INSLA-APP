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
  Container
} from "native-base";
import { firebase, fs } from "../../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class AddWorkers extends Component {
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
    const concentrate = this.props.navigation.state.params.concentrate;

    this.state = {
      id: concentrate.data().id,
      name: concentrate.data().name,
      quantity: concentrate.data().quantity,
      description: concentrate.data().description,
      stock: concentrate.data().stock,
      concentrate: concentrate,
      production: this.props.navigation.state.params.production,

      actualQuantity: 0,

      Loaded: true,
      preloader: false,
      save: false,

      //sucess
      sQuantity: false,
      eQuantity: false,
      iQuantity: ""
    };
  }

  save = async () => {
    const {
      concentrate,
      production,
      actualQuantity,
      sQuantity,
      stock,
      id,
      name,
      quantity
    } = this.state;
    if (sQuantity) {
      this.setState({
        preloader: true,
        save: true
      });

      fs.collection("concentrate")
        .doc(concentrate.id)
        .update({
          stock: parseFloat(stock) - parseFloat(actualQuantity)
        })
        .then(() => {
          fs.collection("chicken_food_initialStage_chicken_breeding")
            .add({
              id,
              name,
              idConcentrate: concentrate.id,
              idProduction: production.id,
              useProduct: parseFloat(actualQuantity)
            })
            .then(food => {
              this.props.navigation.state.params.save(food.id);
              this.props.navigation.navigate("InitialStage");
            });
        });
    } else {
      Alert.alert("Guardar Alimento", "Revise que los datos esten correctos!", [
        {
          text: "Aceptar",
          onPress: () => {
            this.setState({
              preloader: false,
              save: false
            });
          }
        }
      ]);
    }
  };

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexQuantity = /^[1-9]\d*$/;

    if (type === "actualQuantity") {
      if (regexQuantity.test(data) && data <= this.state.stock) {
        this.setState({
          actualQuantity: data,
          sQuantity: true,
          eQuantity: false,
          iQuantity: "checkmark-circle"
        });
      } else {
        this.setState({
          actualQuantity: data,
          sQuantity: false,
          eQuantity: true,
          iQuantity: "close-circle"
        });
      }
    }
  };

  ////////END VALIDATION

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
                  width: 50
                }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 21 }}>ALIMENTO</Title>
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
                      disabled={true}
                      value={this.state.id}
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
                    />
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre</Label>
                    <Input
                      disabled={true}
                      value={this.state.name}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                    />
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="people" />
                    <Label>Cantidad (libras por empaque)</Label>
                    <Input
                      disabled={true}
                      value={this.state.quantity.toString()}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                    />
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Descripción</Label>
                    <Input
                      disabled={true}
                      value={this.state.description}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                    />
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="location-on" />
                    <Label>Existencia (empaques)</Label>
                    <Input
                      value={this.state.stock.toString()}
                      disabled={true}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                    />
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
                    success={this.state.sQuantity}
                    error={this.state.eQuantity}
                  >
                    <Icon type="MaterialIcons" name="location-on" />
                    <Label>¿Cuantos empaques desea utilizar?</Label>
                    <Input
                      onChangeText={actualQuantity =>
                        this.validate(actualQuantity, "actualQuantity")
                      }
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="number-pad"
                    />
                    <Icon name={this.state.iQuantity} />
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
                    disabled={this.state.save}
                    onPress={() => this.save()}
                  >
                    <Text style={{ color: "white" }}>GUARDAR</Text>
                  </Button>
                </View>
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
              </Form>
            </KeyboardAwareScrollView>
          </ScrollView>
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
