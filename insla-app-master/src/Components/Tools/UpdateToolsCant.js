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
export default class ToolsCantidad extends Component {
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
      tool:this.props.navigation.state.params.tool,
      id: this.props.navigation.state.params.tool.data().id,
      name: this.props.navigation.state.params.tool.data().name,
      brand: this.props.navigation.state.params.tool.data().brand,
      stockAdmin: this.props.navigation.state.params.tool.data().stockHelp,
      stock: this.props.navigation.state.params.tool.data().stock,
      taken: false,
      Loaded: true,
      full: 0, //area ocupada por los corrales ya asignados
      preloader: false,
      save: false,

      //errors

      eName: false,
      eBrand: false,
      eStock: false,
      //success

      sName: false,
      sBrand: false,
      sStock: false,
      //icons

      iName: false,
      iBrand: false,
      iStock: false
    };
  }
  save = () => {
    const {
      id,
      name,
      brand,
      stock,
      sId,
      sName,
      sBrand,
      sStock,
      tool,
      index
    } = this.state;
    if ((sName && sBrand, sStock)) {
        if(this.state.stockAdmin>=this.state.stock){
            this.setState({
                preloader: true,
                save: true,
              });
              let temp = this.state.stockAdmin - this.state.stock
              let stockHelp = this.state.stockAdmin
              fs.collection("admin_tools")
                .doc(this.state.tool.data().document)
                .update({
                    stock:temp,
                    status:true
                });
              fs.collection("tools")
              .doc(this.state.tool.id)
              .update({
                stock: parseFloat(this.state.stock),
              })
                .then(()=> {
                  this.props.navigation.state.params.update(tool.id,index);
                  this.props.navigation.navigate("tools");
                });
        }else{
            Alert.alert(
                "Guardar Herramienta",
                "La existencia de garaje es solamente de "+this.state.stockAdmin,
                [
                  {
                    text: "Aceptar"
                  }
                ]
              );    
        }
    }
  };

  // :::::::::::::::::::::: VALIDATIONS::::::::::::::::::::::
  validate = (text, type) => {
    const regexName = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexStock = /\d{1,5}/;

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
    } else if (type === "stock") {
      if (regexStock.test(text)) {
        this.setState({
          sStock: true,
          eStock: false,
          stock: text,
          iStock: "checkmark-circle"
        });
      } else {
        this.setState({
          sStock: false,
          eStock: true,
          stock: text,
          iStock: "close-circle"
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
                onPress={() => this.props.navigation.navigate("tools",{farm:this.state.farm})}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>EDITAR</Title>
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
                      Cantidad en Existencia
                    </Label>
                    <Input
                      disabled="true"
                      value={(
                        this.state.stockAdmin-this.state.stock
                      )
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
                      disabled={true}
                      maxLength={5}
                      keyboardType="number-pad"
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
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre Corral</Label>
                    <Input
                      value={this.state.name}
                      disabled={true}
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
                    <Icon type="MaterialIcons" name="line-style" />
                    <Label>Brand</Label>
                    <Input
                      value={this.state.brand}
                      disabled={true}
                      maxLength={5}
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
                    error={this.state.eStock}
                    success={this.state.sStock}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Nueva Existencia en Finca</Label>
                    <Input
                      value={this.state.stock.toString()}
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
                    onPress={this.save}
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
