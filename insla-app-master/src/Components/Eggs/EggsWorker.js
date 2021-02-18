import React, { Component } from "react";
import { Text, StyleSheet, Alert, ScrollView } from "react-native";
import {
  Header, Left, Right, Body, Icon, Container, Fab,
  ListItem, Thumbnail, Row
} from "native-base";
import { fs } from "../Firebase/config";

export default class EggsWorker extends Component {
  state = {
    eggsWorkers: [],
    Loaded: false
  }

  componentDidMount() {
    this.getEggsWorkers()
  }

  async createEggsWorker(newEggsWorker) {
    await fs.collection('eggsWorker').add(newEggsWorker)
    await fs.collection("employees").doc(newEggsWorker.employee).update({
      status: true
    });
  }

  async getEggsWorkers() {
    console.log(this.props.stage)
    const { production } = this.props.navigation.state.params
    const querySnapshot = await fs.collection("eggsWorker")
      .where("production", "==", production._id,)
      .where("workerStage", "==", this.props.stage)
      .get();
    let eggsWorkers = [];
    querySnapshot.forEach(doc => {
      
      const document = {
        _id: doc.id,
        ...doc.data()
      };
      eggsWorkers.push(document);
    });
    const populateCW = eggsWorkers.map(async cw => {
      const corralDoc = await fs.collection("employees")
        .doc(cw.employee)
        .get()
      cw.employeeData = corralDoc.data();
      return cw;
    });
    eggsWorkers = await Promise.all(populateCW)
    this.setState({
      eggsWorkers,
      Loaded: true
    });
  }

  deleteWorker(worker) {
    Alert.alert(
      "Borrar Empleado",
      "¿Esta seguro que desea borrar este empleado?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: async () => {
            await fs.collection("eggsWorker")
              .doc(worker._id)
              .delete()
            this.setState({
              eggsWorkers: this.state.eggsWorkers.filter((cw) => {
                return cw._id !== worker._id;
              })
            });
            await fs.collection("employees").doc(worker.employee).update({
              status: false
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const { farm, production } = this.props.navigation.state.params
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
    });
    return (
      <>
        <Container
          style={{
            marginLeft: 3,
            marginRight: 3
          }}
        >
          <ScrollView>
            {showEggsWorkers}
          </ScrollView>
        </Container>
        <Fab
          direction="up"
          style={{
            backgroundColor: "#077A65",
            padding: 0,
            margin: 0,
            position: "absolute"
          }}
          position="bottomRight"
          onPress={() => {
            this.props.navigation.navigate("EggsEmployeesList", {
              farm,
              onClick: (employee) => {
                console.log(employee.data());
                this.props.navigation.navigate("AddEggsWorker", {
                  employee: employee.data(),
                  onCreate: async (eggsWorker) => {
                    const newEggsWorker = {
                      ...eggsWorker,
                      employee: employee.id,
                      production: production._id,
                      workerStage: this.props.stage
                    };
                    await this.createEggsWorker(newEggsWorker);
                    console.log("guarda pero no sale")
                    if (this.props.stage == "1") {
                      console.log(this.props.stage);
                      this.props.navigation.navigate('EggsInitialStage');  
                    }else if (this.props.stage == "2") {
                      console.log(this.props.stage);
                      this.props.navigation.navigate('EggsGrowthStage');  
                    }else if (this.props.stage == "3") {
                      console.log(this.props.stage);
                      this.props.navigation.navigate('EggsFinalStage');  
                    }
                    await this.getEggsWorkers();
                  }
                });
              }
            });
          }}
        >
          <Icon type="FontAwesome5" name="plus" />
        </Fab>
      </>
    );
  }
}