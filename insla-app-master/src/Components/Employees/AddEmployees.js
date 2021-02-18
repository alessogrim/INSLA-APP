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
  Container,
  Textarea,
  Content,
  Row
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class AddEmployees extends Component {
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
      dbEmployees: [],
      id: 0,
      name: " ",
      lastName: " ",
      age: 0,
      location: "",
      status: false,

      //errors
      eName: false,
      eLastName: false,
      eAge: false,
      eId: false,

      //icons
      iName: "",
      iLastName: "",
      iAge: "",
      iId: "",

      //success
      sName: false,
      sLastName: false,
      sAge: false,
      sId: false,

      farm: this.props.navigation.state.params.farm,
      Loaded: true,
      preloader: false,
      save: false

      //bandera para llevar el control del loader
    };
  }

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexName = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexLastName = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexAge = /\d{1,2}/;
    const regexId = /\d{13}/;

    if (type === "id") {
      if (regexId.test(data)) {
        this.setState({
          id: data,
          sId: true,
          eId: false,
          iId: "checkmark-circle"
        });
      } else {
        this.setState({
          id: data,
          sId: false,
          eId: true,
          iId: "close-circle"
        });
      }
    } else if (type === "name") {
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
    } else if (type === "lastName") {
      if (regexLastName.test(data)) {
        this.setState({
          sLastName: true,
          eLastName: false,
          lastName: data,
          iLastName: "checkmark-circle"
        });
      } else {
        this.setState({
          sLastName: false,
          lastName: data,
          eLastName: true,
          iLastName: "close-circle"
        });
      }
    } else if (type === "age") {
      if (regexAge.test(data)) {
        this.setState({
          age: data,
          sAge: true,
          eAge: false,
          iAge: "checkmark-circle"
        });
      } else {
        this.setState({
          age: data,
          sAge: false,
          eAge: true,
          iAge: "close-circle"
        });
      }
    }
  };

  ////////END VALIDATION

  save = async () => {
    const {
      sName,
      sLastName,
      sAge,
      id,
      name,
      farm,
      lastName,
      age,
      location,
      status
    } = this.state;
    if (sName && sLastName && sAge && location != "") {
      this.setState({
        preloader: true,
        save: true
      });
      const query = await fs
        .collection("employees")
        .where("id", "==", this.state.id)
        .where("idFarm", "==", this.state.farm.id)
        .get();
      if (query.size > 0) {
        Alert.alert(
          "Guardar Empleado",
          "Ya existe un usuario registrado con el numero de identidad",
          [
            {
              text: "Aceptar",
              onPress: () => {
                this.setState({
                  preloader: false,
                  save: false
                });
              }
            }
          ]
        );
      } else {
        fs.collection("employees")
          .add({
            idFarm: farm.id,
            id,
            name,
            lastName,
            age: parseFloat(age),
            location,
            status
          })
          .then(employee => {
            this.props.navigation.state.params.save(employee.id);
            this.props.navigation.navigate("employees");
          })
          .catch(err => {
            console.log(err);
          });
      }
    } else {
      Alert.alert("Guardar Empleado", "Revise que los datos esten correctos!", [
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
                onPress={() => this.props.navigation.navigate("employees")}
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
                  <Item
                    floatingLabel
                    success={this.state.sId}
                    error={this.state.eId}
                    style={{ width: "90%", height: 60 }}
                  >
                    <Icon type="MaterialIcons" name="priority-high" />
                    <Label>ID</Label>
                    <Input
                      maxLength={13}
                      keyboardType="number-pad"
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
                      onChangeText={id => {
                        this.validate(id, "id");
                      }}
                    />
                    <Icon name={this.state.iId} />
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
                    success={this.state.sName}
                    error={this.state.eName}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre</Label>
                    <Input
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
                    error={this.state.eLastName}
                    success={this.state.sLastName}
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
                    error={this.state.eAge}
                    success={this.state.sAge}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Edad</Label>
                    <Input
                      maxLength={2}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="numeric"
                      onChangeText={age => this.validate(age, "age")}
                    />
                    <Icon name={this.state.iAge} />
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
                  <Row>
                    <Content padder style={{ width: "100%" }}>
                      <Form>
                        <Label>Dirección</Label>
                        <Textarea
                          rowSpan={3}
                          bordered
                          onChangeText={location =>
                            this.setState({
                              location
                            })
                          }
                        />
                      </Form>
                    </Content>
                  </Row>
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
                    onPress={() => {
                      this.save();
                    }}
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
