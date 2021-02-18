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
  Container,
  Row,
  Content,
  Textarea
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class UpdateEmployee extends Component {
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
      farm: this.props.navigation.state.params.farm,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
      employee: this.props.navigation.state.params.item,
      id: this.props.navigation.state.params.item.data().id,
      name: this.props.navigation.state.params.item.data().name,
      lastName: this.props.navigation.state.params.item.data().lastName,
      age: this.props.navigation.state.params.item.data().age,
      location: this.props.navigation.state.params.item.data().location,

      //errors
      eId: false,
      eName: false,
      eLastName: false,
      eAge: false,

      //icons
      iId: "",
      iName: "",
      iLastName: "",
      iAge: "",

      //success
      sId: true,
      sName: true,
      sLastName: true,
      sAge: true,
      Loaded: true,
      preloader: false
    };
  }

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const { id, name, lastName, location, age } = this.state;
    const regexId = /\d{13}/;
    const regexName = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexLastName = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexAge = /\d{2}/;

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
          sId: false,
          id: data,
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
  update = () => {
    const {
      sId,
      sName,
      sLastName,
      id,
      name,
      lastName,
      age,
      location,
      item,
      index,
      sAge
    } = this.state;

    if (sId && sName && sLastName && location != "" && sAge) {
      this.setState({
        preloader: true
      });
      fs.collection("employees")
        .doc(item.id)
        .update({
          id,
          name,
          lastName,
          age: parseFloat(age),
          location
        })
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("employees");
        });
    } else {
      Alert.alert(
        "Actualizar Empleado",
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
                onPress={() => this.props.navigation.navigate("employees")}
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
                  <Item
                    floatingLabel
                    success={this.state.sId}
                    error={this.state.eId}
                    style={{ width: "90%", height: 60 }}
                  >
                    <Icon type="MaterialIcons" name="priority-high" />
                    <Label>ID</Label>
                    <Input
                      value={this.state.id}
                      maxLength={13}
                      keyboardType="number-pad"
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
                      onChangeText={id => this.validate(id, "id")}
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
                    error={this.state.eLastName}
                    success={this.state.sLastName}
                  >
                    <Icon type="MaterialIcons" name="people" />
                    <Label>Apellido</Label>
                    <Input
                      value={this.state.lastName}
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
                      value={this.state.age.toString()}
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
                        <Label>Dirección residencia</Label>
                        <Textarea
                          rowSpan={3}
                          bordered
                          value={this.state.location}
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
                    onPress={() => this.update()}
                  >
                    <Text style={{ color: "white", fontWeight: "500" }}>
                      ACTUALIZAR
                    </Text>
                  </Button>
                </View>
              </Form>
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
