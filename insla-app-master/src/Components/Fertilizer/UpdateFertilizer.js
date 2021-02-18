import React, { Component } from "react";
import { View, StyleSheet, ScrollView,Alert } from "react-native";
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

export default class UpdateFertilizer extends Component {
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
      fertilizer: this.props.navigation.state.params.item,
      id: this.props.navigation.state.params.item.data().id,
      name: this.props.navigation.state.params.item.data().name,
      brand: this.props.navigation.state.params.item.data().brand,
      quantity: this.props.navigation.state.params.item.data().quantity,
      taken: false,
      Loaded: true,

      //errors
      eId: false,
      eName: false,
      eBrand: false,
      eQuantity: false,

      //success
      sId: true,
      sName: true,
      sBrand: true,
      sQuantity: true,

      //Icons
      iId: "",
      iName: "",
      iBrand: "",
      iQuantity: ""
    };
  }

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexId = /\d{4}/;
    const regexName = /^[a-z ,.-]+$/i;
    const regexBrand = /^[a-z ,.-]+$/i;
    const regexQuantity = /\d{3}/;

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
    } else if (type === "quantity") {
      if (regexQuantity.test(data)) {
        this.setState({
          quantity: data,
          sQuantity: true,
          eQuantity: false,
          iQuantity: "checkmark-circle"
        });
      } else {
        this.setState({
          quantity: data,
          sQuantity: false,
          eQuantity: true,
          iQuantity: "close-circle"
        });
      }
    }
  };
  ////////END VALIDATION

  update = () => {
    const {
      sId,
      id,
      sName,
      name,
      sBrand,
      brand,
      sQuantity,
      quantity,
      item,
      index
    } = this.state;
    if (sId && sName && sBrand && sQuantity) {
      fs.collection("fertilizer")
        .doc(item.id)
        .update({
          id,
          name,
          brand,
          quantity
        })
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("fertilizer");
        });
    } else {
      Alert.alert("","Llene todos los campos",[],{
        cancelable:true
      })
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
                onPress={() => this.props.navigation.navigate("fertilizer")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>ACTUALZIAR</Title>
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
                      keyboardType="number-pad"
                      value={this.state.id}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
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
                    success={this.state.sBrand}
                    error={this.state.eBrand}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Brand</Label>
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
                    <Label>Cantidad</Label>
                    <Input
                      maxLength={4}
                      keyboardType="decimal-pad"
                      value={this.state.quantity.toString()}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={quantity =>
                        this.validate(quantity, "quantity")
                      }
                    />
                    <Icon name={this.state.iQuantity} />
                    <Icon
                      type="MaterialIcons"
                      name="info"
                      onPress={() => {
                        Alert.alert(
                          "Cantidad",
                          "Agregue la cantidad de fertilizante" +
                            " (El Fertilizante debe de ingresarse en Libras)"
                        );
                      }}
                    />
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
                      ACTUALZIAR
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
