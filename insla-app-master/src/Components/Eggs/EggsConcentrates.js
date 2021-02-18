import React, { Component } from "react";
import { Text, StyleSheet, Alert, ScrollView } from "react-native";
import {
  Header, Left, Right, Body, Icon, Container, Fab,
  ListItem, Thumbnail, Row
} from "native-base";
import { fs } from "../Firebase/config";

export default class Concentrates extends Component {
  state = {
    concentrates: [],
    Loaded: false
  }

  componentDidMount() {
    this.getConcentrates()
  }

  async createConcentrates(newConcentrate) {
    await fs.collection('eggsConcentrate').add(newConcentrate)
    // await fs.collection("employees").doc(newConcentrate.employee).update({
    //   status: true
    // });
  }

  async getConcentrates() {
    const { production } = this.props.navigation.state.params
    const querySnapshot = await fs.collection("eggsConcentrate")
      .where("production", "==", production._id)
      .where("concentrateStage", "==", this.props.stage)
      .get();
    let concentrates = [];
    querySnapshot.forEach(doc => {
      const document = {
        _id: doc.id,
        ...doc.data()
      };
      concentrates.push(document);
    });
    const populeteConcentrate = concentrates.map(async concentrate => {
      const concentrateDoc = await fs.collection("concentrate")
        .doc(concentrate.concentrate)
        .get()
      concentrate.concentrateData = concentrateDoc.data();
      console.log(concentrate.concentrateData)
      return concentrate;
    });
    concentrates = await Promise.all(populeteConcentrate)
    this.setState({
      concentrates,
      Loaded: true
    });
  }

  deleteConcentrate(concentrate) {
    Alert.alert(
      "Borrar Producción",
      "¿Esta seguro que desea borrar este alimento?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: async () => {
            await fs.collection("eggsConcentrate")
              .doc(concentrate._id)
              .delete()
            this.setState({
              concentrates: this.state.concentrates.filter((ali) => {
                return ali._id !== concentrate._id;
              })
            });
            // await fs.collection("employees").doc(concentrate.employee).update({
            //   status: false
            // });
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const { farm, production } = this.props.navigation.state.params
    const showConcentrates = this.state.concentrates.map((ali) => {
      return (
        <ListItem avatar>
          <Left>
            <Thumbnail
              source={require("../../../assets/straw.png")}
            />
          </Left>
          <Body>
            <Text>{ali.concentrateData.name}</Text>
            <Text note>
              {ali.concentrateData.id.substr(0, 4) +
                "-" +
                ali.concentrateData.id.substr(4, 4) +
                "-" +
                ali.concentrateData.id.substr(8, 13)}
            </Text>
            <Text note>{`Cantidad: ${ali.quantity}`}</Text>
          </Body>
          <Right>
            <Row >
              <Icon
                type="MaterialIcons"
                name="delete"
                style={{ color: "red", fontSize: 30 }}
                onPress={() => this.deleteConcentrate(ali)}
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
            {showConcentrates}
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
            this.props.navigation.navigate("concentrate", {
              farm,
              onSelect: (concentrate) => {
                console.log(concentrate.data());
                this.props.navigation.navigate("AddEggsConcentrate", {
                  concentrate: concentrate.data(),
                  onCreate: async (eggsConcentrate) => {
                    const newEggsConcentrate = {
                      ...eggsConcentrate,
                      concentrate: concentrate.id,
                      production: production._id,
                      concentrateStage: this.props.stage 
                    };
                    await this.createConcentrates(newEggsConcentrate);
                    if (this.props.stage == "1") {
                      this.props.navigation.navigate('EggsInitialStage');  
                    }else if (this.props.stage == "2") {
                      this.props.navigation.navigate('EggsGrowthStage');  
                    }
                    await this.getConcentrates();
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
