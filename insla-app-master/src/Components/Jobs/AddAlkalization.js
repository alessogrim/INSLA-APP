import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import {
  Text,
  Header,
  Left,
  Body,
  Title,
  Right,
  Form,
  Row,
  Content,
  Textarea,
  Icon,
  Item,
  Label,
  Button,
  Spinner,
  Input
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class AddWorkerNutrients extends Component {
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
      estimation:this.props.navigation.state.params.estimation,
      quantity: "",
      price: "",
      description: "",
      arrayID: [],
      ePrice: false,
      sPrice: false,
      iPrice: false,
      iPrice: "",
      eQuantity: false,
      sQuantity: false,
      iQuantity: false,
      index: this.props.navigation.state.params.index,
      iQuantity: "",
      eDescription: false,
      sDescription: false,
      iDescription: false,
      iObs: "",
      idGlobal: 0,
      Loaded: true
    };
  }

  validate = (text, type) => {
    const regexDayQuantity = /\d{1,5}/;
    const regexDayPrice = /\d{1,5}/;
    const regexDescription = /^(?=.{0,20}$)[a-z]+(?:['_.\s][a-z]+)*$/i;

    if (type === 'quantity') {
      if (regexDayQuantity.test(text)) {
        this.setState({
          quantity: text,
          eQuantity: false,
          sQuantity: true,
          iQuantity: "checkmark-circle"
        })

      } else {
        this.setState({
          quantity: text,
          eQuantity: true,
          sQuantity: false,
          iQuantity: "close-circle"
        });
      }
    }else if(type === 'price'){
      if (regexDayPrice.test(text)) {
        this.setState({
          price: text,
          ePrice: false,
          sPrice: true,
          iPrice: "checkmark-circle"
        })

      } else {
        this.setState({
          price: text,
          ePrice: true,
          sPrice: false,
          iPrice: "close-circle"
        });
      }
    }else if(type === 'description'){
      if (regexDescription.test(text)) {
        this.setState({
          description: text,
          eDescription: false,
          sDescription: true,
          iDescription: "checkmark-circle"
        })

      } else {
        this.setState({
          description: text,
          eDescription: true,
          sDescription: false,
          iDescription: "close-circle"
        });
      }
    }



  };

  componentDidMount() {
    let action = this.props.navigation.state.params.action;
    if (action === "edit") {
      let worker = this.props.navigation.state.params.doc.data();
      this.setState({
        estimation: this.props.navigation.state.params.estimation,
        Loaded: true,
        quantity: "" + worker.quantity,
        price: "" + worker.price,
        description: "" + worker.description
      });
    } else {
      this.setState({
        estimation: this.props.navigation.state.params.estimation,
        Loaded: true
      });
    }

  }

  saveAlkalization = () => {
    const { estimation, quantity, price, description, Loaded,sQuantity,sPrice,sDescription } = this.state;

      if (quantity < 0) {
        Alert.alert("Cantidad cal", "el valor de la cantidad es incorrecto", [
          {
            text: "Aceptar"
          }
        ]);
      } else if (price < 0) {
        Alert.alert("Precio Cal", "El precio es incorrecto", [
          {
            text: "Aceptar"
          }
        ]);
      }else {
        this.setState({
          Loaded: false
        });
        let action = this.props.navigation.state.params.action;

        if (action == "edit") {
          let worker = this.props.navigation.state.params.doc;
          let reference = this.props.navigation.state.params.estimation;
          
        fs.collection("soilAlkalization")
        .doc(worker.id)
        .update({
          idEstimation: reference.id,
          quantity: parseFloat(quantity),
          price: parseFloat(price),
          description: description
          }) 
          .then(() => {
            this.setState({
              Loaded: true
            });
            this.props.navigation.state.params.update(worker.id, this.state.index);
            this.props.navigation.navigate("nutrientsHome");
          });
        } else {
          if (sQuantity&&sPrice&&sDescription) {
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
          let reference = this.props.navigation.state.params.estimation;
          fs.collection("soilAlkalization")
            .add({
              idEstimation: reference.id,
              idGlobal: this.state.idGlobal,
              quantity: parseFloat(quantity),
              price: parseFloat(price),
              description: description
            })
            .then((alkanization) => {
              this.setState({
                Loaded: true
              });
              this.props.navigation.state.params.save(alkanization.id);
              this.props.navigation.navigate("nutrientsHome");
            });
          }
        }
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
    let action = this.props.navigation.state.params.action;
    const { Loaded, estimation } = this.state;
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
                onPress={() => this.props.navigation.navigate("nutrientsHome")}
              />
            </Left>
            <Body>
              <Title
                style={{
                  fontSize: 13,
                  color: "#fff"
                }}
              >
                ALCALINIZACIÓN
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
                      floatingLabel
                      style={{
                        width: "70%",
                        height: 60,
                        alignSelf: "flex-start"
                      }}
                      success={this.state.sQuantity}
                      error={this.state.eQuantity}
                    >
                      <Icon type="MaterialIcons" name="shopping-basket" />
                      <Label>Cantidad cal (Kg)</Label>
                      <Input
                        maxLength={5}
                        keyboardType="numeric"
                        style={{
                          fontSize: 18
                        }}
                        onChangeText={quantity => this.validate( quantity , "quantity")}
                        value={"" + this.state.quantity}
                      />
                      <Icon name={this.state.iQuantity} />
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
                      floatingLabel
                      style={{
                        width: "70%",
                        height: 60,
                        alignSelf: "flex-start"
                      }}
                      success={this.state.sPrice}
                      error={this.state.ePrice}
                    >
                      <Icon type="MaterialIcons" name="attach-money" />
                      <Label>Precio cal</Label>
                      <Input
                      maxLength={5}
                        keyboardType="numeric"
                        style={{ fontSize: 18 }}
                        onChangeText={price => this.validate(price, "price")}
                        value={"" + this.state.price}
                      />
                      <Icon name={this.state.iPrice} />
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
                  <Content padder style={{ width: "100%" }}>
                    <Form
                        error={this.state.eDescription}
                        success={this.state.sDescription}>
                      <Row
                        style={{
                          width: "100%",
                          alignSelf: "flex-start"
                        }}
                      >
                        <Icon type="MaterialIcons" name="description" />
                        <Text style={{ color: "gray" }}>
                          Observaciones{""}
                        </Text>
                      </Row>
                      <Textarea
                        rowSpan={3}
                        bordered
                        onChangeText={description =>
                          this.validate(description, "description")
                        }
                      />
                    </Form>
                  </Content>
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
                    onPress={this.saveAlkalization}
                  >
                    <Text style={{ color: "white" }}>{action == "edit" ? "ACTUALIZAR" : "GUARDAR"}</Text>
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
}

const styles = StyleSheet.create({
  titleStyle: {
    color: "#fff"
  },
  container: {
    flexDirection: "column",
    height: "100%"
  },
  addButton: {
    backgroundColor: "#077A65"
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
  },
  errorValitation: {
    borderColor: "red"
  }
});
