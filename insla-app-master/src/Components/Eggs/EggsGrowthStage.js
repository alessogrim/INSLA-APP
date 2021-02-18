import React, { Component } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import {
  Header, Left, Right, Body, Spinner, Title, Icon, Tab, Tabs, Container, Fab,
  ListItem, Thumbnail, Row, Button
} from "native-base";
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";
import EggsWorker from "./EggsWorker";
import EggsConcentrates from "./EggsConcentrates"

export default class GrowthStage extends Component {
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
      active: false,
      Loaded: true,
      farm: this.props.navigation.state.params,
      eggsWorkers: [],
      stage : "2"
    };
  }

  growthStage = () => {
    Alert.alert(
      "Terminar Etapa",
      "¿Esta seguro que desea terminar esta etapa ?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            const { production } = this.props.navigation.state.params;
            fs.collection("eggsProductions")
              .doc(production._id)
              .update({
                growthStage: true
              })
              .then(() => {
                production.growthStage = true;
                this.props.navigation.state.params.updateProduction(production)
                this.props.navigation.navigate("EggsProduction");
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const { Loaded } = this.state;
    const { farm, production } = this.props.navigation.state.params
    console.log("Producción")
    console.log(production)
    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      const showEggsWorkers = this.state.eggsWorkers.map((cw) => {

        return (
          <ListItem avatar>
            <Left>
              <Thumbnail
                source={require("../../../assets/perfilEmpleado.png")}
              />
            </Left>
            <Body>
              <Text>{cw.employeeData.name + " " + cw.employeeData.lastName}</Text>
              <Text note>
                {cw.employeeData.id.substr(0, 4) +
                  "-" +
                  cw.employeeData.id.substr(4, 4) +
                  "-" +
                  cw.employeeData.id.substr(8, 13)}
              </Text>
              <Text note>{`Total: L. ${cw.payDay * cw.dayWorked}`}</Text>
            </Body>
            <Right>
              <Row >
                <Icon
                  type="MaterialIcons"
                  name="delete"
                  style={{ color: "red", fontSize: 30 }}
                  onPress={() => this.deleteWorker(cw)}
                />
              </Row>
            </Right>
          </ListItem>
        )
      })
      return (
        <View style={styles.container}>
          <Header style={{
            height: 80,
            width: "100%",
            borderBottomColor: "#fff",
            backgroundColor: "#077A65"
          }}>
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={styles.iconStyle}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ width: 220, color: "#fff", fontSize: 17 }}>ETAPA DE CRECIMIENTO</Title>
            </Body>
            <Right></Right>
          </Header>
          <Button
            danger
            bordered
            onPress={() => {
              this.growthStage();
            }}
          >
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: 20,
                color: "#077A65"
              }}
            >
              ¿Desea terminar esta etapa?
            </Text>
          </Button>
          <Tabs>
            <Tab
              style={{
                height: "100%"
              }}
              heading="MANO OBRA"
              activeTextStyle={{ color: "#077A65" }}
            >
              <EggsWorker stage={this.state.stage} navigation={this.props.navigation}/>
            </Tab>
            <Tab heading="ALIMENTOS" activeTextStyle={{ color: "#077A65" }}>
              <EggsConcentrates stage={this.state.stage} navigation={this.props.navigation}/>
            </Tab>
          </Tabs>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  textStyle: {
    marginTop: 20,
    fontSize: 25,
    textAlign: "center"
  },
  container: {
    flex: 1
  },
  fab: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "red"
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  }
});
