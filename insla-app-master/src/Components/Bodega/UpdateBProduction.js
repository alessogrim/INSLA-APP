import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import {
  Text,
  Form,
  Content,
  Textarea,
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
  Row,
  Container
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class UpdateBProduction extends Component {
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
      production: this.props.navigation.state.params.item,
      farmName: this.props.navigation.state.params.item.data().farmName,
      averageWeight: this.props.navigation.state.params.item.data()
        .averageWeight,
      name: this.props.navigation.state.params.item.data().name,
      totalChickens: this.props.navigation.state.params.item.data()
        .totalChickens,
      id: this.props.navigation.state.params.item.data().id,
      Loaded: true,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,

      //errors inputs
      eAverageWeight: false,

      //succes inputs
      sAverageWeight: true,

      //icon inputs
      iAverageWeight: "checkmark-circle",

      Loaded: true,
      saveState: false,
      preloader: false
    };
  }
  validate = (text, type) => {
    const regexAverageWeight = /\d{1,8}/;

    if (type === "averageWeight") {
      if (regexAverageWeight.test(text)) {
        this.setState({
          averageWeight: text,
          eAverageWeight: false,
          sAverageWeight: true,
          iAverageWeight: "checkmark-circle"
        });
      } else {
        this.setState({
          averageWeight: text,
          eAverageWeight: true,
          sAverageWeight: false,
          iAverageWeight: "close-circle"
        });
      }
    }
  };

  saveWorker = () => {
    const { production, sAverageWeight, averageWeight, index } = this.state;
    if (sAverageWeight) {
      this.setState({
        preloader: true,
        saveState: true
      });
      fs.collection("Cellar")
        .doc(production.id)
        .update({
          averageWeight: parseFloat(averageWeight)
        })
        .then(() => {
          this.props.navigation.state.params.update(production.id, index);
          this.props.navigation.navigate("Bodega");
        });
    } else {
      Alert.alert("", "Rellene todos los campos", [], {
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
                onPress={() =>
                  this.props.navigation.navigate("Bodega", this.state.farm)
                }
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 17 }}>PRODUCCION</Title>
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
                    style={{ width: "90%", height: 60 }}
                    error={this.state.eIdentidad}
                    success={this.state.sIdentidad}
                  >
                    <Icon type="MaterialIcons" name="accessibility" />
                    <Label>ID</Label>
                    <Input
                      disabled
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.id}
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
                    error={this.state.eAge}
                    success={this.state.sAge}
                  >
                    <Icon type="MaterialIcons" name="accessibility" />
                    <Label>Cantidad de Pollos</Label>
                    <Input
                      disabled
                      maxLength={2}
                      keyboardType="number-pad"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.totalChickens.toString()}
                    />
                    <Icon name={this.state.iAge} />
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
                    error={this.state.eAverageWeight}
                    success={this.state.sAverageWeight}
                  >
                    <Icon type="MaterialIcons" name="attach-money" />
                    <Label>Peso promedio (libras)</Label>
                    <Input
                      maxLength={10}
                      keyboardType="numeric"
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      value={this.state.averageWeight.toString()}
                      onChangeText={averageWeight =>
                        this.validate(averageWeight, "averageWeight")
                      }
                    />
                    <Icon name={this.state.iAverageWeight} />
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
                    disabled={this.saveState}
                    onPress={this.saveWorker}
                  >
                    <Text style={{ color: "white" }}>ACTUALIZAR</Text>
                  </Button>
                </View>
              </Form>
            </KeyboardAwareScrollView>
          </ScrollView>
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
        </Container>
      );
    }
  }
}

const style = StyleSheet.create({
  titleStyle: {
    color: "#fff"
  },
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
  },
  headerStyle: {
    borderBottomColor: "#fff",
    backgroundColor: "#077A65",
    height: 80
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  },

  buttonStyle: {
    backgroundColor: "#077A65",
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    width: "70%"
  },
  labelStyle: {
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10
  },
  itemStyle: {
    height: 50,
    //marginLeft: 10,
    //marginRight: 10,
    top: -10,
    borderWidth: 1,
    borderColor: "#077A65",
    //backgroundColor: "#7fff00",
    width: "25%"
  },
  errorValitation: {
    borderColor: "red"
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
