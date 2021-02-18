import React, { Component } from "react";
import {
  Container,
  Form,
  Body,
  Header,
  Text,
  Button,
  Left,
  Title,
  Input,
  Item,
  Label,
  Right,
  Spinner,
  Icon
} from "native-base";

import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { fs, firebase } from "../Firebase/config";
import { Dropdown } from "react-native-material-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class UpdateEstimations extends Component {
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
      farmArea: this.props.navigation.state.params.farm.data().groundSize,
      id: this.props.navigation.state.params.estimation.data().id,
      estimation: this.props.navigation.state.params.estimation,
      farm: this.props.navigation.state.params.farm,
      especiesList: [],
      variedadList: [],
      cultivationList: [],
      selectedCultivation: this.props.navigation.state.params.estimation.data()
        .Tipo,
      selectedEspecie: this.props.navigation.state.params.estimation.data()
        .Especie,
      variedadSelected: this.props.navigation.state.params.estimation.data()
        .Variedad,
      cultivationArea: this.props.navigation.state.params.estimation.data()
        .Area,
      Medidas: "",
      Loaded: false,
      dbConst: [],

      //icons
      iCultivationArea: "",

      //success
      sCultivationArea: false,

      //errors
      eCultivationArea: false
    };
  }

  componentDidMount() {
    fs.collection("const")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            dbConst: [...this.state.dbConst, doc],
            cultivationList: [
              ...this.state.cultivationList,
              {
                value: doc.data().Tipo
              }
            ]
          });
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  getEspeciesValues = val => {
    this.setState({
      especiesList: [],
      selectedCultivation: val
    });
    this.state.dbConst.forEach(doc => {
      if (doc.data().Tipo === val) {
        this.setState({
          especiesList: [
            ...this.state.especiesList,
            {
              value: doc.data().Especie
            }
          ]
        });
      }
    });
  };

  getVariedadValues = val => {
    this.setState({
      variedadList: [],
      selectedEspecie: val
    });
    this.state.dbConst.forEach(doc => {
      if (doc.data().Especie === val) {
        this.setState({
          variedadList: [
            ...this.state.variedadList,
            {
              value: doc.data().Variedad
            }
          ]
        });
      }
    });
  };

  // :::::::::::::::::::::: VALIDATIONS::::::::::::::::::::::
  validate = (text, type) => {
    const regexCultivationArea = /\d{2,15}/;

    if (type == "cultivationArea") {
      if (
        regexCultivationArea.test(text) &&
        parseFloat(text) < this.state.farmArea
      ) {
        this.setState({
          cultivationArea: text,
          eCultivationArea: false,
          sCultivationArea: true,
          iCultivationArea: "checkmark-circle"
        });
      } else {
        this.setState({
          cultivationArea: text,
          eCultivationArea: true,
          sCultivationArea: false,
          iCultivationArea: "close-circle"
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
                onPress={() => this.props.navigation.navigate("Estimaciones")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 13 }}>
                ACTUALIZACION
              </Title>
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
                    <Icon type="MaterialIcons" name="crop" />
                    <Label>Área disponible</Label>
                    <Input
                      disabled={true}
                      maxLength={4}
                      textAlign="center"
                      keyboardType="number-pad"
                      value={this.state.farmArea + " m2"}
                      style={{
                        fontSize: 18,
                        color: "red",
                        alignSelf: "flex-start",
                        fontWeight: "600"
                      }}
                    />
                    <Icon />
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
                    <Icon type="MaterialIcons" name="priority-high" />
                    <Label>ID</Label>
                    <Input
                      value={this.state.id}
                      disabled={true}
                      maxLength={4}
                      keyboardType="number-pad"
                      style={{
                        fontSize: 18,
                        alignSelf: "flex-start"
                      }}
                    />
                    <Icon name={this.state.iconInputId} />
                  </Item>
                </View>

                <Dropdown
                  containerStyle={{ width: "90%" }}
                  label="¿Qué cultivo desea estimar?"
                  data={this.state.cultivationList}
                  dropdownMargins={{ min: 5, max: 20 }}
                  dropdownPosition={-1}
                  value={this.state.selectedCultivation}
                  onChangeText={value => {
                    this.getEspeciesValues(value);
                  }}
                />
                <Dropdown
                  label="Especie"
                  containerStyle={{ width: "90%" }}
                  dropdownMargins={{ min: 5, max: 20 }}
                  data={this.state.especiesList}
                  value={this.state.selectedEspecie}
                  onChangeText={value => {
                    this.getVariedadValues(value);
                  }}
                />
                <Dropdown
                  label="Variedad"
                  containerStyle={{ width: "90%" }}
                  value={this.state.variedadSelected}
                  dropdownMargins={{ min: 5, max: 20 }}
                  data={this.state.variedadList}
                  onChangeText={variedadSelected =>
                    this.setState({ variedadSelected })
                  }
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row"
                  }}
                >
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
                      success={this.state.sCultivationArea}
                      error={this.state.eCultivationArea}
                    >
                      <Icon type="MaterialIcons" name="aspect-ratio" />
                      <Label>Área cultivar</Label>
                      <Input
                        value={this.state.cultivationArea.toString()}
                        keyboardType="number-pad"
                        style={{
                          fontSize: 18,
                          alignSelf: "flex-start"
                        }}
                        onChangeText={cultivationArea =>
                          this.validate(cultivationArea, "cultivationArea")
                        }
                      />
                      <Icon name={this.state.iCultivationArea} />
                    </Item>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: "10%",
                    marginBottom: "10%",
                    width: "60%"
                  }}
                >
                  <Button style={style.addButton} full rounded success>
                    <Text style={{ color: "white" }}>ACTUALIZAR</Text>
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
  errorValidation: {
    borderColor: "red"
  }
});
