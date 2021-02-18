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

import { firebase, fs } from "../Firebase/config";

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
export default class UpdateProduction extends Component {
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
      id: this.props.navigation.state.params.item.data().id,
      name: this.props.navigation.state.params.item.data().name,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
      production: this.props.navigation.state.params.item,
      totalChickens: this.props.navigation.state.params.item.data()
        .totalChickens,
      maxCapacity: 0,
      Loaded: false,
      preloader: false,
      save: false,

      //errors
      eName: false,
      etotalChickens: false,

      //icons
      itotalChickens: "checkmark-circle",
      iName: "checkmark-circle",
      //success
      sName: true,
      stotalChickens: true
    };
  }

  componentDidMount() {
    const { item } = this.state;
    fs.collection("corrales")
      .doc(item.data().idCorral)
      .get()
      .then(doc => {
        this.setState({
          maxCapacity: doc.data().capacity
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  validate = (data, type) => {
    const { maxCapacity, totalChickens } = this.state;
    const regexName = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexProduction = /\d{2,15}/;
    if (type === "name") {
      if (regexName.test(data)) {
        this.setState({
          name: data,
          sName: true,
          eName: false,
          iName: "checkmark-circle"
        });
      } else {
        this.setState({
          sName: false,
          name: data,
          eName: true,
          iName: "close-circle"
        });
      }
    } else if (type === "totalChickens") {
      if (parseInt(data) <= maxCapacity && regexProduction.test(data)) {
        this.setState({
          stotalChickens: true,
          totalChickens: data,
          etotalChickens: false,
          itotalChickens: "checkmark-circle"
        });
      } else {
        this.setState({
          stotalChickens: false,
          totalChickens: data,
          etotalChickens: true,
          itotalChickens: "close-circle"
        });
      }
    }
  };

  update = () => {
    const {
      sName,
      stotalChickens,
      name,
      totalChickens,
      item,
      index
    } = this.state;

    if (sName && stotalChickens) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("productions")
        .doc(item.id)
        .update({
          name,
          totalChickens: parseInt(totalChickens)
        })
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("ChickenFarming");
        });
    } else {
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
              <Title style={{ color: "#fff" }}>ACTUALIZAR</Title>
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
                    <Label
                      style={{
                        textAlign: "center"
                      }}
                    >
                      Espacio Disponible en corral
                    </Label>
                    <Input
                      disabled={true}
                      value={this.state.maxCapacity.toFixed(0) + " Animales"}
                      style={{
                        fontSize: 18,
                        textAlign: "center",
                        alignSelf: "flex-start",
                        color: "red",
                        fontWeight: "500"
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
                    <Icon type="MaterialIcons" name="priority-high" />
                    <Label>ID</Label>
                    <Input
                      value={this.state.id}
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
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    error={this.state.eName}
                    success={this.state.sName}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre Produccion</Label>
                    <Input
                      value={this.state.name}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={name => {
                        this.validate(name, "name");
                      }}
                    />
                    <Icon name={this.state.iName} />
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
                    error={this.state.etotalChickens}
                    success={this.state.stotalChickens}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Cantidad Pollos</Label>
                    <Input
                      value={this.state.totalChickens.toString()}
                      onChangeText={totalChickens =>
                        this.validate(totalChickens, "totalChickens")
                      }
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="numeric"
                    />
                    <Icon name={this.state.itotalChickens} />
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
                    onPress={() => this.update()}
                  >
                    <Text style={{ color: "white" }}>ACTUALIZAR</Text>
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
