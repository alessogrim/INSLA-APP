import React, { Component } from "react";
import { Text, StyleSheet, Alert, ScrollView } from "react-native";
import {
  Header, Left, Right, Body, Icon, Container, Fab,
  ListItem, Thumbnail, Row
} from "native-base";
import { fs } from "../Firebase/config";

export default class Worker extends Component {
  state = {
    chickenWorkers: [],
    Loaded: false
  }

  componentDidMount() {
    this.getChickenWorkers()
  }

  async createChickenWorker(newChickenWorker) {
    await fs.collection('chickenWorker').add(newChickenWorker)
    await fs.collection("employees").doc(newChickenWorker.employee).update({
      status: true
    });
  }

  async getChickenWorkers() {
    console.log(this.props.stage)
    const { production } = this.props.navigation.state.params
    const querySnapshot = await fs.collection("chickenWorker")
      .where("production", "==", production._id,)
      .where("workerStage", "==", this.props.stage)
      .get();
    let chickenWorkers = [];
    querySnapshot.forEach(doc => {
      
      const document = {
        _id: doc.id,
        ...doc.data()
      };
      chickenWorkers.push(document);
    });
    const populateCW = chickenWorkers.map(async cw => {
      const corralDoc = await fs.collection("employees")
        .doc(cw.employee)
        .get()
      cw.employeeData = corralDoc.data();
      return cw;
    });
    chickenWorkers = await Promise.all(populateCW)
    this.setState({
      chickenWorkers,
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
            await fs.collection("chickenWorker")
              .doc(worker._id)
              .delete()
            this.setState({
              chickenWorkers: this.state.chickenWorkers.filter((cw) => {
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
    const showChickenWorkers = this.state.chickenWorkers.map((cw) => {
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
            {showChickenWorkers}
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
            this.props.navigation.navigate("employeesList", {
              farm,
              onClick: (employee) => {
                console.log(employee.data());
                this.props.navigation.navigate("AddChickenWorker", {
                  employee: employee.data(),
                  onCreate: async (chickenWorker) => {
                    const newChickenWorker = {
                      ...chickenWorker,
                      employee: employee.id,
                      production: production._id,
                      workerStage: this.props.stage
                    };
                    await this.createChickenWorker(newChickenWorker);
                    if (this.props.stage == "2") {
                      console.log(this.props.stage);
                      console.log(newChickenWorker.workerStage)
                      this.props.navigation.navigate('GrowthStage');  
                    }else if (this.props.stage == "3") {
                      console.log(this.props.stage);
                      this.props.navigation.navigate('FinalStage');  
                    }
                    
                    await this.getChickenWorkers();
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