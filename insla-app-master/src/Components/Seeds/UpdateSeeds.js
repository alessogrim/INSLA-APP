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

export default class UpdateSeeds extends Component {
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
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
      id: this.props.navigation.state.params.item.data().id,
      kind: this.props.navigation.state.params.item.data().kind,
      description: this.props.navigation.state.params.item.data().description,
      quantity: this.props.navigation.state.params.item.data().quantity,
      stock: this.props.navigation.state.params.item.data().stock,
      taken: false,
      Loaded: true,
      preloader: false,

      //errors

      eStock: false,

      //success
      sStock: true,

      //Icons
      iStock: ""
    };
  }
  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexStock = /^[0-9]+([.])?([0-9]+)?$/;
    if (type === "stock") {
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
    const { item, index, stock, sStock } = this.state;
    if (sStock) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("seedsupplies")
        .doc(item.id)
        .update({
          stock: parseInt(stock)
        })
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("seeds");
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
                onPress={() => this.props.navigation.navigate("seeds")}
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
                      value={this.state.id}
                      maxLength={4}
                      disabled={true}
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
                    success={this.state.sKind}
                    error={this.state.eKind}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Tipo Planta</Label>
                    <Input
                      value={this.state.kind}
                      disabled={true}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                    />
                    <Icon name={this.state.iKind} />
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
                    success={this.state.sQuantity}
                    error={this.state.eQuantity}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Cantidad (por empaque)</Label>
                    <Input
                      disabled={true}
                      maxLength={3}
                      value={this.state.quantity.toString()}
                      keyboardType="decimal-pad"
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
                    success={this.state.sStock}
                    error={this.state.eStock}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Cantidad en existencia (libras)</Label>
                    <Input
                      maxLength={3}
                      keyboardType="decimal-pad"
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
                    <Text style={{ color: "white" }} onPress={this.save}>
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
