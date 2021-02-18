import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
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
  Input
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class Seed extends Component {
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
      estimation: this.props.navigation.state.params,
      quantity: "",
      price: "",
      commet: "",
      weightSeed: "",
      sQuantity: false,
      eQuantity: false,
      iQuantity: "checkmark-circle",
      sPrice: false,
      ePrice: false,
      iPrice: "checkmark-circle",
      sWeightSeed: false,
      eWeightSeed: false,
      iWeightSeed: "checkmark-circle",
      sCommet: true,
      eCommet: false,
      iCommet: "checkmark-circle",
      arrayID: [],
      idGlobal: 0
    };
  }


  validate = (type, data) => {
    const regexcantidad = /^[0-9]+$/;
    const regexdescripcion = /./;
    const regexprecio = /[0-9]+(\.[0-9][0-9]?)?$/;


    if (type === "quantity") {
      if (regexcantidad.test(data)) {
        this.setState({
          quantity: data,
          sQuantity: true,
          eQuantity: false,
          iQuantity: "checkmark-circle"
        });
      } else {
        this.setState({
          quantity: data,
          sQuantity: false,
          eQuantity: true,
          iQuantity: "close-circle"
        });
      }
    }
    else if (type === "price") {
      if (regexprecio.test(data)) {
        this.setState({
          price: data,
          sPrice: true,
          ePrice: false,
          iPrice: "checkmark-circle"
        });
      } else {
        this.setState({
          price: data,
          sPrice: false,
          ePrice: true,
          iPrice: "close-circle"
        });
      }
    }
    else if (type === "weightSeed") {
      if (regexprecio.test(data)) {
        this.setState({
          weightSeed: data,
          sWeightSeed: true,
          eWeightSeed: false,
          iWeightSeed: "checkmark-circle"
        });
      } else {
        this.setState({
          weightSeed: data,
          sWeightSeed: false,
          eWeightSeed: true,
          iWeightSeed: "close-circle"
        });
      }
    } else if (type === "commet") {
      if (regexdescripcion.test(data)) {
        this.setState({
          commet: data,
          sCommet: true,
          eCommet: false,
          iCommet: "checkmark-circle"
        });
      } else {
        this.setState({
          commet: data,
          sCommet: false,
          eCommet: true,
          iCommet: "close-circle"
        });
      }
    }
  }



  componentDidMount() {
    let action = this.props.navigation.state.params.action;
    if (action === "edit") {
      let worker = this.props.navigation.state.params.doc.data();
      this.setState({
        estimation: this.props.navigation.state.params.estimation,
        Loaded: true,
        quantity: "" + worker.quantity,
        price: "" + worker.price,
        commet: "" + worker.commet,
        weightSeed: "" + worker.weightSeed,
        sQuantity: true,
        eQuantity: false,
        iQuantity: "checkmark-circle",
        sPrice: true,
        ePrice: false,
        iPrice: "checkmark-circle",
        sWeightSeed: true,
        eWeightSeed: false,
        iWeightSeed: "checkmark-circle",
        sCommet: true,
        eCommet: false,
        iCommet: "checkmark-circle",
      });
    } else {
      this.setState({
        estimation: this.props.navigation.state.params,
        Loaded: true
      });
    }
    fs.collection("seed")
      .where("idEstimation", "==", this.props.navigation.state.params.estimation.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.state.arrayID.push(doc.data().idGlobal)
        });
      });
  }

  saveSeed = () => {
    const { estimation, quantity, price, commet, weightSeed, sQuantity, sCommet, sPrecio, sWeightSeed } = this.state;

    if (sQuantity && sCommet && sPrecio && sWeightSeed) {
      let action = this.props.navigation.state.params.action;
      if (action == 'edit') {
        let worker = this.props.navigation.state.params.doc;
        let reference = this.props.navigation.state.params.estimation;

        fs.collection("seed").doc(worker.id)
          .update({
            idEstimation: reference.id,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            commet,
            weightSeed: parseFloat(weightSeed)
          })
          .then(() => {
            this.props.navigation.navigate("Labores");
          });

      } else {
        let idTemp = 0;
        let x = 0;
        while (x < this.state.arrayID.length) {
          if (this.state.arrayID[x] == idTemp) {
            idTemp = idTemp + 1;
            x = 0
          } else {
            x = x + 1;
          }
        }
        this.state.idGlobal = idTemp;
        fs.collection("seed")
          .add({
            idEstimation: estimation.id,
            idGlobal: this.state.idGlobal,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            commet,
            weightSeed: parseFloat(weightSeed)
          })
          .then(() => {
            this.props.navigation.navigate("Labores");
          });
      }
    } else {
      Alert.alert("Guardar Alzalinización", "Complete todos los campos", [
        {
          text: "Aceptar"
        }
      ]);
    }
  };

  getAreaOnMeters = () => {
    const { estimation } = this.state;
    if (estimation && estimation.data) {
      if (estimation.data().Medidas === "Hectareas") {
        return estimation.data().Area / 0.0001;
      } else if (estimation.data().Medidas === "Manzanas") {
        return (estimation.data().Area * 0.7) / 0.0001;
      } else {
        return estimation.data().Area;
      }
    }
  };

  render() {
    const { Loaded, estimation } = this.state;
    let action = this.props.navigation.state.params.action;


    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Header style={styles.headerStyle}>
          <Left>
            <Icon
              type="MaterialIcons"
              name="arrow-back"
              style={styles.iconStyle}
              onPress={() => this.props.navigation.navigate("seedHome")}
            />
          </Left>
          <Body>
            <Title
              style={{
                fontSize: 17,
                color: "#fff"
              }}
            >
              SEMILLAS
            </Title>
          </Body>
          <Right />
        </Header>
        <View
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center"
          }}
        >
          <ScrollView scrollEnabled="false" style={{ width: "100%" }}>
            <KeyboardAwareScrollView
              resetScrollToCoords={{ x: 0, y: 0 }}
              keyboardOpeningTime={250}
              ScroolEnable={false}
            >
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    marginTop: "10%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <Item style={{ width: "80%", height: 60 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        width: "100%",
                        textAlign: "center"
                      }}
                    >
                      El Área a sembrar es:{" \n"}
                      <Text
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: 25,
                          width: "100%",
                          textAlign: "center"
                        }}
                      >
                        {this.getAreaOnMeters()}{" "}
                        <Text style={{ color: "red" }}>m2</Text>
                      </Text>
                    </Text>
                  </Item>
                </View>

                <View
                  style={{
                    width: "80%",
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8
                  }}
                >
                  <Item
                    error={this.state.eQuantity}
                    success={this.state.sQuantity}
                    floatingLabel
                    style={{
                      width: "80%",
                      height: 60,
                      alignSelf: "flex-start"
                    }}
                  >
                    <Icon type="MaterialIcons" name="opacity" />
                    <Label>Cantidad de semillas</Label>
                    <Input
                      keyboardType="number-pad"
                      style={{
                        fontSize: 18
                      }}
                      onChangeText={quantity => this.validate("quantity", quantity)}
                      value={'' + this.state.quantity}
                    />
                    <Icon
                      type="MaterialIcons"
                      name="info"
                      onPress={() => {
                        Alert.alert(
                          "Cantidad",
                          "Ingrese la cantidad de semillas por hueco",
                          [
                            {
                              text: "Aceptar"
                            }
                          ]
                        );
                      }}
                    />
                  </Item>
                </View>

                <View
                  style={{
                    width: "80%",
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8
                  }}
                >
                  <Item
                    error={this.state.eWeightSeed}
                    success={this.state.sWeightSeed}
                    floatingLabel
                    style={{
                      width: "80%",
                      height: 60,
                      alignSelf: "flex-start"
                    }}
                  >
                    <Icon type="MaterialIcons" name="archive" />
                    <Label>Peso estimado</Label>
                    <Input
                      keyboardType="numeric"
                      style={{ fontSize: 18 }}
                      onChangeText={weightSeed => this.validate("weightSeed", weightSeed)}
                      value={'' + this.state.weightSeed}

                    />
                    <Icon
                      type="MaterialIcons"
                      name="info"
                      onPress={() => {
                        Alert.alert(
                          "Peso",
                          "Ingrese el peso estimado de cada semilla en gramos",
                          [
                            {
                              text: "Aceptar"
                            }
                          ]
                        );
                      }}
                    />
                  </Item>
                </View>
                <View
                  style={{
                    width: "80%",
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8
                  }}
                >
                  <Item
                    error={this.state.ePrice}
                    success={this.state.sPrice}
                    floatingLabel
                    style={{
                      width: "80%",
                      height: 60,
                      alignSelf: "flex-start"
                    }}
                  >
                    <Icon type="MaterialIcons" name="attach-money" />
                    <Label>Precio estimado</Label>
                    <Input
                      keyboardType="numeric"
                      style={{ fontSize: 18 }}
                      onChangeText={price => this.validate("price", price)}
                      value={'' + this.state.price}
                    />
                    <Icon
                      type="MaterialIcons"
                      name="info"
                      onPress={() => {
                        Alert.alert(
                          "Precio",
                          "Ingrese el precio estimado (lb) de semillas",
                          [
                            {
                              text: "Aceptar"
                            }
                          ]
                        );
                      }}
                    />
                  </Item>
                </View>
                <View
                  style={{
                    width: "80%",
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8
                  }}
                >
                  <Item
                    error={this.state.eCommet}
                    success={this.state.sCommet}
                    floatingLabel
                    style={{
                      width: "100%",
                      height: 60,
                      alignSelf: "flex-start"
                    }}
                  >
                    <Icon type="MaterialIcons" name="description" />
                    <Label>Observaciones</Label>
                    <Input
                      style={{ fontSize: 18 }}
                      onChangeText={commet => this.validate("commet", commet)}
                      value={'' + this.state.commet}
                    />
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
                    style={styles.addButton}
                    full
                    rounded
                    success
                    onPress={this.saveSeed}>
                    <Text style={{ color: "white" }} >{action == "edit" ? "ACTUALIZAR" : "AÑADIR"}</Text>
                  </Button>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  addButton: {
    backgroundColor: "#077A65"
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
