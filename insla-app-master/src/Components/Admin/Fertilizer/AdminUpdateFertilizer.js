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
import { parse } from "react-native-svg";
export default class AdminUpdateFertilizer extends Component {
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
      abono: this.props.navigation.state.params.abono,
      id: this.props.navigation.state.params.abono.data().id,
      name: this.props.navigation.state.params.abono.data().name,
      quantity: this.props.navigation.state.params.abono.data().quantity,
      brand: this.props.navigation.state.params.abono.data().brand,
      index: this.props.navigation.state.params.index,
      counterId: 0,
      preloader: false,
      save: false,
      Loaded: true,
      //errors
      eName: false,
      eQuantity: false,
      eBrand: false,

      //icons
      iName: "checkmark-circle",
      iQuantity: "checkmark-circle",
      iBrand: "checkmark-circle",

      //success
      sName: true,
      sQuantity: true,
      sBrand: true
    };
  }
  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexName = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexBrand = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexQuantity = /\d+(\.\d{1,2})?/;

    if (type === "name") {
      if (regexName.test(data)) {
        this.setState({
          sName: true,
          eName: false,
          name: data,
          iName: "checkmark-circle"
        });
      } else {
        this.setState({
          sName: false,
          eName: true,
          name: data,
          iName: "close-circle"
        });
      }
    } else if (type === "quantity") {
      if (regexQuantity.test(data)) {
        this.setState({
          sQuantity: true,
          eQuantity: false,
          quantity: data,
          iQuantity: "checkmark-circle"
        });
      } else {
        this.setState({
          sQuantity: false,
          eQuantity: true,
          quantity: data,
          iQuantity: "close-circle"
        });
      }
    } else if (type === "brand") {
      if (regexBrand.test(data)) {
        this.setState({
          sBrand: true,
          eBrand: false,
          brand: data,
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
    }
  };
  ////////END VALIDATION
  save = async () => {
    const { sName, name, quantity, sQuantity, brand, sBrand, id } = this.state;
    if (sName && sBrand && sQuantity) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("admin_abonos")
        .add({
          id,
          name,
          quantity: parseInt(quantity),
          brand
        })
        .then(doc => {
          this.props.navigation.state.params.save(doc.id);
          this.props.navigation.goBack();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      Alert.alert("Guardar Abono", "Revise que los datos estan correctos!", [
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

  update = () => {
    const {
      sName,
      name,
      sQuantity,
      quantity,
      id,
      sBrand,
      brand,
      index,
      abono
    } = this.state;
    if (sName && sQuantity && sBrand) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("admin_abonos")
        .doc(abono.id)
        .update({
          id,
          name,
          brand,
          quantity: parseFloat(quantity)
        })
        .then(() => {
          this.props.navigation.state.params.update(abono.id, index);
          this.props.navigation.goBack();
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
              height: 80,
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
                    success={this.state.sName}
                    error={this.state.eName}
                  >
                    <Icon type="MaterialIcons" name="equalizer" />
                    <Label>Nombre del Abono</Label>
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
                    error={this.state.eQuantity}
                    success={this.state.sQuantity}
                  >
                    <Icon type="MaterialIcons" name="border-outer" />
                    <Label>Cantidad Abono(por Empaque)</Label>
                    <Input
                      value={this.state.quantity.toString()}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={quantity =>
                        this.validate(quantity, "quantity")
                      }
                      keyboardType="number-pad"
                    />
                    <Icon name={this.state.iQuantity} />
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
                    <Icon type="MaterialIcons" name="equalizer" />
                    <Label>Marca del Abono</Label>
                    <Input
                      value={this.state.brand}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={brand => this.validate(brand, "brand")}
                    />
                    <Icon name={this.state.iBrand} />
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
                    onPress={this.update}
                  >
                    <Text style={{ color: "white" }}>ACTUALIZAR</Text>
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
