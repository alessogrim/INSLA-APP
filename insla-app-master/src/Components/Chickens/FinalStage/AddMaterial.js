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
  Container
} from "native-base";
import { firebase, fs } from "../../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class AddMaterial extends Component {
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
    const material = this.props.navigation.state.params.material;

    this.state = {
      id: material.data().id,
      name: material.data().name,
      quantity: material.data().quantity,
      description: material.data().description,
      stock: material.data().stock,
      brand: material.data().brand,
      material: material,
      production: this.props.navigation.state.params.production,

      actualQuantity: 0,

      Loaded: true,
      preloader: false,
      save: false,

      //sucess
      sQuantity: false,
      eQuantity: false,
      iQuantity: ""
    };
  }

  save = async () => {
    const {
      material,
      production,
      actualQuantity,
      sQuantity,
      stock,
      id,
      name
    } = this.state;
    if (sQuantity) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("materials")
        .doc(material.id)
        .update({
          stock: parseInt(stock) - parseInt(actualQuantity)
        })
        .then(() => {
          fs.collection("chicken_material_finalStage_chicken_breeding")
            .add({
              id,
              name,
              idMaterial: material.id,
              idProduction: production.id,
              useMaterial: parseFloat(actualQuantity)
            })
            .then(doc => {
              this.props.navigation.state.params.save(doc.id);
              this.props.navigation.navigate("finalStage");
            });
        });
    } else {
      Alert.alert("Guardar Material", "Revise que los datos esten correctos!", [
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

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexQuantity = /^[1-9]\d*$/;

    if (type === "actualQuantity") {
      if (regexQuantity.test(data) && data <= this.state.stock) {
        this.setState({
          actualQuantity: data,
          sQuantity: true,
          eQuantity: false,
          iQuantity: "checkmark-circle"
        });
      } else {
        this.setState({
          actualQuantity: data,
          sQuantity: false,
          eQuantity: true,
          iQuantity: "close-circle"
        });
      }
    }
  };

  ////////END VALIDATION

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
                  width: 50
                }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 18 }}>MATERIALES</Title>
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
                      disabled={true}
                      value={this.state.id}
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre</Label>
                    <Input
                      disabled={true}
                      value={this.state.name}
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="people" />
                    <Label>Marca</Label>
                    <Input
                      disabled={true}
                      value={this.state.brand}
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Descripción</Label>
                    <Input
                      disabled={true}
                      value={this.state.description}
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="location-on" />
                    <Label>Existencia (elementos)</Label>
                    <Input
                      value={this.state.stock.toString()}
                      disabled={true}
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
                    success={this.state.sQuantity}
                    error={this.state.eQuantity}
                  >
                    <Icon type="MaterialIcons" name="location-on" />
                    <Label>¿Cuanto desea utilizar?</Label>
                    <Input
                      onChangeText={actualQuantity =>
                        this.validate(actualQuantity, "actualQuantity")
                      }
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="number-pad"
                    />
                    <Icon name={this.state.iQuantity} />
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
