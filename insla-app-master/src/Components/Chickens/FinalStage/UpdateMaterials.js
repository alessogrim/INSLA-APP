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

export default class UpdateMaterialInitialStage extends Component {
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
    const material = this.props.navigation.state.params.material; // mateial que esta agregado engastos de mateirales

    this.state = {
      index: this.props.navigation.state.params.index,
      id: material.data().id,
      name: material.data().name,
      material: material,
      useMaterial: material.data().useMaterial,
      rootMaterial: {}, // material que esa ubicado en coleccion materials

      Loaded: false,
      preloader: false,
      save: false,

      //sucess
      sUseMaterial: true,
      //error
      eUseMaterial: false,
      //icon
      iUseMaterial: "checkmark-circle"
    };
  }
  componentDidMount() {
    fs.collection("materials")
      .doc(this.state.material.data().idMaterial)
      .get()
      .then(doc => {
        this.setState({
          rootMaterial: doc
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  update = () => {
    const { sUseMaterial, material, useMaterial, index } = this.state;

    if (sUseMaterial) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("chicken_material_finalStage_chicken_breeding")
        .doc(material.id)
        .update({
          useMaterial: parseInt(useMaterial)
        })
        .then(() => {
          if (this.state.material.data().useMaterial > this.state.useMaterial) {
            fs.collection("materials")
              .doc(this.state.rootMaterial.id)
              .update({
                stock:
                  parseInt(this.state.rootMaterial.data().stock) +
                  (parseInt(this.state.material.data().useMaterial) -
                    parseInt(this.state.useMaterial))
              });
          } else {
            fs.collection("materials")
              .doc(this.state.rootMaterial.id)
              .update({
                stock:
                  parseInt(this.state.rootMaterial.data().stock) -
                  (parseInt(this.state.useMaterial) -
                    parseInt(this.state.material.data().useMaterial))
              });
          }
        })
        .then(() => {
          this.props.navigation.state.params.update(material.id, index);
          this.props.navigation.navigate("finalStage");
        });
    } else {
    }
  };

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexUseMaterial = /^[1-9]\d*$/;

    if (type === "useMaterial") {
      if (
        regexUseMaterial.test(data) &&
        data <= this.state.rootMaterial.data().stock
      ) {
        this.setState({
          useMaterial: data,
          sUseMaterial: true,
          eUseMaterial: false,
          iUseMaterial: "checkmark-circle"
        });
      } else {
        this.setState({
          useMaterial: data,
          sUseMaterial: false,
          eUseMaterial: true,
          iUseMaterial: "close-circle"
        });
      }
    }
  };

  ////////END VALIDATION

  render() {
    const { Loaded, material } = this.state;

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
                  width: 50
                }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 18 }}>MATERIALES</Title>
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
                    <Icon type="MaterialIcons" name="priority-high" />
                    <Label>ID</Label>
                    <Input
                      disabled={true}
                      value={this.state.id}
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
                  <Item floatingLabel style={{ width: "90%", height: 60 }}>
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre</Label>
                    <Input
                      disabled={true}
                      value={this.state.name}
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
                    <Icon type="MaterialIcons" name="people" />
                    <Label>Marca</Label>
                    <Input
                      disabled={true}
                      value={this.state.rootMaterial.data().brand}
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
                    <Icon type="MaterialIcons" name="all-inclusive" />
                    <Label>Descripción</Label>
                    <Input
                      disabled={true}
                      value={this.state.rootMaterial.data().description}
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
                    <Icon type="MaterialIcons" name="location-on" />
                    <Label>Existencia en almacen(elementos)</Label>
                    <Input
                      value={this.state.rootMaterial.data().stock.toString()}
                      disabled={true}
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
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    success={this.state.sUseMaterial}
                    error={this.state.eUseMaterial}
                  >
                    <Icon type="MaterialIcons" name="location-on" />
                    <Label>¿Cuanto desea utilizar?</Label>
                    <Input
                      value={this.state.useMaterial.toString()}
                      onChangeText={useMaterial =>
                        this.validate(useMaterial, "useMaterial")
                      }
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      keyboardType="number-pad"
                    />
                    <Icon name={this.state.iUseMaterial} />
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
                    onPress={() => this.update()}
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
