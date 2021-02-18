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
  Input,
  Form,
  Container
} from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { firebase, fs } from "../../Firebase/config";

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

//:::::::::::::::::::::::::::: SHOW SWIPE AREA ::::::::::::::::::::::::
export default class ChickenProduct extends Component {
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
      buttonState: false,
      preloader: false,
      production: this.props.navigation.state.params.production,
      id: this.props.navigation.state.params.production.data().id,
      name: this.props.navigation.state.params.production.data().name,
      farm: this.props.navigation.state.params.farm,
      totalChickens: this.props.navigation.state.params.production.data()
        .totalChickens,
      averageWeight: 0,
      update: false,
      Loaded: false,
      preloader: false,
      sale: {},

      //success
      sAverageWeight: false,
      //errors
      eAverageWeight: false,
      //icons
      iAverageWeight: ""
    };
  }
  componentDidMount() {
    fs.collection("Cellar")
      .where("idFarm", "==", this.state.farm.id)
      .where("idProduction", "==", this.state.production.id)
      .get()
      .then(query => {
        if (query.size != 0) {
          query.forEach(doc => {
            this.setState({
              averageWeight: doc.data().averageWeight,
              update: true,
              iAverageWeight: "checkmark-circle",
              sAverageWeight: true,
              sale: doc
            });
          });
        }
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  validate = (data, type) => {
    const regexAverageWeight = /^[1-9]+([.])?([0-9]+)?$/;
    if (type === "averageWeight") {
      if (regexAverageWeight.test(data)) {
        this.setState({
          averageWeight: data,
          sAverageWeight: true,
          eAverageWeight: false,
          iAverageWeight: "checkmark-circle"
        });
      } else {
        this.setState({
          averageWeight: data,
          sAverageWeight: false,
          eAverageWeight: true,
          iAverageWeight: "close-circle"
        });
      }
    }
  };
  update = async () => {
    const { averageWeight, sAverageWeight, sale } = this.state;
    if (sAverageWeight) {
      this.setState({
        preloader: true,
        buttonState: true
      });
      fs.collection("Cellar")
        .doc(sale.id)
        .update({
          averageWeight: parseFloat(averageWeight)
        })
        .then(() => {
          this.props.navigation.goBack();
        });
    } else {
      Alert.alert(
        "Agregar Producto",
        "Revise sus campos",
        [
          {
            text: "Aceptar"
          }
        ],
        { cancelable: false }
      );
    }
  };

  save = async () => {
    const {
      id,
      name,
      averageWeight,
      sAverageWeight,
      totalChickens,
      farm,
      production
    } = this.state;
    if (sAverageWeight) {
      this.setState({
        preloader: true,
        buttonState: true
      });
      fs.collection("Cellar")
        .add({
          id,
          name,
          idFarm: farm.id,
          idProduction: production.id,
          totalChickens: parseInt(totalChickens),
          averageWeight: parseFloat(averageWeight),
          farmName: farm.data().name
        })
        .then(() => {
          this.props.navigation.navigate("Stages");
        });
    } else {
      Alert.alert(
        "Agregar Producto",
        "Revise sus campos",
        [
          {
            text: "Aceptar"
          }
        ],
        { cancelable: false }
      );
    }
  };

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
                  padding: 5
                }}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>PRODUCTO</Title>
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
                      maxLength={13}
                      disabled={true}
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
                    <Label>Nombre Produccion</Label>
                    <Input
                      value={this.state.name}
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Cantidad Pollos disponibles</Label>
                    <Input
                      value={this.state.totalChickens.toString()}
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
                    error={this.state.eAverageWeight}
                    success={this.state.sAverageWeight}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Peso estimado (por pollo Lb.)</Label>
                    <Input
                      value={
                        this.state.averageWeight != 0
                          ? this.state.averageWeight.toString()
                          : null
                      }
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={averageWeight =>
                        this.validate(averageWeight, "averageWeight")
                      }
                      keyboardType="numeric"
                    />
                    <Icon name={this.state.iAverageWeight} />
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
                    onPress={this.state.update ? this.update : this.save}
                  >
                    <Text style={{ color: "white" }}>
                      {this.state.update ? "ACTUALIZAR" : "GUARDAR"}
                    </Text>
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
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  }
});
