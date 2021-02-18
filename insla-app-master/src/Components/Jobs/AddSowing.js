import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert
} from "react-native";
import { fs, firebase } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Header,
  Left,
  Body,
  Right,
  Title,
  Picker,
  Input,
  Label,
  Form,
  Icon,
  Item,
  Button
} from "native-base";

export default class AddSowing extends Component {
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
      profundidad: " ",
      dimension: " ",
      proceso: " ",
      isLoading: false,
      dias: " ",
      personas: " ",
      pago: " ",
      propsJobsNavigation: []
    };
  }
  componentDidMount() {
    this.setState({
      propsJobsNavigation: [
        ...this.state.propsJobsNavigation,
        this.props.navigation.state.params
      ]
    });
  }

  onValueChange(value) {
    this.setState({
      proceso: value
    });
  }

  saveSowing = () => {
    if (
      this.state.profundidad == 0 ||
      this.state.dimension == 0 ||
      this.state.proceso == "" ||
      this.state.dias == 0 ||
      this.state.pago == 0 ||
      this.state.personas == 0
    ) {
      Alert.alert("", "Favor ingrese todos los valores", [], {
        cancelable: true
      });
    } else if (this.state.profundidad > 50) {
      Alert.alert("", "Favor ingrese una profundidad mas pequeña", [], {
        cancelable: true
      });
    } else if (this.state.dimension > 200000000) {
      Alert.alert("", "Favor ingrese una dimension mas pequeña", [], {
        cancelable: true
      });
    } else if (this.state.dias > 200) {
      Alert.alert("", "Favor ingrese una cantidad de dias mas pequeña", [], {
        cancelable: true
      });
    } else if (this.state.pago > 2000) {
      Alert.alert(
        "",
        "Favor ingrese una cantidad mas pequeña de pago por dia de cada trabajador",
        [],
        {
          cancelable: true
        }
      );
    } else if (this.state.personas > 1500) {
      Alert.alert(
        "",
        "Favor ingrese una cantidad de personas trabajando mas pequeña",
        [],
        {
          cancelable: true
        }
      );
    } else {
      fs.collection("Labores")
        .add({
          idEstimation: this.state.propsJobsNavigation[0].id,
          Produndidad: this.state.profundidad,
          Dimension: this.state.dimension,
          Proceso: this.state.proceso,
          Dias: this.state.dias,
          Pago: this.state.pago,
          Personas: this.state.personas
        })
        .then(() => {
          this.setState({
            profundidad: 0,
            dimension: 0,
            proceso: 0,
            isLoading: false
          }),
            this.props.navigation.navigate("App");
        })
        .catch(error => {
          console.error("Error adding document: ", error);
          this.setState({
            isLoading: false
          });
        });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Header style={styles.headerStyle}>
          <Left>
            <MaterialIcons
              name="arrow-back"
              style={styles.iconStyle}
              onPress={() => this.props.navigation.navigate("Labores")}
            />
          </Left>
          <Body>
            <Title style={styles.titleStyle}>Siembra</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView scrollEnabled="False">
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardOpeningTime={250}
            ScroolEnable={false}
          >
            <Form style={{ alignItems: "stretch" }}>
              <View>
                <View>
                  <Item floatingLabel>
                    <Icon name="ios-checkbox" />
                    <Label>Dimension del Area</Label>
                    <Input
                      keyboardType="numeric"
                      onChangeText={dimension => this.setState({ dimension })}
                    />
                  </Item>
                </View>
                <View>
                  <Item floatingLabel>
                    <Icon name="ios-checkbox" />
                    <Label>Profundidad de la Siembra</Label>
                    <Input
                      keyboardType="numeric"
                      onChangeText={profundidad =>
                        this.setState({ profundidad })
                      }
                    />
                  </Item>
                </View>
                <Item>
                  <Label>Tipo de Proceso</Label>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    placeholder="Proceso de Siembra"
                    style={styles.pickerStyle}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.proceso}
                    onValueChange={this.onValueChange.bind(this)}
                  >
                    <Picker.Item label="" value="" />
                    <Picker.Item label="Mecánico" value="Mecánico" />
                    <Picker.Item label="Manual" value="Manual" />
                  </Picker>
                </Item>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "flex-start"
                  }}
                >
                  <Item style={styles.itemStyle} floatingLabel>
                    <Label>Personas</Label>
                    <Input
                      keyboardType="numeric"
                      onChangeText={personas => {
                        this.setState({ personas });
                      }}
                    />
                  </Item>
                  <Item style={styles.itemStyle} floatingLabel>
                    <Label>Pago por Dia</Label>
                    <Input
                      keyboardType="numeric"
                      onChangeText={pago => {
                        this.setState({ pago });
                      }}
                    />
                  </Item>
                  <Item style={styles.itemStyle} floatingLabel>
                    <Label>Días a Trabajar</Label>
                    <Input
                      keyboardType="numeric"
                      onChangeText={dias => {
                        this.setState({ dias });
                      }}
                    />
                  </Item>
                </View>
              </View>
            </Form>
          </KeyboardAwareScrollView>
        </ScrollView>
        <Button
          style={styles.buttonStyle}
          full
          rounded
          success
          onPress={() => this.saveSowing()}
        >
          <Text style={{ color: "white" }}>AÑADIR</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    color: "#fff"
  },
  container: {},
  headerStyle: {
    borderBottomColor: "#fff",
    backgroundColor: "#077A65",
    marginTop: StatusBar.currentHeight
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  },
  pickerStyle: {
    borderStyle: "solid",
    height: 60,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#077A65"
  },
  buttonStyle: {
    backgroundColor: "#077A65",
    marginTop: 50,
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
  labelStyle: {
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10
  }
});
