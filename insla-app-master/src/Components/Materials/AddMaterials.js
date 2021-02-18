import React, { Component } from "react";
import {
  Container,
  Body,
  Header,
  Icon,
  Text,
  Button,
  Left,
  Title,
  Input,
  Form,
  Item,
  Label,
  Right,
  Spinner
} from "native-base";
import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class AddMaterials extends Component {
  //navigation option
  static navigationOptions = () => {
    let headerLeft = null;
    let gesturesEnable = false;
    let header = null;
    return {
      headerLeft,
      header,
      gesturesEnable
    };
  };

  //constructor
  constructor(props) {
    super(props);
    this.state = {
      farm: this.props.navigation.state.params.farm,
      id: this.props.navigation.state.params.id,
      name: "",
      brand: "",
      description: "",
      taken: false,
      Loaded: true,

      //errors
      eId: false,
      eName: false,
      eBrand: false,
      eDescription: false,

      //success
      sId: false,
      sName: false,
      sBrand: false,
      sDescription: false,

      //Icons
      iId: "",
      iName: "",
      iBrand: "",
      iDescription: ""
    };
  }

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexId = /\d{4}/;
    const regexName = /^[a-z ,.-]+$/i;
    const regexBrand = /^[a-z ,.-]+$/i;
    const regexDescription = /^[a-z ,.-]+$/i;

    if (type === "id") {
      if (regexId.test(data)) {
        this.setState({
          id: data,
          sId: true,
          eId: false,
          iId: "checkmarck-circle"
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
    } else if (type === "brand") {
      if (regexBrand.test(data)) {
        this.setState({
          brand: data,
          sBrand: true,
          eBrand: false,
          iBrand: "checkmark-circle"
        });
      } else {
        this.setState({
          sBrand: false,
          eBrand: true,
          brand: data,
          iBrand: "close-circle"
        });
      }
    } else if (type === "description") {
      if (regexDescription.test(data)) {
        this.setState({
          description: data,
          sDescription: true,
          eDescription: false,
          iDescription: "checkmark-circle"
        });
      } else {
        this.setState({
          description: data,
          sDescription: false,
          eDescription: true,
          iDescription: "close-circle"
        });
      }
    }
  };
  ////////END VALIDATION

  save = () => {
    const {
      farm,
      id,
      name,
      brand,
      description,
      sId,
      sName,
      sBrand,
      sDescription
    } = this.state;
    if (sName && sBrand && sDescription) {
      fs.collection("materials")
        .add({
          idFarm: farm.id,
          id,
          name,
          brand,
          description
        })
        .then(materials => {
          this.props.navigation.state.params.save(materials.id);
          this.props.navigation.navigate("materials");
        });
    } else {
      Alert.alert("", "LLene todos los campos", [], {
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
                onPress={() => this.props.navigation.navigate("materials")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>NUEVO</Title>
            </Body>
            <Right />
          </Header>
          <ScrollView style={{ flex: 1 }}>
            <KeyboardAwareScrollView
              resetScrollToCoords={{ x: 0, y: 0 }}
              keyboardOpeningTime={250}
              scrollEnabled={false}
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
                      maxLength={4}
                      disabled={true}
                      value={this.state.id.toString()}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      //onChangeText={id => this.validate(id, "id")}
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
                    success={this.state.sBrand}
                    error={this.state.eBrand}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Brand</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={brand => this.validate(brand, "brand")}
                    />
                    <Icon name={this.state.iBrand} />
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
                    success={this.state.sDescription}
                    error={this.state.eDescription}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Descripcion</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={description =>
                        this.validate(description, "description")
                      }
                    />
                    <Icon name={this.state.iDescription} />
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
                    <Text style={{ color: "white" }} onPress={this.save}>
                      Guardar
                    </Text>
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
