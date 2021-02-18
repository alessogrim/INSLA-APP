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
export default class UpdateCorral extends Component {
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
      farm: this.props.navigation.state.params.farm,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
      id: this.props.navigation.state.params.item.data().id,
      name: this.props.navigation.state.params.item.data().name,
      area: this.props.navigation.state.params.item.data().area,
      capacity: this.props.navigation.state.params.item.data().capacity,
      taken: this.props.navigation.state.params.item.data().taken,
      Loaded: false,
      preloader: false,
      full: 0, //area ocupada por los corrales ya asignados

      //errors
      eId: false,
      eName: false,
      eCapacity: false,
      eTaken: false,
      eArea: false,
      //success
      sId: true,
      sName: true,
      sCapacity: true,
      sArea: true,
      //icons
      iId: false,
      iName: false,
      iCapacity: false,
      iArea: false
    };
  }

  componentDidMount() {
    const { farm } = this.state;
    fs.collection("corrales")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          if (doc.id != this.state.item.id) {
            this.setState({
              full: this.state.full + doc.data().area
            });
          }
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  update = () => {
    const {
      id,
      name,
      capacity,
      area,
      sId,
      sName,
      sCapacity,
      sArea,
      taken,
      item,
      index
    } = this.state;
    if (sName && sId && sCapacity && sArea) {
      this.setState({
        preloader: true
      });
      fs.collection("corrales")
        .doc(item.id)
        .update({
          id,
          name,
          capacity: parseFloat(capacity),
          area: parseFloat(area),
          taken
        })
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("corrales");
        });
    }
  };

  // :::::::::::::::::::::: VALIDATIONS::::::::::::::::::::::
  validate = (text, type) => {
    const regexId = /\d{3}/;
    const regexName = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexCapacity = /\d{1,4}/;

    if (type === "id") {
      if (regexId.test(text)) {
        this.setState({
          sId: true,
          eId: false,
          id: text,
          iId: "checkmark-circle"
        });
      } else {
        this.setState({
          sId: false,
          eId: true,
          id: text,
          iId: "close-circle"
        });
      }
    } else if (type === "name") {
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
    } else if (type === "capacity") {
      if (regexCapacity.test(text)) {
        this.setState({
          sCapacity: true,
          eCapacity: false,
          capacity: text,
          iCapacity: "checkmark-circle"
        });
      } else {
        this.setState({
          sCapacity: false,
          eCapacity: true,
          capacity: text,
          iCapacity: "close-circle"
        });
      }
    } else if (type === "area") {
      if (
        this.state.full + parseFloat(text) <=
        this.state.farm.data().groundSize
      ) {
        this.setState({
          sArea: true,
          eArea: false,
          area: text,
          iArea: "checkmark-circle"
        });
      } else {
        this.setState({
          sArea: false,
          eArea: true,
          area: text,
          iArea: "close-circle"
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
                onPress={() => this.props.navigation.navigate("corrales")}
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
                      Área disponible (m2)
                    </Label>
                    <Input
                      disabled="true"
                      value={(
                        this.state.farm.data().groundSize - this.state.full
                      )
                        .toFixed(2)
                        .toString()}
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
                      maxLength={3}
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
                    <Label>Nombre Corral</Label>
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
                    error={this.state.eCapacity}
                    success={this.state.sCapacity}
                  >
                    <Icon type="MaterialIcons" name="line-style" />
                    <Label>Capacidad</Label>
                    <Input
                      value={this.state.capacity.toString()}
                      keyboardType="number-pad"
                      maxLength={4}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={capacity =>
                        this.validate(capacity, "capacity")
                      }
                    />
                    <Icon name={this.state.iCapacity} />
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
                    error={this.state.eArea}
                    success={this.state.sArea}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Área</Label>
                    <Input
                      value={this.state.area.toString()}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="numeric"
                      onChangeText={area => this.validate(area, "area")}
                    />
                    <Icon name={this.state.iArea} />
                  </Item>
                </View>
                <View
                  style={{
                    marginTop: "10%",
                    marginBottom: "10%",
                    width: "60%"
                  }}
                >
                  <Button style={style.addButton} full rounded success>
                    <Text style={{ color: "white" }} onPress={this.update}>
                      ACTUALIZAR
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
