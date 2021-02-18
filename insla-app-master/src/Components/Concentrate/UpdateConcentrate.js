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
  Container
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class UpdateMaterials extends Component {
  static navigationOptions = () => {
    let headerLeft = null;
    let gestureEnablae = false;
    let header = null;
    return {
      header,
      headerLeft,
      gestureEnablae
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      farm: this.props.navigation.state.params.farm,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
      stock: this.props.navigation.state.params.item.data().stock,
      materials: this.props.navigation.state.params.item,
      id: this.props.navigation.state.params.item.data().id,
      name: this.props.navigation.state.params.item.data().name,
      quantity: this.props.navigation.state.params.item.data().quantity,
      description: this.props.navigation.state.params.item.data().description,
      Loaded: true,
      save: false,
      preloader: false,

      iStock: "",
      sStock: false,
      eStock: false
    };
  }

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexStock = /^[0-9]+([.])?([0-9]+)?$/;
    if (type === "stock") {
      if (regexStock.test(data)) {
        this.setState({
          stock: data,
          iStock: "checkmark-circle",
          sStock: true,
          eStock: false
        });
      } else {
        this.setState({
          stock: data,
          iStock: "close-circle",
          sStock: false,
          eStock: true
        });
      }
    }
  };
  ////////END VALIDATION

  update = () => {
    const { item, index, sStock, stock } = this.state;
    if (sStock) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("concentrate")
        .doc(item.id)
        .update({
          stock: parseInt(stock)
        })
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("concentrate");
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
                style={{ fontSize: 40, color: "#fff", padding: 5 }}
                onPress={() => this.props.navigation.navigate("concentrate")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>ACTUALIZAR</Title>
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
                      disabled={true}
                      maxLength={4}
                      keyboardType="number-pad"
                      value={this.state.id}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
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
                      disabled={true}
                      value={this.state.name}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
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
                    success={this.state.sQuantity}
                    error={this.state.eQuantity}
                  >
                    <Icon type="MaterialIcons" name="event-available" />
                    <Label>Cantidad (por empaque)</Label>
                    <Input
                      disabled={true}
                      keyboardType="decimal-pad"
                      value={this.state.quantity.toString()}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
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
                    success={this.state.sDescription}
                    error={this.state.eDescription}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Descripcion</Label>
                    <Input
                      disabled={true}
                      value={this.state.description}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                    />
                    <Icon name={this.state.iDescription} />
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
                    success={this.state.sStock}
                    error={this.state.eStock}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Cantidad en existencia (libras)</Label>
                    <Input
                      keyboardType="number-pad"
                      value={this.state.stock.toString()}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
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
                    disabled={this.state.save}
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
