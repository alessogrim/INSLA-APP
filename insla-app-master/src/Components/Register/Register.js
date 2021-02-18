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
import { Dropdown } from "react-native-material-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class Register extends Component {
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

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      lastName: "",
      email: "",
      password: "",
      verificationPassword: "",
      phone: "",
      type: "",
      location: "",

      //errors inputs
      eName: false,
      eLastName: false,
      eEmail: false,
      ePassword: false,
      eVerificationPassword: false,
      ePhone: false,
      eLocation: false,

      //succes inputs
      sName: false,
      sLastName: false,
      sEmail: false,
      sPassword: false,
      sVerificationPassword: false,
      sPhone: false,
      sLocation: false,

      //icon inputs
      iName: "",
      iLastName: "",
      iEmail: "",
      iPassword: "",
      iVerificationPassword: "",
      iPhone: "",
      iLocation: "",

      Loaded: true,
      saveState: true
    };
  }

  evaluation = (text, type) => {
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regexName = /^[a-z ,.-]+$/i;
    const regexLastName = /^[a-z ,.-]+$/i;
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    const regexPhone = /\d{8}/;
    const regexLocation = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;

    let regexMap = {
      email: regexEmail,
      lastname: regexLastName,
      name: regexName,
      password: regexPass,
      phone: regexPhone,
      location: regexLocation
    };

    return regexMap[type].test(text);
  };

  // :::::::::::::::::::::: VALIDATIONS::::::::::::::::::::::
  validate = (text, type) => {
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regexName = /^[a-z ,.-]+$/i;
    const regexLastName = /^[a-z ,.-]+$/i;
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    const regexPhone = /\d{8}/;
    const regexLocation = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;

    if (type === "email") {
      if (regexEmail.test(text)) {
        this.setState({
          email: text,
          eEmail: false,
          sEmail: true,
          iEmail: "checkmark-circle"
        });
      } else {
        this.setState({
          email: text,
          eEmail: true,
          sEmail: false,
          iEmail: "close-circle"
        });
      }
    } else if (type === "name") {
      if (regexName.test(text)) {
        this.setState({
          name: text,
          eName: false,
          sName: true,
          iName: "checkmark-circle"
        });
      } else {
        this.setState({
          name: text,
          eName: true,
          sName: false,
          iName: "close-circle"
        });
      }
    } else if (type === "lastName") {
      if (regexLastName.test(text)) {
        this.setState({
          lastName: text,
          eLastName: false,
          sLastName: true,
          iLastName: "checkmark-circle"
        });
      } else {
        this.setState({
          lastName: text,
          eLastName: true,
          sLastName: false,
          iLastName: "close-circle"
        });
      }
    } else if (type === "password") {
      if (regexPass.test(text)) {
        this.setState({
          password: text,
          sPassword: true,
          ePassword: false,
          iPassword: "checkmark-circle"
        });
      } else {
        this.setState({
          password: text,
          ePassword: true,
          sPassword: false,
          iPassword: "close-circle"
        });
      }
    } else if (type === "verificationPassword") {
      if (text === this.state.password) {
        this.setState({
          verificationPassword: text,
          eVerificationPassword: false,
          sVerificationPassword: true,
          iVerificationPassword: "checkmark-circle"
        });
      } else {
        this.setState({
          verificationPassword: text,
          eVerificationPassword: true,
          sVerificationPassword: false,
          iVerificationPassword: "close-circle"
        });
      }
    } else if (type === "phone") {
      if (regexPhone.test(text)) {
        this.setState({
          phone: text,
          ePhone: false,
          sPhone: true,
          iPhone: "checkmark-circle"
        });
      } else {
        this.setState({
          phone: text,
          ePhone: true,
          sPhone: false,
          iPhone: "close-circle"
        });
      }
    } else if (type === "location") {
      if (regexLocation.test(text)) {
        this.setState({
          eLocation: false,
          location: text,
          sLocation: true,
          iLocation: "checkmark-circle"
        });
      } else {
        this.setState({
          location: text,
          eLocation: true,
          sLocation: false,
          iLocation: "close-circle"
        });
      }
    }
  };
  //::::::::::::::::::::::::END VALIDATION ::::::::::::::::::::::

  // -------------------------Save User -----------------
  saveUser = () => {
    const {
      name,
      sName,
      lastName,
      sLastName,
      email,
      sEmail,
      password,
      sPassword,
      sVerificationPassword,
      phone,
      sPhone,
      location,
      sLocation,
      type
    } = this.state;

    if (
      sName &&
      sLastName &&
      sEmail &&
      sPassword &&
      sVerificationPassword &&
      sPhone &&
      sLocation &&
      type != ""
    ) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          fs.collection("users")
            .add({
              role: 1,
              name,
              lastName,
              email,
              phone,
              location,
              type
            })
            .then(() => {
              firebase.auth().signInWithEmailAndPassword(email, password);
            });
        });
    } else {
      Alert.alert("", "Revise que todos los campos esten correctos", [], {
        cancelable: true
      });
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
                onPress={() => this.props.navigation.navigate("loginEmail")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 13 }}>
                CREAR USUARIO
              </Title>
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
                  <Item
                    floatingLabel
                    success={this.state.sName}
                    error={this.state.eName}
                    style={{ width: "90%", height: 60 }}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre</Label>
                    <Input
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
                      onChangeText={name => this.validate(name, "name")}
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
                    success={this.state.sLastName}
                    error={this.state.eLastName}
                  >
                    <Icon type="MaterialIcons" name="people" />
                    <Label>Apellido</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={lastName =>
                        this.validate(lastName, "lastName")
                      }
                    />
                    <Icon name={this.state.iLastName} />
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
                    error={this.state.eEmail}
                    success={this.state.sEmail}
                  >
                    <Icon type="MaterialIcons" name="mail" />
                    <Label>Email</Label>
                    <Input
                      keyboardType="email-address"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={email => this.validate(email, "email")}
                    />
                    <Icon name={this.state.iEmail} />
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
                    error={this.state.ePassword}
                    success={this.state.sPassword}
                  >
                    <Icon type="MaterialIcons" name="fingerprint" />
                    <Label>Contraseña</Label>
                    <Input
                      secureTextEntry={true}
                      keyboardType="email-address"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={password =>
                        this.validate(password, "password")
                      }
                    />
                    <Icon name={this.state.iPassword} />
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
                    error={this.state.eVerificationPassword}
                    success={this.state.sVerificationPassword}
                  >
                    <Icon type="MaterialIcons" name="fingerprint" />
                    <Label>Repetir contraseña</Label>
                    <Input
                      secureTextEntry={true}
                      keyboardType="email-address"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={verificationPassword =>
                        this.validate(
                          verificationPassword,
                          "verificationPassword"
                        )
                      }
                    />
                    <Icon name={this.state.iVerificationPassword} />
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
                    error={this.state.ePhone}
                    success={this.state.sPhone}
                  >
                    <Icon type="MaterialIcons" name="phone" />
                    <Label>Telefono</Label>
                    <Input
                      maxLength={8}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={phone => this.validate(phone, "phone")}
                    />
                    <Icon name={this.state.iPhone} />
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
                    error={this.state.eLocation}
                    success={this.state.sLocation}
                  >
                    <Icon type="MaterialIcons" name="directions" />
                    <Label>Dirección</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={location =>
                        this.validate(location, "location")
                      }
                    />
                    <Icon name={this.state.iLocation} />
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
                  <Dropdown
                    label="Tipo"
                    containerStyle={{ width: "95%", marginLeft: 10 }}
                    selectedItemColor="#000"
                    onChangeText={type =>
                      this.setState({
                        type
                      })
                    }
                    pickerStyle={{
                      borderBottomColor: "transparent",
                      borderWidth: 0
                    }}
                    fontSize={17}
                    dropdownMargins={{ min: 5, max: 20 }}
                    data={[
                      {
                        value: "Agricultor"
                      },
                      {
                        value: "Casa Agricola"
                      }
                    ]}
                  />
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
                    onPress={this.saveUser}
                  >
                    <Text style={{ color: "white" }}>GUARDAR</Text>
                  </Button>
                </View>
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
