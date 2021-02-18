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

export default class AddSeeds extends Component {
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
      seed: this.props.navigation.state.params.seed,
      farm: this.props.navigation.state.params.farm,
      id: this.props.navigation.state.params.seed.data().id,
      counterId: 0,
      stock: "",
      type: this.props.navigation.state.params.seed.data().type,
      description: this.props.navigation.state.params.seed.data().description,
      quantity: this.props.navigation.state.params.seed.data().quantity,
      taken: false,
      Loaded: true,
      preloader: false,
      //success
      sStock: false,

      //errors
      eStock: false,
      //icons
      iStock: ""
    };
  }

  componentDidMount() {
    fs.collection("seedsupplies")
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
          id: "SEM-" + this.state.counterId,
          Loaded: true
        });
      });
  }

  validate = (data, type) => {
    const regexStock = /^[0-9]+([.])?([0-9]+)?$/;
    if (type === "stock") {
      if (regexStock.test(data)) {
        this.setState({
          sStock: true,
          eStock: false,
          stock: data,
          iStock: "checkmark-circle"
        });
      } else {
        this.setState({
          sStock: false,
          eStock: true,
          stock: data,
          iStock: "close-circle"
        });
      }
    }
  };

  save = () => {
    const {
      farm,
      id,
      type,

      description,
      quantity,
      stock,
      sStock
    } = this.state;
    if (sStock) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("seedsupplies")
        .add({
          idFarm: farm.id,
          id: id,
          kind: type,
          description: description,
          stock: parseFloat(stock),
          quantity: parseFloat(quantity)
        })
        .then(seeds => {
          this.props.navigation.state.params.save(seeds.id);
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="priority-high" />
                    <Label>ID</Label>
                    <Input
                      value={this.state.id}
                      maxLength={4}
                      disabled={true}
                      keyboardType="number-pad"
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
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Tipo Planta</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.type}
                      disabled={true}
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
                    <Label>Descripcion</Label>
                    <Input
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.description}
                      disabled={true}
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
                    <Label>Cantidad (por paquete)</Label>
                    <Input
                      keyboardType="decimal-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.quantity.toString()}
                      disabled={true}
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
                    success={this.state.sStock}
                    error={this.state.eStock}
                  >
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Cantidad en existencia(paquetes) </Label>
                    <Input
                      keyboardType="decimal-pad"
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
                    onPress={this.save}
                  >
                    <Text style={{ color: "white", fontWeight: "500" }}>
                      GUARDAR
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
