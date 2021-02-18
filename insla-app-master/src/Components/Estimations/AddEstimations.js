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

export default class AddEstimations extends Component {
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
      aux: 1,
      id: this.props.navigation.state.params.id,
      taken: this.props.navigation.state.params.farm.data().groundSize,
      dbConst: [],
      cultivationList: [],
      especiesList: [],
      variedadList: [],
      selectedCultivation: "",
      selectedEspecie: "",
      variedadSelected: "",
      cultivationArea: 0,
      Medidas: "",
      Loaded: false,
      flagCultivo: false,
      flagEspecie: false,
      flagVariedad: false,
      farm: this.props.navigation.state.params.farm,
      preloader: false,
      save: false,
      //icons
      iCultivationArea: "",

      //success
      sCultivationArea: false,

      //errors
      eCultivationArea: false
    };
  }

  componentDidMount() {
    this.getId();
    this.getTakenArea();
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

  getId() {
    const { farm } = this.state;
    fs.collection("Estimations")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          const count = this.state.aux + 1;
          const value = "EST-" + count;
          this.setState({
            id: value,
            aux: this.state.aux + 1
          });
        });
      });
  }

  getTakenArea() {
    const { farm } = this.state;
    fs.collection("Estimations")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          const result = this.state.taken - doc.data().Area;
          this.setState({
            taken: result
          });
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

  save = () => {
    const {
      selectedCultivation,
      selectedEspecie,
      variedadSelected,
      sCultivationArea,
      cultivationArea,
      farm,
      id
    } = this.state;
    if (
      selectedCultivation != "" &&
      variedadSelected != "" &&
      selectedEspecie != "" &&
      sCultivationArea
    ) {
      this.setState({
        preloader: true,
        save: true
      });
      fs.collection("const")
        .where("Tipo", "==", selectedCultivation)
        .where("Variedad", "==", variedadSelected)
        .where("Especie", "==", selectedEspecie)
        .get()
        .then(query => {
          query.forEach(doc => {
            fs.collection("Estimations")
              .add({
                id,
                idFarm: farm.id,
                Tipo: doc.data().Tipo,
                Especie: doc.data().Especie,
                Variedad: doc.data().Variedad,
                Ciclo: doc.data().Ciclo,
                Distancia: doc.data().Distancia,
                Altitud: doc.data().Altitud,
                Altura: doc.data().Altura,
                Area: parseFloat(cultivationArea),
                PH: doc.data().PH,
                Propagacion: doc.data().Propagacion,
                Riego: doc.data().Riego,
                Surco: parseFloat(doc.data().Surco),
                estimatedPrice: parseFloat(doc.data().estimatedPrice),
                harvestCheck: false,
                nCientifico: doc.data().nCientifico,
                schuledingCheck: false,
                seedCheck: false,
                soilCheck: false,
                weightPlant: parseFloat(doc.data().weightPlant)
              })
              .then(doc => {
                this.props.navigation.state.params.save(doc.id);
              })
              .then(() => {
                this.props.navigation.navigate("Estimaciones");
              });
          });
        });
    } else {
      Alert.alert(
        "Guardar Estimación",
        "Revise que los campos esten corectos!",
        [
          {
            text: "Aceptar"
          }
        ],
        { cancelable: false }
      );
    }
  };

  // :::::::::::::::::::::: VALIDATIONS::::::::::::::::::::::
  validate = (text, type) => {
    const regexCultivationArea = /\d{2,15}/;

    if (type == "cultivationArea") {
      if (
        regexCultivationArea.test(text) &&
        parseFloat(text) < this.state.taken
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
              <Title style={{ color: "#fff" }}>NUEVA</Title>
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
                      value={this.state.taken + " m2"}
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
                      value={this.state.id.toString()}
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
                  dropdownPosition={-2}
                  onChangeText={value => {
                    this.getEspeciesValues(value);
                  }}
                />
                <Dropdown
                  label="Especie"
                  containerStyle={{ width: "90%" }}
                  dropdownMargins={{ min: 5, max: 20 }}
                  data={this.state.especiesList}
                  onChangeText={value => {
                    this.getVariedadValues(value);
                  }}
                />
                <Dropdown
                  label="Variedad"
                  containerStyle={{ width: "90%" }}
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
                      flex: 50,
                      marginRight: "5%",
                      marginTop: 35
                    }}
                  >
                    <Item
                      style={{ width: "95%" }}
                      success={this.state.sCultivationArea}
                      error={this.state.eCultivationArea}
                    >
                      <Icon name="ios-checkbox" />
                      <Input
                        maxLength={15}
                        style={{ fontSize: 18 }}
                        placeholder="Área a cultivar"
                        keyboardType="numeric"
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
                  <Button
                    style={style.addButton}
                    full
                    rounded
                    success
                    onPress={this.save}
                    disabled={this.state.save}
                  >
                    <Text style={{ color: "white" }}>GUARDAR</Text>
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
