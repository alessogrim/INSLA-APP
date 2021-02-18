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
import { firebase, fs } from "../../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class AdminSemillasUpdate extends Component {
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
      semilla: this.props.navigation.state.params.semilla,
      id: this.props.navigation.state.params.semilla.data().id,
      type: this.props.navigation.state.params.semilla.data().type,
      quantity: this.props.navigation.state.params.semilla.data().quantity,
      description: this.props.navigation.state.params.semilla.data()
        .description,
      index: this.props.navigation.state.params.index,
      counterId: 0,
      preloader: false,
      save: false,
      Loaded: true,

      //errors
      eType: false,
      eQuantity: false,

      //icons
      iType: "checkmark-circle",
      iQuantity: "checkmark-circle",

      //success
      sType: true,
      sQuantity: true

      //bandera para llevar el control del loader
    };
  }

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexType = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    const regexQuantity = /\d+(\.\d{1,2})?/;

    if (type === "type") {
      if (regexType.test(data)) {
        this.setState({
          sType: true,
          eType: false,
          type: data,
          iType: "checkmark-circle"
        });
      } else {
        this.setState({
          sType: false,
          eType: true,
          type: data,
          iType: "close-circle"
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
    }
  };

  ////////END VALIDATION

  save = async () => {
    const { sType, type, description, quantity, sQuantity, id } = this.state;
    if (sType && sQuantity) {
      this.setState({
        preloader: true,
        save: true
      });

      fs.collection("admin_semillas")
        .add({
          id,
          type,
          quantity: parseInt(quantity),
          description
        })
        .then(doc => {
          this.props.navigation.state.params.save(doc.id);
          this.props.navigation.goBack();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      Alert.alert("Guardar Empleado", "Revise que los datos esten correctos!", [
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
      sType,
      type,
      description,
      quantity,
      sQuantity,
      id,
      semilla,
      index
    } = this.state;
    if (sType && sQuantity) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("admin_semillas")
        .doc(semilla.id)
        .update({
          id,
          type,
          description,
          quantity: parseFloat(quantity)
        })
        .then(() => {
          this.props.navigation.state.params.update(semilla.id, index);
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
              <Title style={{ color: "#fff" }}>NUEVO TIPO</Title>
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
                    success={this.state.sType}
                    error={this.state.eType}
                  >
                    <Icon type="MaterialIcons" name="equalizer" />
                    <Label>Tipo de semilla</Label>
                    <Input
                      value={this.state.type}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={type => this.validate(type, "type")}
                    />
                    <Icon name={this.state.iType} />
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
                    <Label>Cantidad semillas(por empaque)</Label>
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
                    flexDirection: "column",
                    width: "100%",
                    alignItems: "center",
                    marginTop: 20
                  }}
                >
                  <Text
                    style={{
                      width: "100%",
                      marginLeft: 20
                    }}
                  >
                    Descripción:
                  </Text>
                  <Row>
                    <Content padder style={{ width: "80%" }}>
                      <Form>
                        <Textarea
                          rowSpan={3}
                          bordered
                          value={this.state.description}
                          onChangeText={description =>
                            this.setState({
                              description
                            })
                          }
                        />
                      </Form>
                    </Content>
                  </Row>
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
