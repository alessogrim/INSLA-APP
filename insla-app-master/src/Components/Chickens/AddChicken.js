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
export default class AddChicken extends Component {
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
      id: "",
      name: "",
      farm: this.props.navigation.state.params.farm,
      corral: this.props.navigation.state.params.corral,
      totalChickens: 0,
      maxCapacity: 0,
      Loaded: false,
      preloader: false,
      save: false,
      counterId: 0,

      //errors
      eName: false,
      etotalChickens: false,

      //icons
      itotalChickens: "",
      iName: "",
      //success
      sName: false,
      stotalChickens: false
    };
  }
  componentDidMount() {
    const { corral, farm } = this.props.navigation.state.params;
    fs.collection("corrales")
      .doc(corral.id)
      .get()
      .then(doc => {
        this.setState({
          maxCapacity: doc.data().capacity
        });
      })
      .then(() => {
        fs.collection("productions")
          .where("idFarm", "==", farm.id)
          .get()
          .then(query => {
            query.forEach(doc => {
              let id = doc.data().id.substr(4);
              if (parseInt(id) > this.state.counterId) {
                this.setState({
                  counterId: parseInt(id)
                });
              }
            });
          })
          .then(() => {
            this.setState({
              counterId: this.state.counterId + 1
            });
          })
          .then(() => {
            this.setState({
              id: "PRS-" + this.state.counterId,
              Loaded: true
            });
          });
      });
  }

  validate = (data, type) => {
    const regexName = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
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
      if (parseInt(data) > this.state.maxCapacity) {
        this.setState({
          stotalChickens: false,
          totalChickens: data,
          etotalChickens: true,
          itotalChickens: "close-circle"
        });
      } else {
        this.setState({
          stotalChickens: true,
          totalChickens: data,
          etotalChickens: false,
          itotalChickens: "checkmark-circle"
        });
      }
    }
  };

  save = async () => {
    const {
      stotalChickens,
      sName,
      name,
      id,
      totalChickens,
      farm,
      corral
    } = this.state;
    if (sName && stotalChickens) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("productions")
        .add({
          id,
          name,
          totalChickens: parseInt(totalChickens),
          idFarm: farm.id,
          idCorral: corral.id,
          deaths: 0,
          initialStage: false,
          growthStage: false,
          finalStage: false
        })
        .then(doc => {
          this.props.navigation.state.params.save(doc.id);
        })
        .then(() => {
          fs.collection("corrales")
            .doc(this.state.corral.id)
            .update({
              taken: true
            })
            .then(() => {
              this.props.navigation.navigate("ChickenFarming");
            });
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
              <Title style={{ color: "#fff" }}>NUEVO</Title>
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
                      Espacio Disponibles
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
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    error={this.state.eName}
                    success={this.state.sName}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre Produccion</Label>
                    <Input
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
