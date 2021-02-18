import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView } from "react-native";
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

export default class UpdateToolsAdmin extends Component {
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
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
      tool: this.props.navigation.state.params.item,
      id: this.props.navigation.state.params.item.data().id,
      name: this.props.navigation.state.params.item.data().name,
      brand: this.props.navigation.state.params.item.data().brand,
      price: this.props.navigation.state.params.item.data().price,
      stock: this.props.navigation.state.params.item.data().stock,

      //errors
      eId: false,
      eName: false,
      eBrand: false,
      ePrice: false,
      eStock: false,

      //icons
      iId: "",
      iName: "",
      iBrand: "",
      iPrice: "",
      iStock: "",

      //success
      sId: true,
      sName: true,
      sBrand: true,
      sPrice: true,
      sStock: true,
      Loaded: true
    };
  }

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const { id, name, brand, price, stock } = this.state;
    const regexId = /\d{13}/;
    const regexName = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexBrand = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexPrice = /\d{1,5}/;
    const regexStock = /\d{1,5}/;

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
  update = () => {
    const {
      sId,
      sName,
      sBrand,
      sPrice,
      sStock,
      id,
      name,
      brand,
      price,
      stock,
      item,
      index,
 
    } = this.state;

    if (sName && sBrand && sBrand && sPrice) {
      fs.collection("admin_tools")
        .doc(item.id)
        .update({
          id,
          name,
          brand,
          price: parseFloat(price),
          stock: parseFloat(stock),

        })
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("ToolsHome");
        });
    } else {
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
                    error={this.state.eBrand}
                    success={this.state.sBrand}
                  >
                    <Icon type="MaterialIcons" name="business-center" />
                    <Label>Marca</Label>
                    <Input
                      value={this.state.brand}
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
                      value={this.state.price.toString()}
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
                      value={this.state.stock.toString()}
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
                    onPress={() => this.update()}
                  >
                    <Text style={{ color: "white" }} onPress={this.save}>
                      ACTUALIZAR
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