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
export default class AddFarm extends Component {
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
      id: "",
      name: "",
      location: "",
      groundSize: 0,
      Loaded: false,
      preloader: false,
      exist: false,
      save: false,
      counterId: 0,
      //validation input
      iconInputId: "",
      iconInputName: "",
      iconInputLocation: "",
      IconInputGroundSize: "",
      inputErrorNameState: false,
      inputSuccessNameState: false,
      inputSuccessLocation: false,
      inputErrorLocation: false,
      inputSuccessGroundSize: false,
      inputErrorGroundSize: false
    };
  }

  componentDidMount() {
    // ------------- PARA FINCAS SE ESTA USANDO PREFIJO FNS PARA EL INICIO DEL ID.  EJEMPLO: FNS-001
    fs.collection("farms")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().user === firebase.auth().currentUser.uid) {
            let id = doc.data().id.substr(4);
            if (parseInt(id) > this.state.counterId) {
              this.setState({
                counterId: parseInt(id)
              });
            }
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
          id: "FNS-" + this.state.counterId,
          Loaded: true
        });
      });
  }

  addFarm = () => {
    const {
      id,
      name,
      location,
      groundSize,
      inputSuccessIdState,
      inputSuccessNameState,
      inputSuccessLocation,
      inputSuccessGroundSize
    } = this.state;
    if (
      inputSuccessNameState &&
      inputSuccessLocation &&
      inputSuccessGroundSize
    ) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("farms")
        .where("user", "==", firebase.auth().currentUser.uid)
        .where("id", "==", id)
        .get()
        .then(query => {
          if (query.size) {
            Alert.alert("Guardar Finca", "el Id ya está registrado", [
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
          } else {
            fs.collection("farms")
              .add({
                user: firebase.auth().currentUser.uid,
                id,
                name,
                location,
                groundSize: parseFloat(groundSize)
              })
              .then(() => {
                this.props.navigation.navigate("Farms");
              });
          }
        });
    } else {
      Alert.alert("Guardar Finca", "Los campos son incorrectos", [
        {
          text: "Aceptar"
        }
      ]);
    }
  };
  // :::::::::::::::::::::: VALIDATIONS::::::::::::::::::::::
  validate = (text, type) => {
    const regexName = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexLocation = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexGroundSize = /\d{2}/;
    if (type === "name") {
      if (regexName.test(text)) {
        this.setState({
          inputSuccessNameState: true,
          inputErrorNameState: false,
          name: text,
          iconInputName: "checkmark-circle"
        });
      } else {
        this.setState({
          inputSuccessNameState: false,
          inputErrorNameState: true,
          name: text,
          iconInputName: "close-circle"
        });
      }
    } else if (type === "location") {
      if (regexLocation.test(text)) {
        this.setState({
          inputSuccessLocation: true,
          inputErrorLocation: false,
          location: text,
          iconInputLocation: "checkmark-circle"
        });
      } else {
        this.setState({
          inputSuccessLocation: false,
          inputErrorLocation: true,
          location: text,
          iconInputLocation: "close-circle"
        });
      }
    } else if (type === "groundSize") {
      if (regexGroundSize.test(text)) {
        this.setState({
          inputSuccessGroundSize: true,
          inputErrorGroundSize: false,
          groundSize: text,
          IconInputGroundSize: "checkmark-circle"
        });
      } else {
        this.setState({
          inputSuccessGroundSize: false,
          inputErrorGroundSize: true,
          groundSize: text,
          IconInputGroundSize: "close-circle"
        });
      }
    }
  };
  //::::::::::::::::::::::::END VALIDATION ::::::::::::::::::::::

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
                onPress={() => this.props.navigation.navigate("Farms")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 25 }}>NUEVA</Title>
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
                      maxLength={8}
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
                    success={this.state.inputSuccessNameState}
                    error={this.state.inputErrorNameState}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre Finca</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={name => this.validate(name, "name")}
                    />
                    <Icon name={this.state.iconInputName} />
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
                    error={this.state.inputErrorLocation}
                    success={this.state.inputSuccessLocation}
                  >
                    <Icon type="MaterialIcons" name="add-location" />
                    <Label>Ubicación</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={location =>
                        this.validate(location, "location")
                      }
                    />
                    <Icon name={this.state.iconInputLocation} />
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
                    error={this.state.inputErrorGroundSize}
                    success={this.state.inputSuccessGroundSize}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Área de terreno</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="numeric"
                      onChangeText={groundSize =>
                        this.validate(groundSize, "groundSize")
                      }
                    />
                    <Icon name={this.state.IconInputGroundSize} />
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
                    onPress={this.addFarm}
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
