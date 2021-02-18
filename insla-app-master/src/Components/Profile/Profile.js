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
      name: this.props.navigation.state.params.data().name,
      lastName: this.props.navigation.state.params.data().lastName,
      phone: this.props.navigation.state.params.data().phone,
      type: this.props.navigation.state.params.data().type,
      location: this.props.navigation.state.params.data().location,

      //errors inputs
      eName: false,
      eLastName: false,
      ePhone: false,
      eLocation: false,

      //succes inputs
      sName: true,
      sLastName: true,
      sPhone: true,
      sLocation: true,

      //icon inputs
      iName: "",
      iLastName: "",
      iEmail: "",
      iPhone: "",
      iLocation: "",
      Loaded: true
    };
  }

  // :::::::::::::::::::::: VALIDATIONS::::::::::::::::::::::
  validate = (text, type) => {
    const regexName = /^[a-z ,.-]+$/i;
    const regexLastName = /^[a-z ,.-]+$/i;
    const regexPhone = /\d{8}/;
    const regexLocation = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;

    if (type === "name") {
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

  // -------------------------UPDATE USER -----------------
  updateUser = () => {
    const {
      sLocation,
      sName,
      sPhone,
      sLastName,
      name,
      lastName,
      location,
      phone,
      type
    } = this.state;
    if (sLocation && sName && sPhone && sLastName) {
      fs.collection("users")
        .doc(this.props.navigation.state.params.id)
        .update({
          name,
          lastName,
          location,
          phone,
          type
        })
        .then(() => {
          Alert.alert(
            "Actualizar Usuario",
            "Usuario actualizado exitosamente"[
              {
                text: "Aceptar"
              }
            ]
          );
        })
        .then(() => {
          this.props.navigation.navigate("Farms");
        });
    } else {
      Alert.alert("Actualizar Usuario", "Los campos son incorrectos", [
        {
          text: "Aceptar"
        }
      ]);
    }
  };

  render() {
    const { Loaded, name, lastName, location, phone, type } = this.state;

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
              <Title style={{ color: "#fff", fontSize: 18 }}>ACTUALIZAR</Title>
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
                      value={name}
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
                      value={lastName}
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
                    error={this.state.ePhone}
                    success={this.state.sPhone}
                  >
                    <Icon type="MaterialIcons" name="phone" />
                    <Label>Telefono</Label>
                    <Input
                      value={phone}
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
                      value={location}
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
                    value={type}
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
                    onPress={this.updateUser}
                  >
                    <Text style={{ color: "white" }}>ACTUALIZAR</Text>
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
