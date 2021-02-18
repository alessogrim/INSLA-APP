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
export default class AddHerramientas extends Component {
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
      dbTools: [],
      id:"",
      name:"",
      brand:"",
      price: 0,
      stock: 0,
      status: false,
      counterId:0,

      //errors
      eName: false,
      eBrand: false,
      ePrice: false,
      eStock: false,
      eId: false,

      //icons
      iName: "",
      iBrand: "",
      iPrice: "",
      iStock: "",
      iId: "",

      //success
      sName: false,
      sBrand: false,
      sPrice: false,
      sStock: false,
      sId: false,

      Loaded: true,
      preloader: false,
      save: false

    };
  }
  componentDidMount() {
   
    fs.collection("admin_tools")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            let id = doc.data().id.substr(4);
            if (parseInt(id) > this.state.counterId) {
              this.setState({
                counterId: parseInt(id)
              });
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
          id: "HER-" + this.state.counterId,
          Loaded: true
        });
      });
  }
  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexName = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexBrand = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexPrice = /\d{1,5}/;
    const regexStock = /\d{1,5}/;
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
          brand: data,
          eBrand: true,
          iBrand: "close-circle"
        });
      }
    } else if (type === "price") {
      if (regexPrice.test(data)) {
        this.setState({
          price: data,
          sPrice: true,
          ePrice: false,
          iPrice: "checkmark-circle"
        });
      } else {
        this.setState({
          price: data,
          sPrice: false,
          ePrice: true,
          iPrice: "close-circle"
        });
      }
    } else if (type === "stock") {
      if (regexStock.test(data)) {
        this.setState({
          stock: data,
          sStock: true,
          eStock: false,
          iStock: "checkmark-circle"
        });
      } else {
        this.setState({
          stock: data,
          sStock: false,
          eStock: true,
          iStock: "close-circle"
        });
      }
    }
  };

  ////////END VALIDATION

  save = async () => {
    const {
      sName,
      sBrand,
      sPrice,
      sStock,
      id,
      name,
      brand,
      price,
      stock,
    } = this.state;
    if (sName && sBrand && sPrice && sStock) {
      this.setState({
        preloader: true,
        save: true
      });
      const query = await fs
        .collection("admin_tools")
        .where("id", "==", this.state.id)
        .get();
      if (query.size > 0) {
        Alert.alert(
          "Guardar Herramienta",
          "Esta herramienta ya existe",
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
        fs.collection("admin_tools")
          .add({
            id:this.state.id,
            name,
            brand,
            price: parseFloat(price),
            stock: parseFloat(stock),
            status: false,
            stockAux: parseFloat(stock)
          })
          .then(herramienta => {
            this.props.navigation.state.params.save(herramienta.id);
            this.props.navigation.navigate("ToolsHome");
          })
          .catch(err => {
            console.log(err);
          });
      }
    } else {
      Alert.alert("Guardar Herramienta", "Revise que los datos esten correctos!", [
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
                onPress={() => this.props.navigation.navigate("ToolsHome")}
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
                    <Label>ID Herramienta</Label>
                    <Input
                      value={this.state.id}
                      disabled={true}
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
                    error={this.state.eBrand}
                    success={this.state.sBrand}
                  >
                    <Icon type="MaterialIcons" name="business-center" />
                    <Label>Marca</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={brand =>
                        this.validate(brand, "brand")
                      }
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
                    error={this.state.ePrice}
                    success={this.state.sPrice}
                  >
                    <Icon type="MaterialIcons" name="monetization-on" />
                    <Label>Precio Unitario</Label>
                    <Input
                      maxLength={5}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="numeric"
                      onChangeText={price => this.validate(price, "price")}
                    />
                    <Icon name={this.state.iPrice} />
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
                    error={this.state.eStock}
                    success={this.state.sStock}
                  >
                    <Icon type="MaterialIcons" name="home" />
                    <Label>Existencia</Label>
                    <Input
                      maxLength={5}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="numeric"
                      onChangeText={stock => this.validate(stock, "stock")}
                    />
                    <Icon name={this.state.iStock} />
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
