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

import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { fs, firebase } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class UpdateFarm extends Component {
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
      id: this.props.navigation.state.params.data().id,
      name: this.props.navigation.state.params.data().name,
      location: this.props.navigation.state.params.data().location,
      groundSize: this.props.navigation.state.params.data().groundSize,

      //--------------success ---
      sName: true,
      sLocation: true,
      sGroundSize: true,

      //----------------errors
      eName: false,
      eLocation: false,
      eGroundSize: false,

      // ------------------icons
      iName: "",
      iLocation: "",
      iGroundSize: "",

      Loaded: true
    };
  }

  updateFarm = () => {
    const {
      sLocation,
      sName,
      sGroundSize,
      name,
      location,
      groundSize
    } = this.state;

    if (sLocation && sName && sGroundSize) {
      this.setState({
        Loaded: false
      });
      fs.collection("farms")
        .doc(this.props.navigation.state.params.id)
        .update({
          name,
          location,
          groundSize: parseFloat(groundSize)
        })
        .then(() => {
          this.setState({
            Loaded: false
          });
          this.props.navigation.navigate("Farms");
        });
    } else {
      Alert.alert("Actualizar Finca", "Los campos son incorrectos", [
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
          sName: true,
          eName: false,
          name: text,
          iName: "checkmark-circle"
        });
      } else {
        this.setState({
          sName: false,
          eName: true,
          name: text,
          iName: "close-circle"
        });
      }
    } else if (type === "location") {
      if (regexLocation.test(text)) {
        this.setState({
          sLocation: true,
          eLocation: false,
          location: text,
          iLocation: "checkmark-circle"
        });
      } else {
        this.setState({
          sLocation: false,
          eLocation: true,
          location: text,
          iLocation: "close-circle"
        });
      }
    } else if (type === "groundSize") {
      if (regexGroundSize.test(text)) {
        this.setState({
          sGroundSize: true,
          eGroundSize: false,
          groundSize: text,
          iGroundSize: "checkmark-circle"
        });
      } else {
        this.setState({
          sGroundSize: false,
          eGroundSize: true,
          groundSize: text,
          iGroundSize: "close-circle"
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
                    <Icon type="MaterialIcons" name="priority-high" />
                    <Label>ID</Label>
                    <Input
                      maxLength={3}
                      keyboardType="number-pad"
                      disabled="true"
                      value={this.state.id}
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
                    error={this.state.eName}
                    success={this.state.sName}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre Finca</Label>
                    <Input
                      value={this.state.name}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
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
                    error={this.state.eLocation}
                    success={this.state.sLocation}
                  >
                    <Icon type="MaterialIcons" name="add-location" />
                    <Label>Ubicación</Label>
                    <Input
                      value={this.state.location}
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
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    error={this.state.eGroundSize}
                    success={this.state.sGroundSize}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Área de terreno</Label>
                    <Input
                      value={this.state.groundSize.toString()}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="numeric"
                      onChangeText={groundSize =>
                        this.validate(groundSize, "groundSize")
                      }
                    />
                    <Icon name={this.state.iGroundSize} />
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
                    onPress={this.updateFarm}
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
  }
});
